import {
  ZERO_LEVERS,
  type AdultId,
  type AdultInput,
  type HouseholdInput,
  type LeverAmounts,
  type RuleSet,
  type Scenario,
} from './types';

/** Every component of PTC MAGI (spec §A.3), for the "How we got this" panel. Floating dollars. */
export type IncomeBreakdown = {
  seProfitByAdult: Record<AdultId, number>;
  seTaxByAdult: Record<AdultId, number>;
  halfSeTax: number;
  wages: number;
  capGainsAllowed: number;
  agi: number;
  magi: number;
  /** The adult the gig, what-if SE income and SE levers apply to; null if nobody has SE profit. */
  seAdultId: AdultId | null;
};

const projected = (amount: { ytd: number; expectedRest: number }): number => amount.ytd + amount.expectedRest;

/** The adult with the larger projected SE profit; ties go to `a`. */
function pickSeAdult(adults: HouseholdInput['adults']): AdultId {
  const [first, second] = adults;
  if (second === undefined) return first.id;
  return projected(second.selfEmploymentProfit) > projected(first.selfEmploymentProfit) ? second.id : first.id;
}

/** Schedule SE: Social Security up to the wage base left after this adult's W-2 wages, Medicare on all. */
function seTax(seProfit: number, w2Wages: number, se: RuleSet['se']): number {
  const netEarnings = Math.max(0, seProfit) * se.netEarningsFactor;
  if (netEarnings < se.filingThreshold) return 0;
  const ssRoom = Math.max(0, se.ssWageBase - w2Wages);
  return se.ssRate * Math.min(netEarnings, ssRoom) + se.medicareRate * netEarnings;
}

/** Traditional IRA and SEP deductions: contributed so far plus the lever amounts. */
function retirementDeductions(adults: readonly AdultInput[], levers: LeverAmounts): number {
  const perAdult = adults.reduce(
    (sum, { id, contributedSoFar }) =>
      sum + contributedSoFar.traditionalIra + contributedSoFar.sepIra + levers.traditionalIra[id],
    0,
  );
  return perAdult + levers.sepIra;
}

/**
 * Projected AGI and PTC MAGI for the year. The gig, what-if earned income and the SE-profit
 * levers (invoice timing, business purchases) all apply to the SE adult.
 */
export function computeIncome(
  input: HouseholdInput,
  scenario: Scenario,
  rules: RuleSet,
  levers: LeverAmounts = ZERO_LEVERS,
): IncomeBreakdown {
  const extra = scenario.extra ?? {};
  const seAdult = pickSeAdult(input.adults);
  const seProfitByAdult: Record<AdultId, number> = { a: 0, b: 0 };
  const seTaxByAdult: Record<AdultId, number> = { a: 0, b: 0 };
  let wages = 0;

  for (const adult of input.adults) {
    const isSeAdult = adult.id === seAdult;
    const seProfit =
      projected(adult.selfEmploymentProfit) +
      (isSeAdult
        ? (scenario.gig?.amount ?? 0) + (extra.selfEmployment ?? 0) - levers.invoiceTiming - levers.businessPurchases
        : 0);
    const adultWages = projected(adult.wages) + (isSeAdult ? (extra.wages ?? 0) : 0);
    seProfitByAdult[adult.id] = seProfit;
    seTaxByAdult[adult.id] = seTax(seProfit, adultWages, rules.se);
    wages += adultWages;
  }

  const { investments, adjustments } = input;
  const halfSeTax = (seTaxByAdult.a + seTaxByAdult.b) * rules.se.deductibleShare;
  const capGainsAllowed = Math.max(
    investments.capitalGainsNet + (extra.capitalGains ?? 0) - levers.delayStockSale,
    -rules.capitalLossLimit,
  );
  const agi =
    wages +
    seProfitByAdult.a +
    seProfitByAdult.b -
    halfSeTax +
    investments.taxableInterest +
    investments.dividends +
    (extra.interestOrDividends ?? 0) +
    capGainsAllowed +
    investments.otherIncome -
    (adjustments.hsaContributedSoFar + levers.hsa) -
    retirementDeductions(input.adults, levers) -
    adjustments.otherAboveTheLine;
  const magi = agi + investments.taxExemptInterest + investments.otherMagiAddbacks;

  return {
    seProfitByAdult,
    seTaxByAdult,
    halfSeTax,
    wages,
    capGainsAllowed,
    agi,
    magi,
    seAdultId: seProfitByAdult[seAdult] > 0 ? seAdult : null,
  };
}
