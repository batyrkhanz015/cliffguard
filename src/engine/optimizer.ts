import 'server-only';
import { diagnose, type Diagnosis } from './diagnose';
import {
  addLever,
  capacity,
  excludedByIraSepCombo,
  isEligible,
  LEVER_COPY,
  LEVER_TERMS,
  leverDeadline,
  planState,
  slotAdult,
  type LeverSlot,
  type PlanState,
} from './levers';
import { TY2026 } from './rules/ty2026';
import { incomeTaxSaved } from './tax';
import {
  LIQUID_LEVERS,
  ZERO_LEVERS,
  type AdultId,
  type FlagCode,
  type HouseholdInput,
  type LeverAmounts,
  type Move,
  type PlanResult,
  type PlanVerdict,
  type RuleSet,
  type Scenario,
} from './types';

/** Assumption (spec §A.6, D9): aim $1,000 under the cliff, so a small surprise doesn't cross it. */
export const SAFETY_BUFFER = 1_000;
/** Assumption (spec §A.6, D9): a plan is costly when HSA and retirement money top 3× the credit kept. */
export const COSTLY_MULTIPLE = 3;
/** Lever amounts are whole multiples of $10 (spec §A.9). */
const DOLLAR_STEP = 10;

type Step = { slot: LeverSlot; adultId: AdultId | null; amount: number; magiReduction: number };
/** One pass over the levers: the moves taken, where they leave the household, and whether an IRA/SEP was skipped. */
type Pass = { state: PlanState; steps: Step[]; comboExcluded: boolean };

/** The user's lever order; the traditional IRA becomes one slot per adult, non-covered first, then a before b. */
function slotsInOrder(input: HouseholdInput): LeverSlot[] {
  const iraAdults = [...input.adults].sort(
    (x, y) => Number(x.coveredByWorkplacePlan) - Number(y.coveredByWorkplacePlan),
  );
  return input.preferences.leverOrder.flatMap((leverId): LeverSlot[] =>
    leverId === 'traditionalIra' ? iraAdults.map(({ id }) => ({ leverId, adultId: id })) : [{ leverId }],
  );
}

function allowedSlots(input: HouseholdInput, asOf: string, rules: RuleSet, keepMyCash: boolean): LeverSlot[] {
  return slotsInOrder(input).filter(
    ({ leverId }) => isEligible(leverId, input, asOf, rules).ok && (!keepMyCash || LIQUID_LEVERS.includes(leverId)),
  );
}

/**
 * Smallest multiple of $10 up to `maxAmount` that brings MAGI to the target, else `maxAmount`.
 * Binary search: MAGI never rises as a lever amount grows.
 */
function smallestAmountReaching(target: number, maxAmount: number, magiWith: (amount: number) => number): number {
  if (magiWith(maxAmount) > target) return maxAmount;
  let low = 0;
  let high = maxAmount / DOLLAR_STEP;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (magiWith(mid * DOLLAR_STEP) <= target) high = mid;
    else low = mid + 1;
  }
  return high * DOLLAR_STEP;
}

/** Applies the slots in order, each by the least needed, until MAGI is at or under the target. */
function runPass(
  input: HouseholdInput,
  scenario: Scenario,
  rules: RuleSet,
  slots: readonly LeverSlot[],
  target: number,
): Pass {
  let state = planState(input, scenario, rules);
  const steps: Step[] = [];
  let comboExcluded = false;

  for (const slot of slots) {
    if (state.income.magi <= target) break;
    const maxAmount = Math.floor(capacity(slot, state, input, rules) / DOLLAR_STEP) * DOLLAR_STEP;
    if (maxAmount <= 0) continue;
    if (excludedByIraSepCombo(slot, state, input)) {
      comboExcluded = true;
      continue;
    }
    const from = state;
    const withAmount = (amount: number) => planState(input, scenario, rules, addLever(from.levers, slot, amount));
    const amount = smallestAmountReaching(target, maxAmount, (dollars) => withAmount(dollars).income.magi);
    state = withAmount(amount);
    steps.push({ slot, adultId: slotAdult(slot, from), amount, magiReduction: from.income.magi - state.income.magi });
  }
  return { state, steps, comboExcluded };
}

const reachesTarget = (pass: Pass, target: number): boolean => pass.state.income.magi <= target;

const passFlags = (pass: Pass): FlagCode[] => (pass.comboExcluded ? ['IRA_SEP_COMBO_EXCLUDED'] : []);

function toMove({ slot, adultId, amount, magiReduction }: Step, rules: RuleSet): Move {
  const { leverId } = slot;
  const copy = LEVER_COPY[leverId];
  return {
    leverId,
    ...(adultId === null ? {} : { adultId }),
    amount,
    magiReduction,
    deadline: leverDeadline(leverId, rules),
    liquidity: LEVER_TERMS[leverId].liquidity,
    howTo: [...copy.howTo],
    returnLocation: copy.returnLocation,
    proof: [...copy.proof],
    warnings: [...copy.warnings],
  };
}

/** Spec §A.6 totals. Income tax saved counts only the deductions; timing moves are tax-neutral. */
function totalsFor(levers: LeverAmounts, before: Diagnosis, input: HouseholdInput, rules: RuleSet): PlanResult['totals'] {
  const lockedInRetirement = levers.traditionalIra.a + levers.traditionalIra.b + levers.sepIra;
  const deductions = levers.hsa + lockedInRetirement;
  return {
    cashCommitted: levers.businessPurchases + deductions,
    lockedInRetirement,
    deferredToNextYear: levers.invoiceTiming + levers.delayStockSale,
    incomeTaxSaved: incomeTaxSaved(before.income.agi, deductions, input.filingStatus, rules),
  };
}

type PlanContext = {
  input: HouseholdInput;
  rules: RuleSet;
  before: Diagnosis;
  target: number;
  maxReductionAvailable: number;
};

/** A result with no moves: the household's numbers stay as they are. */
function planWithoutMoves(ctx: PlanContext, verdict: PlanVerdict, flags: FlagCode[]): PlanResult {
  const { before } = ctx;
  return {
    verdict,
    target: ctx.target,
    magiBefore: before.income.magi,
    magiAfter: before.income.magi,
    ptcBefore: before.ptcAllowed,
    ptcAfter: before.ptcAllowed,
    repaymentBefore: before.repayment,
    repaymentAfter: before.repayment,
    moves: [],
    totals: totalsFor(ZERO_LEVERS, before, ctx.input, ctx.rules),
    maxReductionAvailable: ctx.maxReductionAvailable,
    setAside: verdict === 'not_worth_fighting' ? before.repayment : null,
    suggestion: verdict === 'needs_retirement_moves' ? 'allow_retirement_moves' : null,
    flags,
  };
}

/** A plan that gets under the target: worth it, unless the money it ties up dwarfs the credit kept. */
function planWithMoves(ctx: PlanContext, scenario: Scenario, pass: Pass): PlanResult {
  const { input, rules, before } = ctx;
  const { levers } = pass.state;
  const after = diagnose(input, scenario, rules, levers);
  const totals = totalsFor(levers, before, input, rules);
  const creditKept = after.ptcAllowed - before.ptcAllowed;
  const costly = totals.lockedInRetirement + levers.hsa > COSTLY_MULTIPLE * creditKept;
  return {
    verdict: costly ? 'costly' : 'worth_it',
    target: ctx.target,
    magiBefore: before.income.magi,
    magiAfter: after.income.magi,
    ptcBefore: before.ptcAllowed,
    ptcAfter: after.ptcAllowed,
    repaymentBefore: before.repayment,
    repaymentAfter: after.repayment,
    moves: pass.steps.map((step) => toMove(step, rules)),
    totals,
    maxReductionAvailable: ctx.maxReductionAvailable,
    setAside: null,
    suggestion: null,
    flags: passFlags(pass),
  };
}

/**
 * The rescue plan (spec §A.6): the fewest lever dollars, in the user's order, that bring MAGI to
 * $1,000 under the cliff. Liquid levers only when "Keep my cash" is on. A plan that can't get under
 * the target has no moves: over the cliff, a partial move keeps no credit. Pure and deterministic.
 *
 * @throws EngineError from `diagnose` when the benchmark premium must be entered
 */
export function optimize(input: HouseholdInput, scenario: Scenario, rules: RuleSet = TY2026): PlanResult {
  const before = diagnose(input, scenario, rules);
  const target = before.cliff - SAFETY_BUFFER;
  const { keepMyCash } = input.preferences;
  const allowed = allowedSlots(input, scenario.asOf, rules, keepMyCash);
  const everyLever = runPass(input, scenario, rules, allowed, -Infinity);
  const ctx: PlanContext = {
    input,
    rules,
    before,
    target,
    maxReductionAvailable: before.income.magi - everyLever.state.income.magi,
  };

  if (!before.overCliff) return planWithoutMoves(ctx, 'under_line', []);

  const plan = runPass(input, scenario, rules, allowed, target);
  if (reachesTarget(plan, target)) return planWithMoves(ctx, scenario, plan);

  if (keepMyCash) {
    const withRetirement = runPass(input, scenario, rules, allowedSlots(input, scenario.asOf, rules, false), target);
    if (reachesTarget(withRetirement, target)) return planWithoutMoves(ctx, 'needs_retirement_moves', []);
  }
  return planWithoutMoves(ctx, 'not_worth_fighting', passFlags(everyLever));
}
