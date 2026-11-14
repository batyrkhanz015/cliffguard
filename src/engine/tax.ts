import type { FilingStatus, RuleSet } from './types';

/**
 * Rough federal income tax (spec §A.5): the standard deduction and the bracket table only.
 * Leaves out the QBI deduction, state tax, credits and capital-gains rates (ROUGH_TAX_ESTIMATE).
 */

/** Taxable income: AGI (not MAGI) minus the standard deduction, never below 0. */
export function taxableIncome(agi: number, status: FilingStatus, rules: RuleSet): number {
  return Math.max(0, agi - rules.standardDeduction[status]);
}

/** Tax on taxable income through the progressive brackets for the filing status. */
export function federalTax(taxable: number, status: FilingStatus, rules: RuleSet): number {
  let tax = 0;
  let lower = 0;
  for (const { upTo, rate } of rules.brackets[status]) {
    if (taxable <= lower) break;
    tax += (Math.min(taxable, upTo) - lower) * rate;
    lower = upTo;
  }
  return tax;
}

/** The rate on the next dollar of taxable income. */
export function marginalRate(taxable: number, status: FilingStatus, rules: RuleSet): number {
  const brackets = rules.brackets[status];
  return (brackets.find(({ upTo }) => taxable < upTo) ?? brackets[brackets.length - 1]).rate;
}

/**
 * Income tax saved by above-the-line deductions (the plan's HSA, IRA and SEP) taken from the
 * AGI with the gig. Timing moves are tax-neutral across years, so they are not deductions here.
 */
export function incomeTaxSaved(agiWithGig: number, deductions: number, status: FilingStatus, rules: RuleSet): number {
  const taxOn = (agi: number) => federalTax(taxableIncome(agi, status, rules), status, rules);
  return taxOn(agiWithGig) - taxOn(agiWithGig - deductions);
}
