import type { FplLine, RuleSet, UsStateCode } from './types';

/** Form 8962 line 5 value when household income is above the cliff. */
const OVER_CLIFF_FPL_PERCENT = 401;

function fplLineFor(state: UsStateCode, rules: RuleSet): FplLine {
  if (state === 'AK') return rules.fpl.alaska;
  if (state === 'HI') return rules.fpl.hawaii;
  return rules.fpl.contiguous;
}

/** Federal poverty line for the tax family; Alaska and Hawaii have their own tables. */
export function povertyLine(state: UsStateCode, householdSize: number, rules: RuleSet): number {
  const line = fplLineFor(state, rules);
  return line.base + line.perAdditional * (householdSize - 1);
}

/** Highest household income that still qualifies for the credit, or null when there is no cliff. */
export function cliffAmount(state: UsStateCode, householdSize: number, rules: RuleSet): number | null {
  return rules.cliffMultiple === null ? null : rules.cliffMultiple * povertyLine(state, householdSize, rules);
}

/** Household income (Form 8962 line 3): MAGI rounded to whole dollars, and 0 if negative. */
export function householdIncome(magi: number): number {
  return Math.max(0, Math.round(magi));
}

/**
 * Household income as a whole-number percent of the poverty line (Form 8962 lines 3–5),
 * truncated; 401 when it is above the cliff.
 */
export function fplPercent(income: number, fpl: number, rules: RuleSet): number {
  const dollars = householdIncome(income);
  if (rules.cliffMultiple !== null && dollars > rules.cliffMultiple * fpl) return OVER_CLIFF_FPL_PERCENT;
  return Math.floor((dollars * 100) / fpl);
}
