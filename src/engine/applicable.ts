import { householdIncome } from './fpl';
import type { ApplicableBand, RuleSet } from './types';

const BASIS_POINTS = 10_000;

/** round(numerator / denominator), halves up, for non-negative integers. Exact, unlike float `.5`. */
function roundHalfUp(numerator: number, denominator: number): number {
  return Math.floor((2 * numerator + denominator) / (2 * denominator));
}

function bandFor(fplPct: number, bands: readonly ApplicableBand[]): ApplicableBand | undefined {
  const last = bands[bands.length - 1];
  if (fplPct === last.toPct) return last;
  return bands.find((band) => band.fromPct <= fplPct && fplPct < band.toPct);
}

/**
 * Share of household income the family is expected to pay toward the benchmark plan
 * (Form 8962 line 7, four decimals). Linear within a band, rounded to the nearest basis point
 * (26 CFR 1.36B-3(g)). Null above the cliff: no credit.
 *
 * @param fplPct whole-number FPL percent from `fplPercent`
 */
export function applicableFigure(fplPct: number, rules: RuleSet): number | null {
  const band = bandFor(fplPct, rules.applicableBands);
  if (band === undefined) return rules.cliffMultiple === null ? rules.aboveCliffRate : null;

  const width = band.toPct - band.fromPct;
  const numerator = band.startBp * width + (fplPct - band.fromPct) * (band.endBp - band.startBp);
  return roundHalfUp(numerator, width) / BASIS_POINTS;
}

/**
 * Required annual contribution toward the benchmark plan (Form 8962 line 8a): household income
 * × the applicable figure, to the nearest dollar. Integer basis points, so halves round up exactly.
 */
export function requiredContribution(income: number, figure: number): number {
  return roundHalfUp(Math.round(figure * BASIS_POINTS) * householdIncome(income), BASIS_POINTS);
}
