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

/**
 * Household income as a whole-number percent of the poverty line (Form 8962 lines 3–5):
 * income rounded to whole dollars and floored at 0, then truncated; 401 when it is above the cliff.
 */
export function fplPercent(income: number, fpl: number, rules: RuleSet): number {
  const householdIncome = Math.max(0, Math.round(income));
  if (rules.cliffMultiple !== null && householdIncome > rules.cliffMultiple * fpl) return OVER_CLIFF_FPL_PERCENT;
  return Math.floor((householdIncome * 100) / fpl);
}
