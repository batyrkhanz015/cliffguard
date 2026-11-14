import { applicableFigure, requiredContribution } from './applicable';
import { fplPercent, povertyLine } from './fpl';
import { EngineError, type HouseholdInput, type RuleSet } from './types';

export type Slcsp = { annual: number; source: 'derived' | 'manual' };

/**
 * The benchmark (SLCSP) premium for the year (spec §A.4). The Marketplace set the advance credit
 * to benchmark − contribution at the income estimate, so benchmark = credit + contribution. That
 * holds only when the full credit was taken for an unchanged household and the estimate was
 * credit-eligible; otherwise the user must enter the benchmark (`slcspAnnualOverride`).
 *
 * @throws EngineError SLCSP_REQUIRED, SLCSP_DERIVATION_UNRELIABLE or ESTIMATE_OVER_CLIFF_WITH_APTC
 */
export function deriveSlcsp(input: HouseholdInput, rules: RuleSet): Slcsp {
  const { incomeEstimate, aptcMonthly, premiumMonthly, slcspAnnualOverride, tookFullCredit, householdUnchanged } =
    input.marketplace;
  if (slcspAnnualOverride !== null) return { annual: slcspAnnualOverride, source: 'manual' };

  if (!tookFullCredit || !householdUnchanged) {
    throw new EngineError('SLCSP_REQUIRED', 'Partial credit or a household change: enter the benchmark premium');
  }
  const pct = fplPercent(incomeEstimate, povertyLine(input.state, input.householdSize, rules), rules);
  const figure = applicableFigure(pct, rules);
  if (figure === null) {
    throw aptcMonthly > 0
      ? new EngineError('ESTIMATE_OVER_CLIFF_WITH_APTC', 'An estimate over the cliff should not get a credit')
      : new EngineError('SLCSP_REQUIRED', 'Estimate over the cliff: enter the benchmark premium');
  }
  if (pct < 100) {
    throw new EngineError('SLCSP_REQUIRED', 'Estimate below 100% FPL: enter the benchmark premium');
  }
  if (premiumMonthly !== null && aptcMonthly >= premiumMonthly) {
    throw new EngineError('SLCSP_DERIVATION_UNRELIABLE', 'The credit covers the whole premium, so it was capped');
  }
  return { annual: 12 * aptcMonthly + requiredContribution(incomeEstimate, figure), source: 'derived' };
}
