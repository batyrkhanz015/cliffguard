import { describe, expect, test } from 'vitest';
import { DANI, DANI_AS_OF, DANI_GIG } from '@/samples/dani';
import {
  addLever,
  capacity,
  excludedByIraSepCombo,
  isEligible,
  LEVER_COPY,
  planState,
  type LeverSlot,
} from '../levers';
import { TY2026 } from '../rules/ty2026';
import {
  LeverIdSchema,
  ZERO_LEVERS,
  type AdultInput,
  type HouseholdInput,
  type LeverAmounts,
  type Scenario,
} from '../types';
import { expectDollars, F3 } from './fixtures';

const WITH_GIG: Scenario = { gig: DANI_GIG, asOf: DANI_AS_OF };
const NO_GIG: Scenario = { gig: null, asOf: DANI_AS_OF };
/** Half of SE tax per dollar of SE profit below the wage base. */
const HALF_SE_TAX_RATE = (0.9235 * 0.153) / 2;
function secondAdult(input: HouseholdInput): AdultInput {
  const adult = input.adults[1];
  if (adult === undefined) throw new Error('Expected a second adult');
  return adult;
}
const DANI_ADULT = DANI.adults[0];
const ALEX = secondAdult(DANI);

const IRA_A: LeverSlot = { leverId: 'traditionalIra', adultId: 'a' };
const IRA_B: LeverSlot = { leverId: 'traditionalIra', adultId: 'b' };

function capacityFor(
  slot: LeverSlot,
  input: HouseholdInput = DANI,
  levers: LeverAmounts = ZERO_LEVERS,
  scenario: Scenario = WITH_GIG,
): number {
  return capacity(slot, planState(input, scenario, TY2026, levers), input, TY2026);
}

function withAdults(adults: HouseholdInput['adults'], changes: Partial<HouseholdInput> = {}): HouseholdInput {
  return { ...DANI, adults, ...changes };
}

/** A W-2-only adult with no investments elsewhere in the household. */
function w2Adult(id: AdultInput['id'], wages: number, coveredByWorkplacePlan: boolean): AdultInput {
  return {
    ...ALEX,
    id,
    selfEmploymentProfit: { ytd: 0, expectedRest: 0 },
    wages: { ytd: wages, expectedRest: 0 },
    coveredByWorkplacePlan,
  };
}

const NO_INVESTMENTS: HouseholdInput['investments'] = {
  taxableInterest: 0,
  taxExemptInterest: 0,
  dividends: 0,
  capitalGainsNet: 0,
  otherIncome: 0,
  otherMagiAddbacks: 0,
};

describe('LEVER_COPY (spec §A.6, static)', () => {
  test('covers exactly the v1 levers, each with every field filled', () => {
    expect(Object.keys(LEVER_COPY).sort()).toEqual([...LeverIdSchema.options].sort());
    for (const copy of Object.values(LEVER_COPY)) {
      expect(copy.name.length).toBeGreaterThan(0);
      expect(copy.returnLocation.length).toBeGreaterThan(0);
      expect(copy.howTo.length).toBeGreaterThan(0);
      expect(copy.proof.length).toBeGreaterThan(0);
      expect(copy.warnings.length).toBeGreaterThan(0);
    }
  });

  test('return locations are verbatim from the spec', () => {
    expect(LEVER_COPY.invoiceTiming.returnLocation).toBe('Not on your 2026 Schedule C; on the 2027 return.');
    expect(LEVER_COPY.businessPurchases.returnLocation).toBe('Schedule C expense (or depreciation / §179).');
    expect(LEVER_COPY.hsa.returnLocation).toBe('Form 8889 → Schedule 1.');
    expect(LEVER_COPY.delayStockSale.returnLocation).toBe('Not on the 2026 Form 8949.');
    expect(LEVER_COPY.traditionalIra.returnLocation).toBe('Schedule 1 IRA deduction.');
    expect(LEVER_COPY.sepIra.returnLocation).toBe('Schedule 1, SEP deduction.');
  });

  test('invoice timing warns about constructive receipt and the 2027 estimate', () => {
    const { warnings } = LEVER_COPY.invoiceTiming;
    expect(warnings.join(' ')).toContain("don't ask a client to hold a check");
    expect(warnings).toContain('Add it to your 2027 Marketplace estimate.');
  });

  test('copy carries no dollar amounts (amounts come from the engine)', () => {
    const text = Object.values(LEVER_COPY)
      .flatMap((copy) => [copy.name, copy.returnLocation, ...copy.howTo, ...copy.proof])
      .join(' ');
    expect(text).not.toMatch(/\$\d/);
  });
});

describe('isEligible', () => {
  test.each([
    ['invoiceTiming', '2026-12-31', true],
    ['invoiceTiming', '2027-01-01', false],
    ['businessPurchases', '2027-01-01', false],
    ['delayStockSale', '2027-01-01', false],
    ['hsa', '2027-04-15', true],
    ['hsa', '2027-04-16', false],
    ['traditionalIra', '2027-04-15', true],
    ['traditionalIra', '2027-04-16', false],
    ['sepIra', '2027-04-15', true],
    ['sepIra', '2027-04-16', false],
  ] as const)('%s on %s → %s', (lever, asOf, ok) => {
    expect(isEligible(lever, DANI, asOf, TY2026).ok).toBe(ok);
  });

  test('a passed deadline gives a reason naming the deadline', () => {
    expect(isEligible('invoiceTiming', DANI, '2027-02-01', TY2026)).toEqual({
      ok: false,
      reason: 'Deadline passed: Dec 31, 2026',
    });
  });

  test.each(['bronze', 'catastrophic'] as const)('HSA is open with a %s plan', (planMetal) => {
    const input = { ...DANI, marketplace: { ...DANI.marketplace, planMetal } };
    expect(isEligible('hsa', input, DANI_AS_OF, TY2026)).toEqual({ ok: true });
  });

  test.each([
    ['silver', 'Not HSA-eligible: silver plan, unless it is an HSA-qualified HDHP'],
    ['unknown', 'Not HSA-eligible: plan type unknown, unless it is an HSA-qualified HDHP'],
  ] as const)('HSA is closed with a %s plan', (planMetal, reason) => {
    const input = { ...DANI, marketplace: { ...DANI.marketplace, planMetal } };
    expect(isEligible('hsa', input, DANI_AS_OF, TY2026)).toEqual({ ok: false, reason });
  });
});

describe('capacity', () => {
  test('F3: invoice timing is the unbilled work; purchases are the planned purchases; HSA the family limit', () => {
    expect(capacityFor({ leverId: 'invoiceTiming' })).toBe(F3.invoiceTiming);
    expect(capacityFor({ leverId: 'businessPurchases' })).toBe(F3.businessPurchases);
    expect(capacityFor({ leverId: 'hsa' })).toBe(8_750);
  });

  test('invoice timing adds the gig when it can be billed in January', () => {
    const state = planState(DANI, { ...WITH_GIG, gig: { ...DANI_GIG, canBillInJanuary: true } }, TY2026);
    expect(capacity({ leverId: 'invoiceTiming' }, state, DANI, TY2026)).toBe(15_000);
  });

  test('SE levers never exceed the SE profit that is left', () => {
    const input = { ...DANI, levers: { ...DANI.levers, unbilledInvoicesMovable: 500_000, plannedPurchases: 500_000 } };
    expect(capacityFor({ leverId: 'invoiceTiming' }, input)).toBe(103_500);
    const afterInvoices = { ...ZERO_LEVERS, invoiceTiming: 100_000 };
    expect(capacityFor({ leverId: 'businessPurchases' }, input, afterInvoices)).toBe(3_500);
  });

  test('invoice timing never removes the SE profit that backs SEP money already in', () => {
    const input = { ...DANI, levers: { ...DANI.levers, unbilledInvoicesMovable: 50_000 } };
    const sep = { ...ZERO_LEVERS, sepIra: 15_000 };
    const sepRoom = capacityFor({ leverId: 'sepIra' }, input, sep);
    const movable = capacityFor({ leverId: 'invoiceTiming' }, input, sep);
    expectDollars(movable, sepRoom / TY2026.sep.selfEmployedRate, 0.01);
    // With that much billed in January, the SEP is still within its limit.
    const after = planState(input, WITH_GIG, TY2026, { ...sep, invoiceTiming: movable });
    expect(capacity({ leverId: 'sepIra' }, after, input, TY2026)).toBeGreaterThan(0);
  });

  test('SE levers have no capacity without SE income or under $400 of net earnings', () => {
    const w2Only = withAdults([w2Adult('a', 50_000, false)], { filingStatus: 'single', householdSize: 1 });
    const noGig = planState(w2Only, NO_GIG, TY2026);
    expect(capacity({ leverId: 'invoiceTiming' }, noGig, w2Only, TY2026)).toBe(0);
    expect(capacity({ leverId: 'sepIra' }, noGig, w2Only, TY2026)).toBe(0);

    const tiny = planState(w2Only, { gig: { amount: 400, canBillInJanuary: false }, asOf: DANI_AS_OF }, TY2026);
    expect(capacity({ leverId: 'businessPurchases' }, tiny, w2Only, TY2026)).toBe(0);
  });

  test('HSA: self-only limit, prorated by months with credit, minus what is in already', () => {
    const marketplace = { ...DANI.marketplace, coverage: 'self' as const, monthsWithAptc: 6 };
    const input = { ...DANI, marketplace, adjustments: { ...DANI.adjustments, hsaContributedSoFar: 1_000 } };
    expect(capacityFor({ leverId: 'hsa' }, input)).toBe(4_400 / 2 - 1_000);
  });

  test('delaying a stock sale removes at most the gains above the −$3,000 loss floor', () => {
    const planned = { ...DANI, levers: { ...DANI.levers, plannedStockSaleGains: 4_000 } };
    expect(capacityFor({ leverId: 'delayStockSale' }, { ...planned, investments: { ...DANI.investments, capitalGainsNet: 4_000 } })).toBe(4_000);
    expect(capacityFor({ leverId: 'delayStockSale' }, { ...planned, investments: { ...DANI.investments, capitalGainsNet: -1_000 } })).toBe(2_000);
  });

  test('F4: SEP is 20% of current SE profit minus half SE tax, less what is in already', () => {
    expectDollars(capacityFor({ leverId: 'sepIra' }), F3.sepCapacity);
    const soFar = withAdults([{ ...DANI_ADULT, contributedSoFar: { traditionalIra: 0, sepIra: 4_000 } }, ALEX]);
    expectDollars(capacityFor({ leverId: 'sepIra' }, soFar), F3.sepCapacity - 4_000);
  });

  test('SEP uses the SE profit left after invoice timing', () => {
    const reduced = capacityFor({ leverId: 'sepIra' }, DANI, { ...ZERO_LEVERS, invoiceTiming: 10_000 });
    expectDollars(reduced, F3.sepCapacity - 0.2 * 10_000 * (1 - HALF_SE_TAX_RATE));
  });

  test('F10: a traditional IRA for Dani (nobody covered) is the full $7,500, less what is in already', () => {
    expect(capacityFor(IRA_A)).toBe(7_500);
    const soFar = withAdults([{ ...DANI_ADULT, contributedSoFar: { traditionalIra: 2_000, sepIra: 0 } }, ALEX]);
    expect(capacityFor(IRA_A, soFar)).toBe(5_500);
  });

  test('IRA phase-out: a covered single filer with IRA MAGI of $86,000 can put in $3,750', () => {
    const single = withAdults([w2Adult('a', 86_000, true)], {
      filingStatus: 'single',
      householdSize: 1,
      investments: NO_INVESTMENTS,
    });
    const state = planState(single, NO_GIG, TY2026);
    expect(state.income.agi).toBe(86_000);
    expect(capacity(IRA_A, state, single, TY2026)).toBe(3_750);
  });

  test('IRA phase-out: the non-covered spouse of a covered adult uses $242k–$252k', () => {
    const couple = withAdults([w2Adult('a', 200_000, false), w2Adult('b', 47_000, true)], {
      investments: NO_INVESTMENTS,
    });
    const state = planState(couple, NO_GIG, TY2026);
    expect(capacity(IRA_A, state, couple, TY2026)).toBe(3_750);
    expect(capacity(IRA_B, state, couple, TY2026)).toBe(0);
  });

  test("a planned SEP makes its adult covered, which can shrink the spouse's IRA", () => {
    // IRA MAGI ≈ 132,688 + 124,000 − 10,000 SEP = 246,688: inside the $242k–$252k spouse range.
    const rich = { ...DANI, investments: { ...DANI.investments, otherIncome: 124_000 } };
    const withoutSep = capacityFor(IRA_B, rich);
    const withSep = capacityFor(IRA_B, rich, { ...ZERO_LEVERS, sepIra: 10_000 });
    expect(withoutSep).toBe(7_500);
    expect(withSep).toBeGreaterThan(0);
    expect(withSep).toBeLessThan(7_500);
  });

  test('IRA is limited by compensation; a spouse may use joint compensation', () => {
    const lowWage = withAdults([w2Adult('a', 3_000, false)], {
      filingStatus: 'single',
      householdSize: 1,
      investments: NO_INVESTMENTS,
    });
    expect(capacityFor(IRA_A, lowWage, ZERO_LEVERS, NO_GIG)).toBe(3_000);

    const noWages = withAdults([DANI_ADULT, { ...ALEX, wages: { ytd: 0, expectedRest: 0 } }]);
    expect(capacityFor(IRA_B, noWages)).toBe(7_500);
    const jointShort = withAdults(
      [w2Adult('a', 9_000, false), w2Adult('b', 0, false)],
      { investments: NO_INVESTMENTS },
    );
    const afterA = { ...ZERO_LEVERS, traditionalIra: { a: 7_500, b: 0 } };
    expect(capacityFor(IRA_B, jointShort, afterA, NO_GIG)).toBe(1_500);
  });
});

describe('excludedByIraSepCombo (G2: IRA and SEP are mutually exclusive per adult)', () => {
  const state = (levers: LeverAmounts, input: HouseholdInput = DANI) => planState(input, WITH_GIG, TY2026, levers);

  test('a SEP for Dani excludes an IRA for Dani, not for Alex', () => {
    const sep = state({ ...ZERO_LEVERS, sepIra: 1_000 });
    expect(excludedByIraSepCombo(IRA_A, sep, DANI)).toBe(true);
    expect(excludedByIraSepCombo(IRA_B, sep, DANI)).toBe(false);
  });

  test("an IRA for Dani excludes Dani's SEP; Alex's IRA does not", () => {
    expect(excludedByIraSepCombo({ leverId: 'sepIra' }, state({ ...ZERO_LEVERS, traditionalIra: { a: 1_000, b: 0 } }), DANI)).toBe(true);
    expect(excludedByIraSepCombo({ leverId: 'sepIra' }, state({ ...ZERO_LEVERS, traditionalIra: { a: 0, b: 1_000 } }), DANI)).toBe(false);
  });

  test('contributions made so far count as used', () => {
    const iraSoFar = withAdults([{ ...DANI_ADULT, contributedSoFar: { traditionalIra: 500, sepIra: 0 } }, ALEX]);
    expect(excludedByIraSepCombo({ leverId: 'sepIra' }, state(ZERO_LEVERS, iraSoFar), iraSoFar)).toBe(true);
    const sepSoFar = withAdults([{ ...DANI_ADULT, contributedSoFar: { traditionalIra: 0, sepIra: 500 } }, ALEX]);
    expect(excludedByIraSepCombo(IRA_A, state(ZERO_LEVERS, sepSoFar), sepSoFar)).toBe(true);
  });

  test('other levers are never excluded', () => {
    expect(excludedByIraSepCombo({ leverId: 'hsa' }, state({ ...ZERO_LEVERS, sepIra: 1_000 }), DANI)).toBe(false);
  });
});

describe('addLever', () => {
  test('adds to the lever, and to the right adult for a traditional IRA', () => {
    const once = addLever(ZERO_LEVERS, { leverId: 'hsa' }, 1_130);
    const twice = addLever(once, IRA_B, 2_000);
    expect(twice).toEqual({ ...ZERO_LEVERS, hsa: 1_130, traditionalIra: { a: 0, b: 2_000 } });
    expect(once.traditionalIra).toEqual({ a: 0, b: 0 });
  });
});
