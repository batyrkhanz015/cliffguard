import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import type { Redis } from '@upstash/redis';
import { ApiError } from './errors';
import { backend, store, storeCall } from './store';

export type LimitResult = { ok: boolean; retryAfterSec: number };
type Limiter = (name: string, id: string, max: number, windowSec: number) => Promise<LimitResult>;

const secondsUntil = (epochMs: number): number => Math.max(1, Math.ceil((epochMs - Date.now()) / 1000));

/** Sliding windows in Upstash under `cg:rl:{name}:{id}`; one limiter per rule. */
function upstashLimiter(redis: Redis): Limiter {
  const limiters = new Map<string, Ratelimit>();
  return async (name, id, max, windowSec) => {
    const rule = `${name}:${max}:${windowSec}`;
    let limiter = limiters.get(rule);
    if (limiter === undefined) {
      limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
        prefix: `cg:rl:${name}`,
      });
      limiters.set(rule, limiter);
    }
    const { success, reset } = await limiter.limit(id);
    return { ok: success, retryAfterSec: success ? 0 : secondsUntil(reset) };
  };
}

/** Fixed windows counted in the store: the in-memory store in dev, or a store that reports itself unavailable. */
const windowLimiter: Limiter = async (name, id, max, windowSec) => {
  const windowMs = windowSec * 1000;
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const count = await store.incr(`cg:rl:${name}:${id}:${windowStart}`, windowSec);
  return { ok: count <= max, retryAfterSec: count <= max ? 0 : secondsUntil(windowStart + windowMs) };
};

const limiter: Limiter = backend.kind === 'upstash' ? upstashLimiter(backend.redis) : windowLimiter;

/**
 * Counts one request by `id` (a session id or an IP) against `max` per `windowSec` for the rule
 * `name`. The limiter only talks to storage, so its failures are StoreUnavailableError (503).
 */
export function limit(name: string, id: string, max: number, windowSec: number): Promise<LimitResult> {
  return storeCall(() => limiter(name, id, max, windowSec));
}

const MINUTE = 60;

/** Spec §D route limits; the comment says what `id` counts. */
export const LIMITS = {
  /**
   * per IP, shared by the routes that can create a household record (sample, PUT). Session limits
   * reset when a client drops its cookie; this one doesn't. Roomy enough for a judging room behind
   * one NAT, while one address can't mint more than ~17k records a day.
   */
  recordWriteIp: { max: 120, windowSec: 10 * MINUTE },
  /** per IP */
  householdRead: { max: 120, windowSec: MINUTE },
  /** per session */
  householdWrite: { max: 60, windowSec: MINUTE },
  sample: { max: 30, windowSec: MINUTE },
  gigCheck: { max: 60, windowSec: MINUTE },
  plan: { max: 120, windowSec: MINUTE },
  progress: { max: 60, windowSec: MINUTE },
} as const satisfies Record<string, { max: number; windowSec: number }>;
export type LimitName = keyof typeof LIMITS;

/** Counts the request against the route's limit; throws RATE_LIMITED (429 with Retry-After) once over it. */
export async function enforceLimit(name: LimitName, id: string): Promise<void> {
  const { max, windowSec } = LIMITS[name];
  const { ok, retryAfterSec } = await limit(name, id, max, windowSec);
  if (!ok) {
    throw new ApiError('RATE_LIMITED', 429, `Too many requests. Try again in ${retryAfterSec} seconds.`, {
      retryAfterSec,
    });
  }
}
