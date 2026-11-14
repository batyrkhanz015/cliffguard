import { cliffAmount, householdIncome } from './fpl';
import { computeIncome, type IncomeBreakdown } from './income';
import { reconcile, type ReconcileInput, type Reconciliation } from './reconcile';
import { TY2026 } from './rules/ty2026';
import { deriveSlcsp, type Slcsp } from './slcsp';
import {
  ZERO_LEVERS,
  type FlagCode,
  type HouseholdInput,
  type LeverAmounts,
  type RuleSet,
  type Scenario,
} from './types';

export type Zone = 'below_100' | 'clear' | 'near' | 'over';

/** Where the household stands for the year (spec §A.4): the Form 8962 result plus context. */
export type Diagnosis = Omit<Reconciliation, 'cliff'> & {
  rulesId: string;
  asOf: string;
  income: IncomeBreakdown;
  cliff: number;
  slcsp: Slcsp;
  /** Cliff minus household income; negative when over. */
  headroom: number;
  zone: Zone;
  /** Extra owed at filing (a bigger repayment or a smaller refund) for $1,000 more MAGI. */
  per1000: number;
  daysToYearEnd: number;
  reportChange: { recommended: boolean; incomeToReport: number };
  flags: FlagCode[];
};

/** Assumption (spec §A.4): "near" means headroom of at most 10% of the cliff. */
const NEAR_ZONE_SHARE = 0.1;
const PER_1000_STEP = 1_000;
/** Assumptions (spec §A.8): report a gap of at least max($2,500, 5% of the estimate), before December. */
const REPORT_CHANGE_MIN_GAP = 2_500;
const REPORT_CHANGE_MIN_SHARE = 0.05;
const REPORT_CHANGE_BEFORE = '12-01';
const MS_PER_DAY = 86_400_000;

/** Positive when the household repays at filing, negative when it is due a refund. */
const owedAtFiling = (r: Reconciliation): number => r.repayment - r.refund;

/**
 * The cost of $1,000 more MAGI at filing. When that $1,000 would cross the cliff, measures the
 * last $1,000 below the cliff instead, so the number stays the smooth-zone slope.
 */
function marginalCost(
  params: ReconcileInput,
  cliff: number,
  rules: RuleSet,
): { per1000: number; nearCliffStep: boolean } {
  const owedAt = (magi: number) => owedAtFiling(reconcile({ ...params, magi }, rules));
  const crossesCliff =
    householdIncome(params.magi) <= cliff && householdIncome(params.magi + PER_1000_STEP) > cliff;
  const from = crossesCliff ? cliff - PER_1000_STEP : params.magi;
  return { per1000: Math.max(0, owedAt(from + PER_1000_STEP) - owedAt(from)), nearCliffStep: crossesCliff };
}

function zoneFor(settlement: Reconciliation, headroom: number, cliff: number): Zone {
  if (settlement.overCliff) return 'over';
  if (settlement.fplPercent < 100) return 'below_100';
  return headroom <= NEAR_ZONE_SHARE * cliff ? 'near' : 'clear';
}

/** Spec §A.8: the income to report is projected MAGI before any plan moves. */
function reportChangeFor(input: HouseholdInput, scenario: Scenario, rules: RuleSet): Diagnosis['reportChange'] {
  const incomeToReport = householdIncome(computeIncome(input, scenario, rules).magi);
  const estimate = input.marketplace.incomeEstimate;
  const threshold = Math.max(REPORT_CHANGE_MIN_GAP, REPORT_CHANGE_MIN_SHARE * estimate);
  const bigGap = Math.abs(incomeToReport - estimate) >= threshold;
  return { recommended: scenario.asOf < `${rules.taxYear}-${REPORT_CHANGE_BEFORE}` && bigGap, incomeToReport };
}

function daysBetween(fromIsoDate: string, toIsoDate: string): number {
  return Math.round((Date.parse(toIsoDate) - Date.parse(fromIsoDate)) / MS_PER_DAY);
}

function flagsFor(
  input: HouseholdInput,
  income: IncomeBreakdown,
  settlement: Reconciliation,
  rules: RuleSet,
  nearCliffStep: boolean,
): FlagCode[] {
  const { marketplace } = input;
  const checks: ReadonlyArray<readonly [boolean, FlagCode]> = [
    [marketplace.aptcMonthly === 0, 'NO_APTC'],
    [marketplace.monthsWithAptc < 12, 'PARTIAL_YEAR'],
    [income.capGainsAllowed <= -rules.capitalLossLimit, 'CAPITAL_LOSS_LIMITED'],
    [settlement.fplPercent < 100, 'BELOW_100_FPL'],
    [rules.sbmStates.includes(input.state), 'SBM_STATE'],
    [income.seAdultId !== null, 'SEHI_DEDUCTION_EXCLUDED'],
    [marketplace.planMetal === 'catastrophic', 'CATASTROPHIC_NO_PTC'],
    [nearCliffStep, 'NEAR_CLIFF_STEP'],
  ];
  return checks.filter(([raised]) => raised).map(([, code]) => code);
}

/**
 * The household's year at a glance: MAGI, the cliff, the credit it keeps and what it owes or is
 * owed at filing. Pure: same input, same output; time comes only from `scenario.asOf`.
 *
 * @throws EngineError from `deriveSlcsp` when the benchmark premium must be entered
 */
export function diagnose(
  input: HouseholdInput,
  scenario: Scenario,
  rules: RuleSet = TY2026,
  levers: LeverAmounts = ZERO_LEVERS,
): Diagnosis {
  const cliff = cliffAmount(input.state, input.householdSize, rules);
  if (cliff === null) throw new Error(`diagnose needs a rule set with a subsidy cliff; ${rules.id} has none`);

  const income = computeIncome(input, scenario, rules, levers);
  const slcsp = deriveSlcsp(input, rules);
  const { marketplace } = input;
  // Catastrophic plans are not QHPs: no advance credit, and no premium that earns a credit.
  const catastrophic = marketplace.planMetal === 'catastrophic';
  const params: ReconcileInput = {
    magi: income.magi,
    state: input.state,
    householdSize: input.householdSize,
    filingStatus: input.filingStatus,
    slcspAnnual: slcsp.annual,
    aptcMonthly: catastrophic ? 0 : marketplace.aptcMonthly,
    monthsWithAptc: marketplace.monthsWithAptc,
    premiumMonthly: catastrophic ? 0 : marketplace.premiumMonthly,
  };
  const settlement = reconcile(params, rules);
  const headroom = cliff - householdIncome(income.magi);
  const { per1000, nearCliffStep } = marginalCost(params, cliff, rules);

  return {
    ...settlement,
    rulesId: rules.id,
    asOf: scenario.asOf,
    income,
    cliff,
    slcsp,
    headroom,
    zone: zoneFor(settlement, headroom, cliff),
    per1000,
    daysToYearEnd: Math.max(0, daysBetween(scenario.asOf, rules.dates.yearEnd)),
    reportChange: reportChangeFor(input, scenario, rules),
    flags: flagsFor(input, income, settlement, rules, nearCliffStep),
  };
}
