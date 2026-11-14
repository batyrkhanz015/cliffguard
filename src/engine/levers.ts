import 'server-only';
import { formatDate } from './format';
import { computeIncome, type IncomeBreakdown } from './income';
import { iraDeductibleLimit, sepLimit, type PhaseOutRange } from './retirement';
import {
  ZERO_LEVERS,
  type AdultId,
  type AdultInput,
  type HouseholdInput,
  type LeverAmounts,
  type LeverId,
  type Liquidity,
  type RuleSet,
  type Scenario,
} from './types';

/** One lever as the optimizer applies it: the traditional IRA is one slot per adult. */
export type LeverSlot = { leverId: Exclude<LeverId, 'traditionalIra'> } | { leverId: 'traditionalIra'; adultId: AdultId };

/** The household partway through a plan: the lever amounts so far and the income they leave. */
export type PlanState = { scenario: Scenario; levers: LeverAmounts; income: IncomeBreakdown };

export type LeverCopy = {
  name: string;
  returnLocation: string;
  howTo: readonly string[];
  proof: readonly string[];
  warnings: readonly string[];
};

/**
 * Static copy per lever. Return locations, proof and warnings are verbatim from spec §A.6; names
 * and how-to steps restate the spec and handoff §6. Never generated, and never carries amounts.
 */
export const LEVER_COPY: Readonly<Record<LeverId, LeverCopy>> = {
  invoiceTiming: {
    name: 'Bill in January instead of December',
    returnLocation: 'Not on your 2026 Schedule C; on the 2027 return.',
    howTo: [
      "Don't bill this work until January, or agree in writing on January payment terms.",
      'Date the invoice in 2027 and keep the deposit record.',
    ],
    proof: ['An invoice dated in 2027', 'The deposit date', 'A client 1099 that excludes it'],
    warnings: [
      "Constructive receipt: if payment is offered or available in 2026 it counts for 2026, so don't ask a client to hold a check.",
      'Cash-basis only.',
      'Add it to your 2027 Marketplace estimate.',
    ],
  },
  businessPurchases: {
    name: 'Buy planned business items now',
    returnLocation: 'Schedule C expense (or depreciation / §179).',
    howTo: [
      'Buy only what the business would buy early next year anyway.',
      'Pay for it and start using it in the business before the deadline.',
    ],
    proof: ['Receipts', 'A note of business use'],
    warnings: ["Only what you'd buy anyway, since $1 spent saves only part of $1."],
  },
  hsa: {
    name: 'Put money in a Health Savings Account (HSA)',
    returnLocation: 'Form 8889 → Schedule 1.',
    howTo: [
      "Open an HSA with a bank or broker if you don't have one.",
      'Deposit before the deadline and tell the provider it is a 2026 contribution.',
    ],
    proof: ['The provider statement or Form 5498-SA', "The plan's HSA eligibility"],
    warnings: [
      'Bronze and catastrophic plans count from 2026.',
      'Not allowed with a general-purpose health FSA or Medicare.',
      'Designate a Jan–Apr deposit as a 2026 contribution.',
      'Tax-free withdrawals apply only to medical costs incurred after the HSA was opened.',
    ],
  },
  delayStockSale: {
    name: 'Wait until January to sell planned stock',
    returnLocation: 'Not on the 2026 Form 8949.',
    howTo: ['Place the planned sale with a trade date in 2027 instead of 2026.'],
    proof: ['Trade confirmations'],
    warnings: ['Market risk.', 'Include the sale in the 2027 estimate.'],
  },
  traditionalIra: {
    name: 'Contribute to a traditional IRA',
    returnLocation: 'Schedule 1 IRA deduction.',
    howTo: [
      'Contribute to a traditional (not Roth) IRA before the deadline.',
      'Tell the provider the contribution is for 2026.',
    ],
    proof: ['Form 5498, with the contribution designated for 2026'],
    warnings: ["Roth contributions don't count.", 'Deductibility phases out when covered by a workplace plan.'],
  },
  sepIra: {
    name: 'Contribute to a SEP-IRA',
    returnLocation: 'Schedule 1, SEP deduction.',
    howTo: [
      'Open a SEP-IRA with a provider and sign Form 5305-SEP.',
      'Contribute before the deadline (later if you file an extension) and designate it for 2026.',
    ],
    proof: ['Form 5305-SEP', 'Form 5498'],
    warnings: ['Self-employed only.', 'If you have employees, they must be included.'],
  },
};

/** Deadline and liquidity per lever (spec §A.6 table). */
export const LEVER_TERMS: Readonly<
  Record<LeverId, { deadline: 'yearEnd' | 'contributionDeadline'; liquidity: Liquidity }>
> = {
  invoiceTiming: { deadline: 'yearEnd', liquidity: 'arrives_january' },
  businessPurchases: { deadline: 'yearEnd', liquidity: 'planned_purchase' },
  hsa: { deadline: 'contributionDeadline', liquidity: 'mostly_liquid' },
  delayStockSale: { deadline: 'yearEnd', liquidity: 'stays_invested' },
  traditionalIra: { deadline: 'contributionDeadline', liquidity: 'locked' },
  sepIra: { deadline: 'contributionDeadline', liquidity: 'locked' },
};

/** The last day the lever counts for the year (ISO date). */
export function leverDeadline(leverId: LeverId, rules: RuleSet): string {
  return rules.dates[LEVER_TERMS[leverId].deadline];
}

/** Bronze and catastrophic Marketplace plans are HSA-qualified from 2026 (Notice 2026-5). */
const HSA_PLANS: ReadonlySet<HouseholdInput['marketplace']['planMetal']> = new Set(['bronze', 'catastrophic']);
const MONTHS_PER_YEAR = 12;

export type Eligibility = { ok: true } | { ok: false; reason: string };

/** Whether the lever is open to this household on `asOf`, with a reason for the UI when it isn't. */
export function isEligible(lever: LeverId, input: HouseholdInput, asOf: string, rules: RuleSet): Eligibility {
  const { planMetal } = input.marketplace;
  if (lever === 'hsa' && !HSA_PLANS.has(planMetal)) {
    const plan = planMetal === 'unknown' ? 'plan type unknown' : `${planMetal} plan`;
    return { ok: false, reason: `Not HSA-eligible: ${plan}, unless it is an HSA-qualified HDHP` };
  }
  const deadline = leverDeadline(lever, rules);
  if (asOf > deadline) return { ok: false, reason: `Deadline passed: ${formatDate(deadline)}` };
  return { ok: true };
}

/** The household with these lever amounts applied. */
export function planState(
  input: HouseholdInput,
  scenario: Scenario,
  rules: RuleSet,
  levers: LeverAmounts = ZERO_LEVERS,
): PlanState {
  return { scenario, levers, income: computeIncome(input, scenario, rules, levers) };
}

/** Lever amounts with `amount` more dollars on the slot. */
export function addLever(levers: LeverAmounts, slot: LeverSlot, amount: number): LeverAmounts {
  if (slot.leverId === 'traditionalIra') {
    const { adultId } = slot;
    return { ...levers, traditionalIra: { ...levers.traditionalIra, [adultId]: levers.traditionalIra[adultId] + amount } };
  }
  return { ...levers, [slot.leverId]: levers[slot.leverId] + amount };
}

/** The adult a retirement slot belongs to: the IRA's adult, or the SE adult for the SEP. */
export function slotAdult(slot: LeverSlot, state: PlanState): AdultId | null {
  if (slot.leverId === 'traditionalIra') return slot.adultId;
  return slot.leverId === 'sepIra' ? state.income.seAdultId : null;
}

function adultById(input: HouseholdInput, adultId: AdultId): AdultInput {
  const adult = input.adults.find(({ id }) => id === adultId);
  if (adult === undefined) throw new Error(`No adult ${adultId} in this household`);
  return adult;
}

/** SEP dollars for the adult: contributed so far plus the plan's (the plan's SEP is the SE adult's). */
function sepContributed(adultId: AdultId, state: PlanState, input: HouseholdInput): number {
  const planned = state.income.seAdultId === adultId ? state.levers.sepIra : 0;
  return adultById(input, adultId).contributedSoFar.sepIra + planned;
}

function iraContributed(adultId: AdultId, state: PlanState, input: HouseholdInput): number {
  return adultById(input, adultId).contributedSoFar.traditionalIra + state.levers.traditionalIra[adultId];
}

/**
 * G2 ruling: the traditional IRA and the SEP-IRA are mutually exclusive per adult, so a SEP never
 * shrinks the same adult's IRA deduction. Counts contributions made so far and the plan's.
 */
export function excludedByIraSepCombo(slot: LeverSlot, state: PlanState, input: HouseholdInput): boolean {
  const adultId = slotAdult(slot, state);
  if (adultId === null) return false;
  return slot.leverId === 'sepIra'
    ? iraContributed(adultId, state, input) > 0
    : sepContributed(adultId, state, input) > 0;
}

/** SE profit the SE adult has left; 0 under the $400 net-earnings floor for SE tax (spec §A.10). */
function seProfitLeft(state: PlanState, rules: RuleSet): number {
  const { seAdultId, seProfitByAdult } = state.income;
  if (seAdultId === null) return 0;
  const profit = seProfitByAdult[seAdultId];
  return profit * rules.se.netEarningsFactor >= rules.se.filingThreshold ? profit : 0;
}

const halfSeTax = (adultId: AdultId, state: PlanState, rules: RuleSet): number =>
  state.income.seTaxByAdult[adultId] * rules.se.deductibleShare;

function hsaCapacity(state: PlanState, input: HouseholdInput, rules: RuleSet): number {
  const { coverage, monthsWithAptc } = input.marketplace;
  const annual = coverage === 'family' ? rules.hsa.family : rules.hsa.selfOnly;
  return (annual * monthsWithAptc) / MONTHS_PER_YEAR - input.adjustments.hsaContributedSoFar - state.levers.hsa;
}

function sepCapacity(state: PlanState, input: HouseholdInput, rules: RuleSet): number {
  const adultId = state.income.seAdultId;
  if (adultId === null || seProfitLeft(state, rules) === 0) return 0;
  const profitAfterHalfSeTax = state.income.seProfitByAdult[adultId] - halfSeTax(adultId, state, rules);
  return sepLimit(profitAfterHalfSeTax, rules.sep) - sepContributed(adultId, state, input);
}

/**
 * SE profit that invoice timing or purchases may still remove: what is left, minus the profit that
 * backs SEP money already in. The SEP limit falls by at most 20¢ per dollar of profit, so SEP room
 * ÷ 0.20 is a safe bound, whatever order the user put the levers in.
 */
function seProfitMovable(state: PlanState, input: HouseholdInput, rules: RuleSet): number {
  const profitLeft = seProfitLeft(state, rules);
  const adultId = state.income.seAdultId;
  if (adultId === null || sepContributed(adultId, state, input) === 0) return profitLeft;
  return Math.min(profitLeft, sepCapacity(state, input, rules) / rules.sep.selfEmployedRate);
}

/** IRA compensation: wages plus SE profit minus half of SE tax and the SEP deduction (spec §A.6). */
function compensation(adultId: AdultId, state: PlanState, input: HouseholdInput, rules: RuleSet): number {
  const { wagesByAdult, seProfitByAdult } = state.income;
  const netSe = seProfitByAdult[adultId] - halfSeTax(adultId, state, rules) - sepContributed(adultId, state, input);
  return wagesByAdult[adultId] + Math.max(0, netSe);
}

/** Covered by a workplace plan; a SEP (so far or planned) makes its adult an active participant. */
function isCovered(adult: AdultInput, state: PlanState, input: HouseholdInput): boolean {
  return adult.coveredByWorkplacePlan || sepContributed(adult.id, state, input) > 0;
}

/** Pub 590-A: the covered range for the filing status; the spouse range if only the spouse is covered. */
function phaseOutRange(adultId: AdultId, state: PlanState, input: HouseholdInput, rules: RuleSet): PhaseOutRange | null {
  const { phaseOut } = rules.ira;
  if (isCovered(adultById(input, adultId), state, input)) {
    return input.filingStatus === 'mfj' ? phaseOut.mfjContributorCovered : phaseOut.singleOrHohCovered;
  }
  const spouse = input.adults.find(({ id }) => id !== adultId);
  return spouse !== undefined && isCovered(spouse, state, input) ? phaseOut.mfjContributorNotCoveredSpouseCovered : null;
}

/**
 * Traditional IRA room for one adult: the phased-out deductible limit, within compensation (a
 * spouse may use joint compensation not already contributed), minus what this adult has in.
 * IRA MAGI is approximated as AGI before any IRA deduction (spec §A.6 assumption).
 */
function iraCapacity(adultId: AdultId, state: PlanState, input: HouseholdInput, rules: RuleSet): number {
  const contributed = (id: AdultId) => iraContributed(id, state, input);
  const others = input.adults.filter(({ id }) => id !== adultId);
  const iraMagi = state.income.agi + input.adults.reduce((sum, { id }) => sum + contributed(id), 0);
  const limit = iraDeductibleLimit(iraMagi, phaseOutRange(adultId, state, input, rules), rules.ira);
  const jointCompensation = input.adults.reduce((sum, { id }) => sum + compensation(id, state, input, rules), 0);
  const compensationLeft = jointCompensation - others.reduce((sum, { id }) => sum + contributed(id), 0);
  return Math.min(limit, compensationLeft) - contributed(adultId);
}

/** Dollars of the lever left at this point of the plan, before flooring at 0 (spec §A.6 table). */
function room(slot: LeverSlot, state: PlanState, input: HouseholdInput, rules: RuleSet): number {
  const { levers, scenario } = state;
  switch (slot.leverId) {
    case 'invoiceTiming': {
      const gigInJanuary = scenario.gig?.canBillInJanuary ? scenario.gig.amount : 0;
      const movable = input.levers.unbilledInvoicesMovable + gigInJanuary - levers.invoiceTiming;
      return Math.min(movable, seProfitMovable(state, input, rules));
    }
    case 'businessPurchases':
      return Math.min(input.levers.plannedPurchases - levers.businessPurchases, seProfitMovable(state, input, rules));
    case 'hsa':
      return hsaCapacity(state, input, rules);
    case 'delayStockSale': {
      // Gains below the capital-loss floor no longer lower income.
      const aboveLossFloor = state.income.capGainsAllowed + rules.capitalLossLimit;
      return Math.min(input.levers.plannedStockSaleGains - levers.delayStockSale, aboveLossFloor);
    }
    case 'traditionalIra':
      return iraCapacity(slot.adultId, state, input, rules);
    case 'sepIra':
      return sepCapacity(state, input, rules);
  }
}

/** Dollars of the lever still available at this point of the plan; never below 0. */
export function capacity(slot: LeverSlot, state: PlanState, input: HouseholdInput, rules: RuleSet): number {
  return Math.max(0, room(slot, state, input, rules));
}
