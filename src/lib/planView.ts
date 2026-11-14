import type { GigCheckResult, LeverId, Move, PlanResult } from '@/engine';

/**
 * The plan as the API sends it (spec §D). Types only, so client components can import them;
 * `src/server/redact.ts` builds these values. Unpaid sessions see each move's lever, name,
 * deadline and liquidity but not its amount, MAGI reduction, how-to or proof.
 */

type PaidField = 'amount' | 'magiReduction' | 'howTo' | 'proof';

export type LockedMove = Omit<Move, PaidField> & { [field in PaidField]: null } & { name: string; locked: true };
export type UnlockedMove = Move & { name: string; locked: false };

export type PlanSummary = Omit<PlanResult, 'moves'> & { moves: LockedMove[] };
export type UnlockedPlan = Omit<PlanResult, 'moves'> & { moves: UnlockedMove[] };
export type PlanView = PlanSummary | UnlockedPlan;

export type GigCheckView = Omit<GigCheckResult, 'plan'> & { plan: PlanView };

/** One row of the plan screen's lever list; names and eligibility reasons are not paid content. */
export type LeverRow = { leverId: LeverId; name: string; eligible: boolean; reason: string | null };
