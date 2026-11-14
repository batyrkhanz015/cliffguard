import type { Move, PlanResult } from '@/engine';

/**
 * Stand-in for the server's `PlanSummary` (spec §D, `src/server/redact.ts`): a `PlanResult` whose
 * moves keep their name, deadline and liquidity but have the amounts and instructions removed.
 * Mirrors the server type for the UI until Task 6 is merged; then it is replaced by that type.
 */
export type PlanSummaryMove = Omit<Move, 'amount' | 'magiReduction' | 'howTo' | 'proof'> & {
  /** The lever's display name. */
  name: string;
  amount: null;
  magiReduction: null;
  howTo: null;
  proof: null;
  locked: true;
};

export type PlanSummary = Omit<PlanResult, 'moves'> & { moves: PlanSummaryMove[] };
