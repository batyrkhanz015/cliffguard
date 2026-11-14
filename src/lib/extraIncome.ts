import { diagnose, type Diagnosis, type HouseholdInput } from '@/engine';

/** The slider's range: extra 1099 income, in whole dollars. */
export const EXTRA_INCOME_MAX = 40_000;
export const EXTRA_INCOME_STEP = 500;

/** The year again with `extra` dollars of income added, computed in the browser by the pure engine. */
export function withExtraIncome(input: HouseholdInput, base: Diagnosis, extra: number): Diagnosis {
  return diagnose(input, { gig: { amount: extra, canBillInJanuary: false }, asOf: base.asOf });
}
