import 'server-only';
import { diagnose, type Diagnosis } from './diagnose';
import { movesBring, usd } from './format';
import { optimize } from './optimizer';
import { TY2026 } from './rules/ty2026';
import { federalTax, marginalRate, taxableIncome } from './tax';
import type { FlagCode, GigCheckResult, HouseholdInput, PlanResult, RuleSet } from './types';

type Gig = { amount: number; canBillInJanuary: boolean };
type TaxOnGig = GigCheckResult['taxOnGig'];

const CURVE_STEP = 500;
const CURVE_MAX = 30_000;
/** The loss-zone search never looks past this gig size. */
const SEARCH_CEILING = 1_000_000;

const seTaxOf = (d: Diagnosis): number => d.income.seTaxByAdult.a + d.income.seTaxByAdult.b;

/** What one gig size does to the household, doing nothing about it. */
type Assessment = { withGig: Diagnosis; tax: TaxOnGig; netDoNothing: number };

type Baseline = { input: HouseholdInput; base: Diagnosis; asOf: string; rules: RuleSet };

/** Spec §A.5: the SE tax and the federal income tax the gig adds. */
function taxOnGig(base: Diagnosis, withGig: Diagnosis, input: HouseholdInput, rules: RuleSet): TaxOnGig {
  const status = input.filingStatus;
  const tax = (agi: number) => federalTax(taxableIncome(agi, status, rules), status, rules);
  const seTax = seTaxOf(withGig) - seTaxOf(base);
  const incomeTax = tax(withGig.income.agi) - tax(base.income.agi);
  return {
    seTax,
    incomeTax,
    total: seTax + incomeTax,
    marginalRate: marginalRate(taxableIncome(withGig.income.agi, status, rules), status, rules),
  };
}

function assess({ input, base, asOf, rules }: Baseline, amount: number): Assessment {
  const withGig = diagnose(input, { gig: { amount, canBillInJanuary: false }, asOf }, rules);
  const tax = taxOnGig(base, withGig, input, rules);
  return { withGig, tax, netDoNothing: amount - tax.total - (base.ptcAllowed - withGig.ptcAllowed) };
}

/** Spec §A.7: gig minus its tax, minus the credit lost, plus the income tax the plan's deductions save. */
const netWithPlan = ({ netDoNothing, withGig }: Assessment, plan: PlanResult): number =>
  netDoNothing + (plan.ptcAfter - withGig.ptcAllowed) + plan.totals.incomeTaxSaved;

/** Smallest whole dollar in [low, high] where `holds` is true; `high` when it never is. `holds` must be monotone. */
function firstWhole(low: number, high: number, holds: (dollars: number) => boolean): number {
  let lo = low;
  let hi = high;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (holds(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

/** The gig sizes that lose money: from the one that crosses the cliff to the one that pays the credit back. */
function lossZoneFor(baseline: Baseline): GigCheckResult['lossZone'] {
  const from = firstWhole(0, SEARCH_CEILING, (gig) => assess(baseline, gig).withGig.overCliff);
  if (assess(baseline, from).netDoNothing >= 0) return null;
  const to = firstWhole(from, SEARCH_CEILING, (gig) => assess(baseline, gig).netDoNothing >= 0);
  return { from, to };
}

/** The rescue plan for a gig of this size. */
const planFor = ({ input, asOf, rules }: Baseline, gig: Gig): PlanResult => optimize(input, { gig, asOf }, rules);

function curveFor(baseline: Baseline, canBillInJanuary: boolean): GigCheckResult['curve'] {
  return Array.from({ length: CURVE_MAX / CURVE_STEP + 1 }, (_, i) => {
    const gig = i * CURVE_STEP;
    const assessment = assess(baseline, gig);
    const plan = planFor(baseline, { amount: gig, canBillInJanuary });
    return { gig, netDoNothing: assessment.netDoNothing, netWithPlan: netWithPlan(assessment, plan) };
  });
}

function planNotes(plan: PlanResult): string[] {
  switch (plan.verdict) {
    case 'under_line':
      return ['No moves needed: this gig keeps you where you are.'];
    case 'needs_retirement_moves':
      return ['Only retirement contributions get you under the line. Turn off "Keep my cash" to see them.'];
    case 'not_worth_fighting':
      return [`No combination of moves keeps the credit. Set ${usd(plan.setAside ?? plan.repaymentBefore)} aside.`];
    case 'worth_it':
    case 'costly':
      return [
        `${movesBring(plan.moves.length)} income back under the line and keep ${usd(plan.ptcAfter - plan.ptcBefore)} of credit.`,
        `${usd(plan.totals.deferredToNextYear)} arrives in January; ${usd(plan.totals.cashCommitted)} goes into purchases, your HSA or retirement.`,
      ];
  }
}

/**
 * Should the household take this gig? Compares declining, taking it and doing nothing, taking it with
 * the rescue plan, and billing it in January (spec §A.7). The loss zone and curve show how the answer
 * changes with the gig's size. Rough tax: see `ROUGH_TAX_ESTIMATE`.
 *
 * @throws EngineError from `diagnose` when the benchmark premium must be entered
 */
export function gigCheck(input: HouseholdInput, gig: Gig, asOf: string, rules: RuleSet = TY2026): GigCheckResult {
  const base = diagnose(input, { gig: null, asOf }, rules);
  const baseline: Baseline = { input, base, asOf, rules };
  const assessment = assess(baseline, gig.amount);
  const { withGig, tax } = assessment;
  const plan = planFor(baseline, gig);
  const crossesCliff = !base.overCliff && withGig.overCliff;

  const options: GigCheckResult['options'] = [
    {
      id: 'decline',
      netFromGig: 0,
      ptcKept: base.ptcAllowed,
      repayment: base.repayment,
      notes: ['Nothing changes: your credit and your April bill stay as they are.'],
    },
    {
      id: 'take_do_nothing',
      netFromGig: assessment.netDoNothing,
      ptcKept: withGig.ptcAllowed,
      repayment: withGig.repayment,
      notes: crossesCliff
        ? [`Takes your income ${usd(withGig.income.magi - withGig.cliff)} over the ${usd(withGig.cliff)} line and costs you ${usd(base.ptcAllowed - withGig.ptcAllowed)} of credit.`]
        : [],
    },
    {
      id: 'take_with_plan',
      netFromGig: netWithPlan(assessment, plan),
      ptcKept: plan.ptcAfter,
      repayment: plan.repaymentAfter,
      notes: planNotes(plan),
    },
  ];
  if (gig.canBillInJanuary) {
    options.push({
      id: 'bill_in_january',
      netFromGig: gig.amount - tax.total,
      ptcKept: base.ptcAllowed,
      repayment: base.repayment,
      notes: [`Adds ${usd(gig.amount)} to 2027 income; include it in your 2027 estimate.`],
    });
  }

  const flags: FlagCode[] = [...plan.flags, 'ROUGH_TAX_ESTIMATE'];
  return {
    gigAmount: gig.amount,
    magiWithout: base.income.magi,
    magiWith: withGig.income.magi,
    crossesCliff,
    taxOnGig: tax,
    options,
    lossZone: lossZoneFor(baseline),
    curve: curveFor(baseline, gig.canBillInJanuary),
    plan,
    flags,
  };
}
