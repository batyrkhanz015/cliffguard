import { expect } from 'vitest';
import { DANI } from '@/samples/dani';
import type { ReconcileInput } from '../reconcile';

/** Spec §B: dollar fixtures pass within ±$1 unless a row says otherwise. */
export function expectDollars(actual: number, expected: number, tolerance = 1): void {
  const message = `${actual} vs expected ${expected} ±${tolerance}`;
  expect(Math.abs(actual - expected), message).toBeLessThanOrEqual(tolerance);
}

/** Spec §B F1: Dani, where you stand. */
export const F1 = {
  fpl: 32_150,
  cliff: 128_600,
  halfSeTax: 6_464,
  agi: 121_536,
  magi: 122_036,
  fplPercent: 379,
  applicableFigure: 0.0996,
  slcsp: 19_800,
  aptcReceived: 9_342,
  ptcAllowed: 7_645,
  repayment: 1_697,
  headroom: 6_564,
  daysToYearEnd: 47,
} as const;

/** Dani's reconciliation inputs at F1, with the F1 benchmark; tests vary `magi` (F2). */
export const DANI_RECONCILE: ReconcileInput = {
  magi: F1.magi,
  state: DANI.state,
  householdSize: DANI.householdSize,
  filingStatus: DANI.filingStatus,
  slcspAnnual: F1.slcsp,
  aptcMonthly: DANI.marketplace.aptcMonthly,
  monthsWithAptc: DANI.marketplace.monthsWithAptc,
  premiumMonthly: DANI.marketplace.premiumMonthly,
};
