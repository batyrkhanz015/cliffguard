import { applicableFigure, requiredContribution } from './applicable';
import { cliffAmount, fplPercent, householdIncome, povertyLine } from './fpl';
import type { FilingStatus, RuleSet, UsStateCode } from './types';

export type ReconcileInput = {
  magi: number;
  state: UsStateCode;
  householdSize: number;
  /** Benchmark (SLCSP) premium for the year: 12 × the monthly amount. */
  slcspAnnual: number;
  aptcMonthly: number;
  monthsWithAptc: number;
  /** Premium before the credit; null when not given, so the credit is not capped by it. */
  premiumMonthly: number | null;
  filingStatus: FilingStatus;
};

/** Form 8962 for the year, in floating dollars except `repayment` and `refund` (whole dollars). */
export type Reconciliation = {
  fpl: number;
  /** Null for rule sets without a cliff. */
  cliff: number | null;
  fplPercent: number;
  overCliff: boolean;
  /** Null above the cliff: no credit. */
  applicableFigure: number | null;
  /** Line 8a; 0 above the cliff. */
  annualContribution: number;
  ptcAllowed: number;
  aptcReceived: number;
  repayment: number;
  refund: number;
};

/** Most excess credit the filer repays; unlimited when the rules have no caps or at ≥ 400%. */
function repaymentLimit(fplPct: number, filingStatus: FilingStatus, rules: RuleSet): number {
  const cap = rules.repaymentCaps?.find((band) => fplPct < band.belowPct);
  if (cap === undefined) return Infinity;
  return filingStatus === 'single' ? cap.single : cap.other;
}

/**
 * Premium tax credit allowed for the year versus the advance credit paid, and the difference
 * owed (repayment) or due (refund) at filing. Pure and client-safe: the income slider uses it.
 */
export function reconcile(p: ReconcileInput, rules: RuleSet): Reconciliation {
  const fpl = povertyLine(p.state, p.householdSize, rules);
  const cliff = cliffAmount(p.state, p.householdSize, rules);
  const pct = fplPercent(p.magi, fpl, rules);
  const figure = applicableFigure(pct, rules);
  const annualContribution = figure === null ? 0 : requiredContribution(p.magi, figure);

  // Per month: the smaller of the premium and the benchmark minus the contribution (col. e).
  const benchmarkGap = Math.max(0, p.slcspAnnual - annualContribution) / 12;
  const ptcMonthly = figure === null ? 0 : Math.min(p.premiumMonthly ?? Infinity, benchmarkGap);
  const ptcAllowed = ptcMonthly * p.monthsWithAptc;
  const aptcReceived = p.aptcMonthly * p.monthsWithAptc;
  const excess = Math.max(0, aptcReceived - ptcAllowed);

  return {
    fpl,
    cliff,
    fplPercent: pct,
    overCliff: cliff !== null && householdIncome(p.magi) > cliff,
    applicableFigure: figure,
    annualContribution,
    ptcAllowed,
    aptcReceived,
    repayment: Math.round(Math.min(excess, repaymentLimit(pct, p.filingStatus, rules))),
    refund: Math.round(Math.max(0, ptcAllowed - aptcReceived)),
  };
}
