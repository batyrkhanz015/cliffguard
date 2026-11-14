import type { RuleSet } from './types';

/** IRA deduction phase-out range [low, high] of IRA MAGI. */
export type PhaseOutRange = readonly [number, number];

const DOLLAR_STEP = 10;

/**
 * Most a traditional IRA contribution can deduct (Pub 590-A, Worksheet 1-2). Inside the range the
 * limit shrinks in proportion, rounds up to the next $10 and is at least $200; it is 0 at the top.
 *
 * @param range null when neither spouse is covered by a workplace plan: no phase-out
 */
export function iraDeductibleLimit(iraMagi: number, range: PhaseOutRange | null, ira: RuleSet['ira']): number {
  if (range === null) return ira.limit;
  const [low, high] = range;
  if (iraMagi <= low) return ira.limit;
  if (iraMagi >= high) return 0;
  const reduced = Math.ceil((ira.limit * (high - iraMagi)) / (high - low) / DOLLAR_STEP) * DOLLAR_STEP;
  return Math.max(ira.minDeductionIfPartiallyPhasedOut, reduced);
}

/**
 * Most a self-employed person can put in a SEP-IRA (Pub 560 worksheet): 20% of SE profit minus
 * half of SE tax, within the compensation and dollar caps.
 */
export function sepLimit(profitAfterHalfSeTax: number, sep: RuleSet['sep']): number {
  const byProfit = sep.selfEmployedRate * Math.max(0, profitAfterHalfSeTax);
  return Math.min(byProfit, sep.planRateMax * sep.compensationCap, sep.dollarCap);
}
