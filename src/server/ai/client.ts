import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { store } from '@/server/store';

const CALL_TTL_SECONDS = 2 * 24 * 60 * 60;
export const EXTRACTION_TIMEOUT_MS = 25_000;
export type AiProvider = 'openai' | 'anthropic';
/** Explicit selection fails closed; existing Anthropic-only installations keep working. */
export function aiProvider(): AiProvider | null {
  const selected = process.env.AI_PROVIDER ?? (process.env.OPENAI_API_KEY?.trim() ? 'openai' : 'anthropic');
  return selected === 'openai' || selected === 'anthropic' ? selected : null;
}
export const openAiModel = () => process.env.OPENAI_MODEL?.trim() || 'gpt-6.1-sol';
export const aiSource = () => aiProvider() === 'openai' ? 'openai' as const : 'claude' as const;
export const aiCacheVersion = () => `${aiProvider()}:${aiProvider() === 'openai' ? openAiModel() : 'claude-opus-5-5'}:v1`;
/** Both providers share one counter; changing providers never resets the daily allowance. */
export const dailyCallKey = () => `cg:ai:calls:${new Date().toISOString().slice(0, 10)}`;
function configuredCap(): number {
  const cap = Number(process.env.AI_DAILY_CALL_CAP ?? (aiProvider() === 'anthropic' ? process.env.CLAUDE_DAILY_CALL_CAP ?? '1000' : '100'));
  return Number.isSafeInteger(cap) && cap > 0 ? cap : 0;
}
function configured(): boolean {
  if (process.env.AI_ENABLED === 'false' || configuredCap() <= 0) return false;
  if (aiProvider() === 'openai') return Boolean(process.env.OPENAI_API_KEY?.trim());
  return aiProvider() === 'anthropic' && process.env.CLAUDE_ENABLED !== 'false' && Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

/** A read-only availability hint; reserveAiCall is the authority under concurrency. */
export async function aiAvailable(): Promise<boolean> {
  if (!configured()) return false;
  try {
    const count = await store.get(dailyCallKey());
    return count === null || (typeof count === 'number' && count < configuredCap());
  } catch { return false; }
}

/** Reserve BEFORE dispatch. Failed calls consume a slot; simultaneous requests cannot overspend the cap. */
export async function reserveAiCall(): Promise<boolean> {
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
