import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { DANI, DANI_AS_OF, DANI_GIG } from '@/samples/dani';
import * as engine from '../index';
import { computeIncome } from '../income';
import { addLever, capacity, LEVER_COPY, planState, type LeverSlot } from '../levers';
import { COSTLY_MULTIPLE, optimize, SAFETY_BUFFER } from '../optimizer';
import { sepLimit } from '../retirement';
import { TY2026 } from '../rules/ty2026';
import * as server from '../server';
import { federalTax } from '../tax';
import {
  DEFAULT_LEVER_ORDER,
  ZERO_LEVERS,
  type HouseholdInput,
  type LeverAmounts,
  type LeverId,
  type Move,
  type PlanResult,
  type Scenario,
} from '../types';
import { expectDollars, F1, F3 } from './fixtures';

const WITH_GIG: Scenario = { gig: DANI_GIG, asOf: DANI_AS_OF };
const FULL_REPAYMENT = 9_342;
const HALF_SE_TAX_RATE = (0.9235 * 0.153) / 2;

function withPreferences(input: HouseholdInput, keepMyCash: boolean, leverOrder?: readonly LeverId[]): HouseholdInput {
  return { ...input, preferences: { keepMyCash, leverOrder: [...(leverOrder ?? input.preferences.leverOrder)] } };
}

/** `first` moved to the top of the default order. */
const orderStartingWith = (...first: LeverId[]): LeverId[] => [
  ...first,
  ...DEFAULT_LEVER_ORDER.filter((lever) => !first.includes(lever)),
];

const withGigOf = (amount: number): Scenario => ({ ...WITH_GIG, gig: { amount, canBillInJanuary: false } });

const amounts = (plan: PlanResult) => plan.moves.map((m) => [m.leverId, m.adultId ?? null, m.amount]);

function slotOf(move: Move): LeverSlot {
  if (move.leverId !== 'traditionalIra') return { leverId: move.leverId };
  if (move.adultId === undefined) throw new Error('A traditional IRA move names its adult');
  return { leverId: move.leverId, adultId: move.adultId };
}

/** F4: Keep my cash OFF, SEP-IRA moved to the top. */
const F4_INPUT = withPreferences(DANI, false, orderStartingWith('sepIra'));
/** F10: a silver plan and nothing to move from the business. */
const F10_INPUT: HouseholdInput = {
  ...DANI,
  marketplace: { ...DANI.marketplace, planMetal: 'silver' },
  levers: { ...DANI.levers, unbilledInvoicesMovable: 0, plannedPurchases: 0 },
};
const F9_SCENARIO: Scenario = { ...WITH_GIG, asOf: '2027-02-01' };

describe('optimize: spec §B fixtures', () => {
  test('F3: Keep my cash ON → bill $3,000 in January, buy the $1,800 now, $1,130 into the HSA', () => {
    const plan = optimize(DANI, WITH_GIG);
    expect(plan.verdict).toBe('worth_it');
    expect(plan.target).toBe(F1.cliff - SAFETY_BUFFER);
    expectDollars(plan.magiBefore, F3.magiWithGig);
    expect(amounts(plan)).toEqual([
      ['invoiceTiming', null, F3.invoiceTiming],
      ['businessPurchases', null, F3.businessPurchases],
      ['hsa', null, F3.hsa],
    ]);
    expectDollars(plan.magiAfter, F3.magiAfter);
    expect(plan.ptcBefore).toBe(0);
    expectDollars(plan.ptcAfter, FULL_REPAYMENT - F3.repaymentAfter);
    expectDollars(plan.repaymentBefore, FULL_REPAYMENT);
    expectDollars(plan.repaymentAfter, F3.repaymentAfter);
    expect(plan.setAside).toBeNull();
    expect(plan.suggestion).toBeNull();
    expect(plan.flags).toEqual([]);
  });

  test('F3: totals split cash committed, money locked away and income moved to 2027', () => {
    const { totals } = optimize(DANI, WITH_GIG);
    expect(totals.cashCommitted).toBe(F3.businessPurchases + F3.hsa);
    expect(totals.lockedInRetirement).toBe(0);
    expect(totals.deferredToNextYear).toBe(F3.invoiceTiming);
    expectDollars(totals.incomeTaxSaved, F3.hsa * 0.12, 0.01);
  });

  test('F3: each move carries its deadline, liquidity, MAGI effect and the static copy', () => {
    const plan = optimize(DANI, WITH_GIG);
    const [invoice, purchases, hsa] = plan.moves as [Move, Move, Move];
    expect(invoice).toMatchObject({ deadline: '2026-12-31', liquidity: 'arrives_january' });
    expect(purchases).toMatchObject({ deadline: '2026-12-31', liquidity: 'planned_purchase' });
    expect(hsa).toMatchObject({ deadline: '2027-04-15', liquidity: 'mostly_liquid' });
    expect(invoice).toMatchObject({
      howTo: LEVER_COPY.invoiceTiming.howTo,
      returnLocation: LEVER_COPY.invoiceTiming.returnLocation,
      proof: LEVER_COPY.invoiceTiming.proof,
      warnings: LEVER_COPY.invoiceTiming.warnings,
    });
    expect(invoice.adultId).toBeUndefined();
    // An SE-profit lever lowers MAGI by less than its amount (half of SE tax falls too); the HSA by all of it.
    expectDollars(invoice.magiReduction, F3.invoiceTiming * (1 - HALF_SE_TAX_RATE));
    expectDollars(hsa.magiReduction, F3.hsa, 0.01);
    const totalReduction = plan.moves.reduce((sum, move) => sum + move.magiReduction, 0);
    expectDollars(totalReduction, plan.magiBefore - plan.magiAfter, 0.01);
  });

  test('F3: a move copies the static lists, so changing one cannot change the copy', () => {
    const [invoice] = optimize(DANI, WITH_GIG).moves as [Move];
    expect(invoice.warnings).not.toBe(LEVER_COPY.invoiceTiming.warnings);
  });

  test('F3: maxReductionAvailable is every allowed lever at full capacity', () => {
    const plan = optimize(DANI, WITH_GIG);
    const allIn: LeverAmounts = { ...ZERO_LEVERS, invoiceTiming: 3_000, businessPurchases: 1_800, hsa: 8_750 };
    const magiAllIn = computeIncome(DANI, WITH_GIG, TY2026, allIn).magi;
    expectDollars(plan.maxReductionAvailable, plan.magiBefore - magiAllIn, 0.01);
  });

  test('F4: Keep my cash OFF with SEP first → $5,590 into Dani’s SEP-IRA', () => {
    const plan = optimize(F4_INPUT, WITH_GIG);
    expect(plan.verdict).toBe('worth_it');
    expect(amounts(plan)).toEqual([['sepIra', 'a', F3.oneToOneMove]]);
    expect(plan.moves[0]).toMatchObject({ deadline: '2027-04-15', liquidity: 'locked' });
    expectDollars(plan.magiAfter, F3.oneToOneMagiAfter);
    expectDollars(plan.repaymentAfter, F3.repaymentAfter);
    expect(plan.totals.lockedInRetirement).toBe(F3.oneToOneMove);
    expect(plan.totals.cashCommitted).toBe(F3.oneToOneMove);
    expectDollars(plan.totals.incomeTaxSaved, F3.sepIncomeTaxSaved);
  });

  test('F8: far over the cliff → not worth fighting; set the full repayment aside', () => {
    const farOver = { ...DANI, investments: { ...DANI.investments, otherIncome: 128_000 } };
    for (const keepMyCash of [true, false]) {
      const plan = optimize(withPreferences(farOver, keepMyCash), { gig: null, asOf: DANI_AS_OF });
      expect(plan.verdict).toBe('not_worth_fighting');
      expectDollars(plan.setAside ?? 0, FULL_REPAYMENT);
      expect(plan.setAside).toBe(plan.repaymentBefore);
      expect(plan.moves).toEqual([]);
      expect(plan.magiAfter).toBe(plan.magiBefore);
      expect(plan.repaymentAfter).toBe(plan.repaymentBefore);
      expect(plan.suggestion).toBeNull();
      expect(plan.maxReductionAvailable).toBeGreaterThan(0);
    }
  });

  test('F9: on Feb 1, 2027 the Dec 31 levers are gone → $5,590 into the HSA', () => {
    const plan = optimize(DANI, F9_SCENARIO);
    expect(plan.verdict).toBe('worth_it');
    expect(amounts(plan)).toEqual([['hsa', null, F3.oneToOneMove]]);
    expectDollars(plan.repaymentAfter, F3.repaymentAfter);
  });

  test('F10: silver plan with Keep my cash ON → needs retirement moves', () => {
    const plan = optimize(F10_INPUT, WITH_GIG);
    expect(plan.verdict).toBe('needs_retirement_moves');
    expect(plan.suggestion).toBe('allow_retirement_moves');
    expect(plan.moves).toEqual([]);
    expect(plan.setAside).toBeNull();
    expect(plan.magiAfter).toBe(plan.magiBefore);
    expect(plan.maxReductionAvailable).toBe(0);
  });

  test('F10: Keep my cash OFF → $5,590 into a traditional IRA for Dani', () => {
    const plan = optimize(withPreferences(F10_INPUT, false), WITH_GIG);
    expect(plan.verdict).toBe('worth_it');
    expect(amounts(plan)).toEqual([['traditionalIra', 'a', F3.oneToOneMove]]);
    expectDollars(plan.repaymentAfter, F3.repaymentAfter);
    expect(plan.flags).toEqual([]);
  });
});

describe('optimize: verdicts', () => {
  test('under the line → no rescue needed, nothing changes', () => {
    const plan = optimize(DANI, { gig: null, asOf: DANI_AS_OF });
    expect(plan.verdict).toBe('under_line');
    expect(plan.moves).toEqual([]);
    expect(plan.target).toBe(F1.cliff - SAFETY_BUFFER);
    expectDollars(plan.magiBefore, F1.magi);
    expect(plan.magiAfter).toBe(plan.magiBefore);
    expectDollars(plan.repaymentAfter, F1.repayment);
    expect(plan.repaymentAfter).toBe(plan.repaymentBefore);
    expect(plan.totals).toEqual({ cashCommitted: 0, lockedInRetirement: 0, deferredToNextYear: 0, incomeTaxSaved: 0 });
    expect(plan.setAside).toBeNull();
    expect(plan.suggestion).toBeNull();
  });

  test(`costly when HSA and retirement money exceed ${COSTLY_MULTIPLE}× the credit kept`, () => {
    const plan = optimize(withPreferences(DANI, false, orderStartingWith('sepIra', 'traditionalIra')), withGigOf(40_000));
    const lockedAndHsa = plan.totals.lockedInRetirement + (plan.moves.find((m) => m.leverId === 'hsa')?.amount ?? 0);
    expect(plan.magiAfter).toBeLessThanOrEqual(plan.target);
    expect(lockedAndHsa).toBeGreaterThan(COSTLY_MULTIPLE * (plan.ptcAfter - plan.ptcBefore));
    expect(plan.verdict).toBe('costly');
  });
});

describe('optimize: lever order', () => {
  test('SE-profit levers after a full SEP never push that SEP over its limit', () => {
    const input = withPreferences(DANI, false, orderStartingWith('sepIra', 'invoiceTiming', 'businessPurchases'));
    const scenario = withGigOf(40_000);
    const plan = optimize(input, scenario);
    expect(plan.moves[0]?.leverId).toBe('sepIra');
    const finalLevers = plan.moves.reduce<LeverAmounts>(
      (levers, move) => addLever(levers, slotOf(move), move.amount),
      ZERO_LEVERS,
    );
    const { seProfitByAdult, seTaxByAdult } = computeIncome(input, scenario, TY2026, finalLevers);
    const sepLimitAtEnd = sepLimit(seProfitByAdult.a - seTaxByAdult.a / 2, TY2026.sep);
    expect(finalLevers.sepIra).toBeLessThanOrEqual(sepLimitAtEnd);
    expect(plan.magiAfter).toBeLessThanOrEqual(plan.target);
  });
});

describe('optimize: IRA and SEP are mutually exclusive per adult (IRA_SEP_COMBO_EXCLUDED)', () => {
  test("a SEP for Dani rules out Dani's IRA; Alex's IRA still counts", () => {
    const plan = optimize(withPreferences(DANI, false, orderStartingWith('sepIra', 'traditionalIra')), withGigOf(40_000));
    const sep = plan.moves.find((m) => m.leverId === 'sepIra');
    expect(sep?.adultId).toBe('a');
    expect(plan.moves.filter((m) => m.leverId === 'traditionalIra').map((m) => m.adultId)).toEqual(['b']);
    expect(plan.flags).toContain('IRA_SEP_COMBO_EXCLUDED');
  });

  test("an IRA for Dani rules out Dani's SEP", () => {
    const plan = optimize(withPreferences(DANI, false, orderStartingWith('traditionalIra', 'sepIra')), withGigOf(30_000));
    expect(amounts(plan).slice(0, 2)).toEqual([
      ['traditionalIra', 'a', 7_500],
      ['traditionalIra', 'b', 7_500],
    ]);
    expect(plan.moves.some((m) => m.leverId === 'sepIra')).toBe(false);
    expect(plan.moves.at(-1)?.leverId).toBe('hsa');
    expect(plan.magiAfter).toBeLessThanOrEqual(plan.target);
    expect(plan.flags).toContain('IRA_SEP_COMBO_EXCLUDED');
  });

  test('IRA sub-levers run non-covered adults first, then a before b; a covered adult is phased out', () => {
    const [dani, alex] = DANI.adults;
    if (alex === undefined) throw new Error('The Dani sample has two adults');
    const daniCovered = { ...DANI, adults: [{ ...dani, coveredByWorkplacePlan: true }, alex] as HouseholdInput['adults'] };
    const order = orderStartingWith('traditionalIra');
    // Dani's IRA MAGI after Alex's IRA is about $140k: inside the $129k–$149k covered range.
    const plan = optimize(withPreferences(daniCovered, false, order), withGigOf(20_000));
    const iras = plan.moves.filter((m) => m.leverId === 'traditionalIra');
    expect(iras.map((m) => m.adultId)).toEqual(['b', 'a']);
    expect(iras[0]?.amount).toBe(7_500);
    expect(iras[1]?.amount).toBeGreaterThan(0);
    expect(iras[1]?.amount).toBeLessThan(7_500);
  });
});

/** Replays the plan's moves in order and checks each amount against the capacity at that point. */
function expectWithinCapacity(input: HouseholdInput, scenario: Scenario, plan: PlanResult): void {
  let levers: LeverAmounts = ZERO_LEVERS;
  for (const move of plan.moves) {
    const slot = slotOf(move);
    const state = planState(input, scenario, TY2026, levers);
    expect(move.amount, move.leverId).toBeLessThanOrEqual(capacity(slot, state, input, TY2026));
    levers = addLever(levers, slot, move.amount);
  }
}

describe('optimize: F15 properties', () => {
  const cases: ReadonlyArray<readonly [string, HouseholdInput, Scenario]> = [
    ['F3', DANI, WITH_GIG],
    ['F4', F4_INPUT, WITH_GIG],
    ['F9', DANI, F9_SCENARIO],
    ['F10 cash ON', F10_INPUT, WITH_GIG],
    ['F10 cash OFF', withPreferences(F10_INPUT, false), WITH_GIG],
  ];

  test.each(cases)('%s: amounts are positive multiples of $10', (_id, input, scenario) => {
    for (const move of optimize(input, scenario).moves) {
      expect(move.amount % 10).toBe(0);
      expect(move.amount).toBeGreaterThan(0);
    }
  });

  test.each(cases)('%s: no move exceeds its capacity', (_id, input, scenario) => {
    expectWithinCapacity(input, scenario, optimize(input, scenario));
  });

  test.each(cases)('%s: nothing locked away when Keep my cash is ON', (_id, input, scenario) => {
    const plan = optimize(input, scenario);
    if (input.preferences.keepMyCash) expect(plan.moves.every((m) => m.liquidity !== 'locked')).toBe(true);
  });

  test.each(cases)('%s: a feasible plan lands at or under the target', (_id, input, scenario) => {
    const plan = optimize(input, scenario);
    if (plan.verdict === 'worth_it' || plan.verdict === 'costly') {
      expect(plan.magiAfter).toBeLessThanOrEqual(plan.target);
    }
  });

  test.each(cases)('%s: deterministic', (_id, input, scenario) => {
    expect(optimize(input, scenario)).toEqual(optimize(input, scenario));
  });
});

describe('server-only boundary', () => {
  test('the client-safe engine index does not export the optimizer or levers', () => {
    for (const name of ['optimize', 'LEVER_COPY', 'isEligible', 'capacity', 'planState', 'SAFETY_BUFFER']) {
      expect(name in engine, name).toBe(false);
    }
  });

  test('the server entry exports the optimizer, levers and tax estimate', () => {
    expect(server.optimize).toBe(optimize);
    expect(server.LEVER_COPY).toBe(LEVER_COPY);
    expect(server.capacity).toBe(capacity);
    expect(server.federalTax).toBe(federalTax);
    expect(server.SAFETY_BUFFER).toBe(1_000);
    expect(server.COSTLY_MULTIPLE).toBe(3);
  });

  test.each(['optimizer.ts', 'levers.ts', 'server.ts', 'gig.ts'])('%s starts with the server-only guard', (file) => {
    const source = readFileSync(fileURLToPath(new URL(`../${file}`, import.meta.url)), 'utf8');
    expect(source.startsWith("import 'server-only';")).toBe(true);
  });
});

describe('optimize: catastrophic plans', () => {
  test('over the cliff on a catastrophic plan: nothing to protect, no moves, flagged', () => {
    const catastrophic: HouseholdInput = { ...DANI, marketplace: { ...DANI.marketplace, planMetal: 'catastrophic' } };
    const plan = optimize(catastrophic, WITH_GIG);
    expect(plan.verdict).toBe('under_line');
    expect(plan.moves).toEqual([]);
    expect(plan.flags).toEqual(['CATASTROPHIC_NO_PTC']);
  });
});
