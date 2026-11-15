import { describe, expect, test } from 'vitest';
import { DANI } from '@/samples/dani';
import { reconcile, type ReconcileInput } from '../reconcile';
import { FPL_2024, TY2025_ENHANCED } from '../rules/ty2025-enhanced';
import { TY2026 } from '../rules/ty2026';
import { deriveSlcsp } from '../slcsp';
import type { EngineErrorCode, HouseholdInput } from '../types';
import { DANI_RECONCILE, expectDollars, F1 } from './fixtures';

function withMarketplace(changes: Partial<HouseholdInput['marketplace']>, base: HouseholdInput = DANI): HouseholdInput {
  return { ...base, marketplace: { ...base.marketplace, ...changes } };
}

function expectEngineError(run: () => unknown, code: EngineErrorCode): void {
  expect(run).toThrow(expect.objectContaining({ name: 'EngineError', code }));
}

/** Morkel cases 1 and 2: a single filer who told the Marketplace $31,300 (spec §B F5, F6). */
const MORKEL: HouseholdInput = {
  ...DANI,
  filingStatus: 'single',
  householdSize: 1,
  adults: [DANI.adults[0]],
  marketplace: { ...DANI.marketplace, incomeEstimate: 31_300, aptcMonthly: 7_294 / 12, premiumMonthly: null },
};
const MORKEL_RECONCILE: ReconcileInput = {
  magi: 56_000,
  state: MORKEL.state,
  householdSize: 1,
  filingStatus: 'single',
  slcspAnnual: 9_360,
  aptcMonthly: MORKEL.marketplace.aptcMonthly,
  monthsWithAptc: 12,
  premiumMonthly: null,
};

/** KFF family of 3 in plan year 2025 (spec §B F7). */
const KFF: HouseholdInput = {
  ...DANI,
  householdSize: 3,
  marketplace: { ...DANI.marketplace, incomeEstimate: 100_000, aptcMonthly: 34_463 / 12, premiumMonthly: null },
};
const KFF_RECONCILE: ReconcileInput = {
  magi: 105_000,
  state: KFF.state,
  householdSize: 3,
  filingStatus: 'mfj',
  slcspAnnual: 42_643,
  aptcMonthly: KFF.marketplace.aptcMonthly,
  monthsWithAptc: 12,
  premiumMonthly: null,
};

describe('deriveSlcsp (spec §A.4)', () => {
  test('F1: Dani benchmark derived from her advance credit and estimate → $19,800', () => {
    const slcsp = deriveSlcsp(DANI, TY2026);
    expect(slcsp.source).toBe('derived');
    expectDollars(slcsp.annual, F1.slcsp);
  });

  test('F5: Morkel single filer at 200% FPL → ≈ $9,360', () => {
    expectDollars(deriveSlcsp(MORKEL, TY2026).annual, 9_360);
  });

  test('F7: KFF family of 3 under the 2025 rules → $42,643', () => {
    expectDollars(deriveSlcsp(KFF, TY2025_ENHANCED).annual, 42_643);
  });

  test('a derived benchmark reconciles to $0 at the estimate itself', () => {
    const r = reconcile({ ...DANI_RECONCILE, magi: DANI.marketplace.incomeEstimate }, TY2026);
    expect(r.repayment).toBe(0);
    expect(r.refund).toBe(0);
  });

  test('F12: an override is used as is, with source manual', () => {
    expect(deriveSlcsp(withMarketplace({ slcspAnnualOverride: 20_000 }), TY2026)).toEqual({
      annual: 20_000,
      source: 'manual',
    });
  });

  test('an override wins even when the derivation guards fail', () => {
    const input = withMarketplace({ slcspAnnualOverride: 20_000, tookFullCredit: false, aptcMonthly: 1_240 });
    expect(deriveSlcsp(input, TY2026).source).toBe('manual');
  });

  test('F12: did not take the full credit and no override → SLCSP_REQUIRED', () => {
    expectEngineError(() => deriveSlcsp(withMarketplace({ tookFullCredit: false }), TY2026), 'SLCSP_REQUIRED');
  });

  test('household changed during the year and no override → SLCSP_REQUIRED', () => {
    expectEngineError(() => deriveSlcsp(withMarketplace({ householdUnchanged: false }), TY2026), 'SLCSP_REQUIRED');
  });

  test('F12: advance credit at least the premium → SLCSP_DERIVATION_UNRELIABLE', () => {
    expectEngineError(
      () => deriveSlcsp(withMarketplace({ aptcMonthly: 1_240, premiumMonthly: 1_240 }), TY2026),
      'SLCSP_DERIVATION_UNRELIABLE',
    );
  });

  test('estimate over the cliff with an advance credit → ESTIMATE_OVER_CLIFF_WITH_APTC', () => {
    expectEngineError(
      () => deriveSlcsp(withMarketplace({ incomeEstimate: 128_601 }), TY2026),
      'ESTIMATE_OVER_CLIFF_WITH_APTC',
    );
  });

  test('estimate over the cliff with no advance credit → SLCSP_REQUIRED', () => {
    expectEngineError(
      () => deriveSlcsp(withMarketplace({ incomeEstimate: 128_601, aptcMonthly: 0 }), TY2026),
      'SLCSP_REQUIRED',
    );
  });

  test('estimate below 100% FPL → SLCSP_REQUIRED', () => {
    expectEngineError(() => deriveSlcsp(withMarketplace({ incomeEstimate: 32_149 }), TY2026), 'SLCSP_REQUIRED');
  });
});

describe('reconcile (Form 8962, TY2026: no repayment cap)', () => {
  test('F1: Dani at MAGI 122,036 → PTC 7,645, repayment 1,697', () => {
    const r = reconcile(DANI_RECONCILE, TY2026);
    expect(r.fpl).toBe(F1.fpl);
    expect(r.cliff).toBe(F1.cliff);
    expect(r.fplPercent).toBe(F1.fplPercent);
    expect(r.overCliff).toBe(false);
    expect(r.applicableFigure).toBe(F1.applicableFigure);
    expectDollars(r.ptcAllowed, F1.ptcAllowed);
    expectDollars(r.aptcReceived, F1.aptcReceived);
    expectDollars(r.repayment, F1.repayment);
    expect(r.refund).toBe(0);
  });

  test.each([
    [100_000, 0, 498],
    [105_000, 0, 0],
    [115_000, 996, 0],
    [120_000, 1_494, 0],
    [128_599, 2_350, 0],
    [128_600, 2_351, 0],
    [128_601, 9_342, 0],
    [134_000, 9_342, 0],
    [250_000, 9_342, 0],
  ])('F2: Dani at MAGI %i → repayment %i, refund %i', (magi, repayment, refund) => {
    const r = reconcile({ ...DANI_RECONCILE, magi }, TY2026);
    expectDollars(r.repayment, repayment);
    expectDollars(r.refund, refund);
  });

  test('F2: exactly at the cliff is eligible; one dollar over loses the whole credit', () => {
    const atCliff = reconcile({ ...DANI_RECONCILE, magi: F1.cliff }, TY2026);
    const over = reconcile({ ...DANI_RECONCILE, magi: F1.cliff + 1 }, TY2026);
    expect(atCliff.overCliff).toBe(false);
    expect(over.overCliff).toBe(true);
    expect(over.fplPercent).toBe(401);
    expect(over.applicableFigure).toBeNull();
    expect(over.annualContribution).toBe(0);
    expect(over.ptcAllowed).toBe(0);
    expect(over.repayment).toBe(Math.round(over.aptcReceived));
  });

  // docs/tax-tables-2026.md §5 item 10. The example gives no state or filing status: any
  // 48-state household of 2 has FPL $21,150, and TY2026 has no cap, so filing status is moot.
  test('IRS 2026 draft i8962, Allocation Situation 4: household income $71,910 → excess APTC $1,529', () => {
    const r = reconcile(
      {
        magi: 71_910,
        state: 'OH',
        householdSize: 2,
        filingStatus: 'mfj',
        slcspAnnual: 9_600,
        aptcMonthly: 3_967 / 12,
        monthsWithAptc: 12,
        premiumMonthly: 10_400 / 12,
      },
      TY2026,
    );
    expect(r.fpl).toBe(21_150);
    expect(r.fplPercent).toBe(340);
    expect(r.applicableFigure).toBe(0.0996);
    expect(r.annualContribution).toBe(7_162);
    expectDollars(r.ptcAllowed, 2_438);
    expectDollars(r.aptcReceived, 3_967);
    expect(r.repayment).toBe(1_529);
    expect(r.refund).toBe(0);
  });

  test('the credit is the smaller of the premium and the benchmark gap (Form 8962 col. e)', () => {
    // At 100,000 the gap is 9,840 a year (820 a month), above a 700 premium.
    const r = reconcile({ ...DANI_RECONCILE, magi: 100_000, premiumMonthly: 700 }, TY2026);
    expectDollars(r.ptcAllowed, 8_400);
    expect(r.repayment).toBe(942);
  });

  test('without a premium the refund is not capped', () => {
    const r = reconcile({ ...DANI_RECONCILE, magi: 100_000, premiumMonthly: null }, TY2026);
    expect(r.refund).toBe(498);
  });

  test('partial year: monthly amounts times the months with a credit', () => {
    const full = reconcile(DANI_RECONCILE, TY2026);
    const half = reconcile({ ...DANI_RECONCILE, monthsWithAptc: 6 }, TY2026);
    expectDollars(half.aptcReceived, 4_671);
    expectDollars(half.ptcAllowed, full.ptcAllowed / 2);
    expectDollars(half.repayment, full.repayment / 2);
  });

  test('F5: Morkel at $56,000 (357%) → PTC 3,782, repayment 3,512', () => {
    const r = reconcile(MORKEL_RECONCILE, TY2026);
    expect(r.fplPercent).toBe(357);
    expectDollars(r.ptcAllowed, 3_782);
    expectDollars(r.repayment, 3_512);
  });

  test('F6: Morkel at $63,000, over the $62,600 cliff → repays the full $7,294', () => {
    const r = reconcile({ ...MORKEL_RECONCILE, magi: 63_000 }, TY2026);
    expect(r.cliff).toBe(62_600);
    expect(r.overCliff).toBe(true);
    expect(r.ptcAllowed).toBe(0);
    expectDollars(r.repayment, 7_294);
  });

  test('F7: KFF family at $105,000 with 2024 FPL and the TY2026 cliff → repays the full $34,463', () => {
    const r = reconcile(KFF_RECONCILE, { ...TY2026, fpl: FPL_2024 });
    expect(r.cliff).toBe(103_280);
    expect(r.overCliff).toBe(true);
    expectDollars(r.repayment, 34_463);
  });
});

describe('reconcile (test-only TY2025_ENHANCED: no cliff, capped repayment)', () => {
  test('F6: Morkel at $63,000 (418%) pays 8.5% → repayment 3,289, no cap at ≥ 400%', () => {
    const r = reconcile({ ...MORKEL_RECONCILE, magi: 63_000 }, TY2025_ENHANCED);
    expect(r.cliff).toBeNull();
    expect(r.overCliff).toBe(false);
    expect(r.fplPercent).toBe(418);
    expectDollars(r.repayment, 3_289);
  });

  test('F7: KFF family at $105,000 → 406% (truncated), 8.5%, PTC 33,718, repayment 745', () => {
    const r = reconcile(KFF_RECONCILE, TY2025_ENHANCED);
    expect(r.fpl).toBe(25_820);
    expect(r.fplPercent).toBe(406);
    expect(r.applicableFigure).toBe(0.085);
    expectDollars(r.ptcAllowed, 33_718);
    expectDollars(r.repayment, 745);
  });

  test('caps apply by FPL band and filing status: 371% single → $1,625, joint → uncapped $2,291', () => {
    // 2024 FPL: 56,000 / 15,060 → 371% → 0.0778 → contribution 4,357 → PTC 5,003; excess 2,291.
    const single = reconcile(MORKEL_RECONCILE, TY2025_ENHANCED);
    const joint = reconcile({ ...MORKEL_RECONCILE, filingStatus: 'mfj' }, TY2025_ENHANCED);
    expect(single.fplPercent).toBe(371);
    expect(single.repayment).toBe(1_625);
    expectDollars(joint.repayment, 2_291);
  });
});
