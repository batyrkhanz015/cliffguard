import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { store } from '@/server/store';

const CALL_TTL_SECONDS = 2 * 24 * 60 * 60;
export const EXTRACTION_TIMEOUT_MS = 25_000;
export const dailyCallKey = () => `cg:claude:calls:${new Date().toISOString().slice(0, 10)}`;
function configuredCap(): number {
  const cap = Number(process.env.CLAUDE_DAILY_CALL_CAP ?? '1000');
  return Number.isSafeInteger(cap) && cap > 0 ? cap : 0;
}
function configured(): boolean {
  return process.env.CLAUDE_ENABLED !== 'false' && Boolean(process.env.ANTHROPIC_API_KEY?.trim()) && configuredCap() > 0;
}

/** A read-only availability hint; reserveClaudeCall is the authority under concurrency. */
export async function claudeAvailable(): Promise<boolean> {
  if (!configured()) return false;
  try {
    const count = await store.get(dailyCallKey());
    return count === null || (typeof count === 'number' && count < configuredCap());
  } catch { return false; }
}

/** Reserve BEFORE dispatch. Failed calls consume a slot; simultaneous requests cannot overspend the cap. */
export async function reserveClaudeCall(): Promise<boolean> {
  if (!configured()) return false;
  try { return await store.incr(dailyCallKey(), CALL_TTL_SECONDS) <= configuredCap(); }
  catch { return false; }
}

export function createClaudeClient(): Anthropic {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    maxRetries: 0,
    timeout: EXTRACTION_TIMEOUT_MS,
    // Explicitly override ANTHROPIC_LOG=debug and parser logging as well.
    logLevel: 'off',
    logger: { error() {}, warn() {}, info() {}, debug() {} },
  });
}
