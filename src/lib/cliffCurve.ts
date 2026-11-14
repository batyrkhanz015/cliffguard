import { TY2026, reconcile, type Diagnosis, type HouseholdInput, type ReconcileInput } from '@/engine';

/** One point of the cliff chart: what the household repays at filing for a given MAGI. */
export type CurvePoint = { magi: number; repayment: number };

const STEP = 250;
const MARGIN_BELOW = 20_000;
const MARGIN_ABOVE = 20_000;
/** Keeps a marker (the slider's dot) clear of the chart's right edge. */
const MARKER_ROOM = 2_000;

/** The Form 8962 inputs for this household at a given MAGI, built as `diagnose` builds them. */
export function reconcileInputFor(input: HouseholdInput, diagnosis: Diagnosis, magi: number): ReconcileInput {
  const { marketplace } = input;
  const catastrophic = marketplace.planMetal === 'catastrophic';
  return {
    magi,
    state: input.state,
    householdSize: input.householdSize,
    filingStatus: input.filingStatus,
    slcspAnnual: diagnosis.slcsp.annual,
    aptcMonthly: catastrophic ? 0 : marketplace.aptcMonthly,
    monthsWithAptc: marketplace.monthsWithAptc,
    premiumMonthly: catastrophic ? 0 : marketplace.premiumMonthly,
  };
}

/**
 * Repayment against MAGI from $20k under the lower of the estimate and the marked points to
 * $20k over the cliff, in $250 steps. `cliff` and `cliff + 1` are always included so the wall is
 * vertical. Marked points beyond the cliff widen the range so they stay on the curve.
 */
export function cliffCurve(input: HouseholdInput, diagnosis: Diagnosis, markedMagis: readonly number[]): CurvePoint[] {
  const { cliff } = diagnosis;
  const low = Math.min(input.marketplace.incomeEstimate, diagnosis.income.magi, ...markedMagis);
  const start = Math.max(0, Math.floor((low - MARGIN_BELOW) / STEP) * STEP);
  const end = Math.max(cliff + MARGIN_ABOVE, Math.max(...markedMagis) + MARKER_ROOM);

  const magis = new Set<number>([cliff, cliff + 1, end]);
  for (let magi = start; magi <= end; magi += STEP) magis.add(magi);

  return [...magis]
    .sort((a, b) => a - b)
    .map((magi) => ({ magi, repayment: reconcile(reconcileInputFor(input, diagnosis, magi), TY2026).repayment }));
}
