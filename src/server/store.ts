import 'server-only';
import { Redis } from '@upstash/redis';

/** Key-value storage for session state, counters and rate-limit windows (spec §D keys). */
export type Store = {
  /** The stored value, or null when missing or expired. Unvalidated: callers parse it. */
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, ttlSec?: number): Promise<void>;
  del(key: string): Promise<void>;
  /** Adds 1 and returns the new count; a TTL is set when the key is created. */
  incr(key: string, ttlSec?: number): Promise<number>;
};

/** Production has no Upstash credentials: storage fails loudly instead of silently forgetting. */
export class StoreUnavailableError extends Error {
  constructor() {
    super('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production');
    this.name = 'StoreUnavailableError';
  }
}

type Env = Partial<Record<'UPSTASH_REDIS_REST_URL' | 'UPSTASH_REDIS_REST_TOKEN' | 'NODE_ENV', string>>;
export type Backend = { kind: 'upstash'; redis: Redis } | { kind: 'memory' } | { kind: 'unavailable' };

/** Global Constraints: Upstash when configured; in-memory only outside production. */
export function backendFor(env: Env): Backend {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { kind: 'upstash', redis: new Redis({ url, token }) };
  return env.NODE_ENV === 'production' ? { kind: 'unavailable' } : { kind: 'memory' };
}

function upstashStore(redis: Redis): Store {
  return {
    get: (key) => redis.get(key),
    async set(key, value, ttlSec) {
      await (ttlSec === undefined ? redis.set(key, value) : redis.set(key, value, { ex: ttlSec }));
    },
    async del(key) {
      await redis.del(key);
    },
    async incr(key, ttlSec) {
      const count = await redis.incr(key);
      if (count === 1 && ttlSec !== undefined) await redis.expire(key, ttlSec);
      return count;
    },
  };
}

type Entry = { json: string; expiresAt: number | null };
/** Kept on `globalThis` so dev hot reloads don't wipe the session. */
const memory = globalThis as typeof globalThis & { cliffguardMemoryStore?: Map<string, Entry> };

/** Dev and test stand-in for Redis. Values go through JSON, as they would in Redis. */
function memoryStore(): Store {
  const entries = (memory.cliffguardMemoryStore ??= new Map());
  const expiry = (ttlSec?: number) => (ttlSec === undefined ? null : Date.now() + ttlSec * 1000);
  const live = (key: string): Entry | undefined => {
    const entry = entries.get(key);
    if (entry?.expiresAt != null && entry.expiresAt <= Date.now()) {
      entries.delete(key);
      return undefined;
    }
    return entry;
  };

  return {
    async get(key) {
      const entry = live(key);
      return entry === undefined ? null : JSON.parse(entry.json);
    },
    async set(key, value, ttlSec) {
      entries.set(key, { json: JSON.stringify(value), expiresAt: expiry(ttlSec) });
    },
    async del(key) {
      entries.delete(key);
    },
    async incr(key, ttlSec) {
      const entry = live(key);
      const count = (entry === undefined ? 0 : Number(JSON.parse(entry.json))) + 1;
      entries.set(key, { json: JSON.stringify(count), expiresAt: entry?.expiresAt ?? expiry(ttlSec) });
      return count;
    },
  };
}

function unavailableStore(): Store {
  const fail = async (): Promise<never> => {
    throw new StoreUnavailableError();
  };
  return { get: fail, set: fail, del: fail, incr: fail };
}

export const backend = backendFor(process.env);

export const store: Store =
  backend.kind === 'upstash'
    ? upstashStore(backend.redis)
    : backend.kind === 'memory'
      ? memoryStore()
      : unavailableStore();
