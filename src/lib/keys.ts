import type { LeverId } from '@/engine';

/** Unique per move: a lever such as the IRA can appear once for each adult. */
export function moveKey(move: { leverId: LeverId; adultId?: string | null }): string {
  return `${move.leverId}-${move.adultId ?? 'household'}`;
}

/**
 * Remount key for one sibling that must reset on each plan read. Siblings share the
 * revision number, so each needs its own scope or React sees duplicate keys.
 */
export function revisionKey(scope: string, revision: number): string {
  return `${scope}-${revision}`;
}
