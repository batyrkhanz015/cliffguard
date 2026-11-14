import 'server-only';
import type { GigCheckResult, Move, PlanResult } from '@/engine';
import { LEVER_COPY } from '@/engine/server';
import type { GigCheckView, LockedMove, PlanSummary, PlanView, UnlockedPlan } from '@/lib/planView';
import type { HouseholdRecord } from './household';
import type { CheckinView } from '@/lib/checkinView';
import { todayAsOf } from './clock';
import { householdScope } from '@/lib/householdScope';

/** What the browser may see of the server's results (spec §D). Pure functions. */

/** An allowlist, so a field added to `Move` later stays hidden until it is listed here. */
const lockMove = (move: Move): LockedMove => ({
  leverId: move.leverId,
  adultId: move.adultId,
  name: LEVER_COPY[move.leverId].name,
  deadline: move.deadline,
  liquidity: move.liquidity,
  returnLocation: move.returnLocation,
  warnings: move.warnings,
  amount: null,
  magiReduction: null,
  howTo: null,
  proof: null,
  locked: true,
});

/** The plan without the paid details; totals and the verdict stay. */
export function redactPlan(plan: PlanResult): PlanSummary {
  return { ...plan, moves: plan.moves.map(lockMove) };
}

/** The full plan for an entitled session, with each lever's name. */
export function unlockPlan(plan: PlanResult): UnlockedPlan {
  return {
    ...plan,
    moves: plan.moves.map((move) => ({ ...move, name: LEVER_COPY[move.leverId].name, locked: false })),
  };
}

export const planView = (plan: PlanResult, entitled: boolean): PlanView =>
  entitled ? unlockPlan(plan) : redactPlan(plan);

export const gigCheckView = (gig: GigCheckResult, entitled: boolean): GigCheckView => ({
  ...gig,
  plan: planView(gig.plan, entitled),
});

export type HouseholdView = Omit<HouseholdRecord, 'sid' | 'checkins' | 'entitlement' | 'checkinIdentity'> & {
  householdScope: string;
  checkins: CheckinView[];
  entitlement: { product: 'rescue' | 'year'; validUntil: string } | null;
};

/** Retry fingerprints and calculation snapshots stay on the server. */
export function publicCheckin(checkin: HouseholdRecord['checkins'][number]): CheckinView {
  const { id, asOf, received, expectedRestAfter, result, baseline } = checkin;
  return { id, asOf, received, expectedRestAfter, result, ...(baseline ? { baseline } : {}) };
}

/** Public household fields only; Year history needs active access even through legacy endpoints. */
export const householdView = (record: HouseholdRecord, asOf: string = todayAsOf()): HouseholdView => ({
  version: record.version,
  householdScope: householdScope(record),
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  source: record.source,
  input: record.input,
  lastGig: record.lastGig,
  planProgress: record.planProgress,
  checkins: record.entitlement?.product === 'year' && record.entitlement.validUntil >= asOf ? record.checkins.map(publicCheckin) : [],
  entitlement: record.entitlement ? { product: record.entitlement.product, validUntil: record.entitlement.validUntil } : null,
});
