import { describe, expect, test } from 'vitest';
import { DANI, DANI_AS_OF, DANI_GIG } from '@/samples/dani';
import { computeIncome } from '../income';
import { TY2026 } from '../rules/ty2026';
import { HouseholdInputSchema, ZERO_LEVERS, type AdultInput, type HouseholdInput, type Scenario } from '../types';
import { expectDollars, F1 } from './fixtures';

const NO_GIG = { gig: null, asOf: DANI_AS_OF };
const WITH_GIG = { gig: DANI_GIG, asOf: DANI_AS_OF };

function secondAdult(input: HouseholdInput): AdultInput {
  const adult = input.adults[1];
  if (adult === undefined) throw new Error('Expected a second adult');
  return adult;
}
const DANI_ADULT = DANI.adults[0];
const ALEX = secondAdult(DANI);

function withDani(changes: Partial<AdultInput>): HouseholdInput {
  return { ...DANI, adults: [{ ...DANI_ADULT, ...changes }, ALEX] };
}

describe('HouseholdInputSchema', () => {
  test('accepts the Dani sample', () => {
    expect(HouseholdInputSchema.safeParse(DANI).success).toBe(true);
  });

  test('F14: rejects married filing separately with FILING_STATUS_UNSUPPORTED', () => {
    const result = HouseholdInputSchema.safeParse({ ...DANI, filingStatus: 'mfs' });
    expect(result.success).toBe(false);
    expect(result.error?.issues).toContainEqual(
      expect.objectContaining({ path: ['filingStatus'], message: 'FILING_STATUS_UNSUPPORTED' }),
    );
  });

  test('rejects a second adult unless filing jointly', () => {
    expect(HouseholdInputSchema.safeParse({ ...DANI, filingStatus: 'hoh' }).success).toBe(false);
  });

  test('rejects a repeated lever in the lever order', () => {
    const preferences = { keepMyCash: true, leverOrder: ['hsa', 'hsa'] };
    expect(HouseholdInputSchema.safeParse({ ...DANI, preferences }).success).toBe(false);
  });
});

describe('computeIncome', () => {
  test('F1: Dani, where you stand', () => {
    const income = computeIncome(DANI, NO_GIG, TY2026);
    expectDollars(income.halfSeTax, F1.halfSeTax);
    expectDollars(income.agi, F1.agi);
    expectDollars(income.magi, F1.magi);
    expect(income.seAdultId).toBe('a');
    expect(income.wages).toBe(35_000);
    expect(income.seProfitByAdult).toEqual({ a: 91_500, b: 0 });
    expect(income.seTaxByAdult.b).toBe(0);
  });

  test('F3: a gig goes to the SE adult (MAGI with gig 133,188)', () => {
    const income = computeIncome(DANI, WITH_GIG, TY2026);
    expect(income.seProfitByAdult.a).toBe(103_500);
    expectDollars(income.magi, 133_188);
  });

  test('F3: SE-profit and HSA levers lower MAGI to 127,597', () => {
    const levers = { ...ZERO_LEVERS, invoiceTiming: 3_000, businessPurchases: 1_800, hsa: 1_130 };
    expectDollars(computeIncome(DANI, WITH_GIG, TY2026, levers).magi, 127_597);
  });

  test('F4 / F10: SEP or traditional IRA lowers MAGI dollar for dollar (127,598)', () => {
    const sep = { ...ZERO_LEVERS, sepIra: 5_590 };
    const ira = { ...ZERO_LEVERS, traditionalIra: { a: 5_590, b: 0 } };
    expectDollars(computeIncome(DANI, WITH_GIG, TY2026, sep).magi, 127_598);
    expectDollars(computeIncome(DANI, WITH_GIG, TY2026, ira).magi, 127_598);
  });

  test('F8: other income flows straight into MAGI (250,036)', () => {
    const farOver = { ...DANI, investments: { ...DANI.investments, otherIncome: 128_000 } };
    expectDollars(computeIncome(farOver, NO_GIG, TY2026).magi, 250_036);
  });

  test('SE above the Social Security wage base pays only 2.9% on the excess', () => {
    const income = computeIncome(withDani({ selfEmploymentProfit: { ytd: 250_000, expectedRest: 0 } }), NO_GIG, TY2026);
    // 0.124 × 184,500 + 0.029 × (250,000 × 0.9235)
    expectDollars(income.seTaxByAdult.a, 29_573.38, 0.01);
  });

  test("the wage base is reduced by that adult's own W-2 wages", () => {
    const income = computeIncome(
      withDani({ selfEmploymentProfit: { ytd: 50_000, expectedRest: 0 }, wages: { ytd: 150_000, expectedRest: 0 } }),
      NO_GIG,
      TY2026,
    );
    // 0.124 × (184,500 − 150,000) + 0.029 × (50,000 × 0.9235)
    expectDollars(income.seTaxByAdult.a, 5_617.08, 0.01);
  });

  test('no SE tax when net earnings are under $400', () => {
    const under = computeIncome(withDani({ selfEmploymentProfit: { ytd: 433, expectedRest: 0 } }), NO_GIG, TY2026);
    const over = computeIncome(withDani({ selfEmploymentProfit: { ytd: 434, expectedRest: 0 } }), NO_GIG, TY2026);
    expect(under.seTaxByAdult.a).toBe(0);
    expect(over.seTaxByAdult.a).toBeGreaterThan(0);
  });

  test('a net capital loss is limited to −$3,000', () => {
    const losses = { ...DANI, investments: { ...DANI.investments, capitalGainsNet: -10_000 } };
    const income = computeIncome(losses, NO_GIG, TY2026);
    expect(income.capGainsAllowed).toBe(-3_000);
    expectDollars(income.magi, F1.magi - 3_000);
  });

  test('delaying a planned stock sale removes those gains', () => {
    const gains = { ...DANI, investments: { ...DANI.investments, capitalGainsNet: 8_000 } };
    const income = computeIncome(gains, NO_GIG, TY2026, { ...ZERO_LEVERS, delayStockSale: 5_000 });
    expect(income.capGainsAllowed).toBe(3_000);
  });

  test('what-if deltas apply to the SE adult and to investment income', () => {
    const base = computeIncome(DANI, NO_GIG, TY2026);
    const what = (extra: NonNullable<Scenario['extra']>) =>
      computeIncome(DANI, { ...NO_GIG, extra }, TY2026);
    expect(what({ selfEmployment: 1_000 }).seProfitByAdult.a).toBe(92_500);
    expect(what({ capitalGains: 2_000 }).capGainsAllowed).toBe(2_000);
    expectDollars(what({ interestOrDividends: 300 }).magi - base.magi, 300, 0.01);
  });

  test('a W-2-only single filer has no SE adult', () => {
    const single: HouseholdInput = {
      ...DANI,
      filingStatus: 'single',
      householdSize: 1,
      adults: [{ ...ALEX, id: 'a' }],
    };
    const income = computeIncome(single, NO_GIG, TY2026);
    expect(income.seAdultId).toBeNull();
    expect(income.halfSeTax).toBe(0);
    expect(income.seProfitByAdult).toEqual({ a: 0, b: 0 });
    expect(income.agi).toBe(35_000 + 500 + 1_000);
    expect(income.magi).toBe(35_000 + 500 + 1_000 + 500);
  });
});
