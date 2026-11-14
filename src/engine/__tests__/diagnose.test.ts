import { describe, expect, test } from 'vitest';
import { DANI, DANI_AS_OF } from '@/samples/dani';
import { diagnose } from '../diagnose';
import * as engine from '../index';
import { reconcile } from '../reconcile';
import { TY2025_ENHANCED } from '../rules/ty2025-enhanced';
import { TY2026 } from '../rules/ty2026';
import { ZERO_LEVERS, type HouseholdInput, type Scenario } from '../types';
import { DANI_RECONCILE, expectDollars, F1 } from './fixtures';

const WHERE_YOU_STAND: Scenario = { gig: null, asOf: DANI_AS_OF };

/** Dani with this much more (or, if negative, less) interest income: MAGI moves 1:1. */
const daniPlus = (interestOrDividends: number): Scenario => ({ ...WHERE_YOU_STAND, extra: { interestOrDividends } });

const daniAt = (magi: number) => reconcile({ ...DANI_RECONCILE, magi }, TY2026);

function withMarketplace(changes: Partial<HouseholdInput['marketplace']>, base: HouseholdInput = DANI): HouseholdInput {
  return { ...base, marketplace: { ...base.marketplace, ...changes } };
}

/** A single W-2 filer whose MAGI equals their wages, with a manual $9,600 benchmark. */
function w2Single(wages: number): HouseholdInput {
  return {
    ...DANI,
    filingStatus: 'single',
    householdSize: 1,
    adults: [
      { ...DANI.adults[0], selfEmploymentProfit: { ytd: 0, expectedRest: 0 }, wages: { ytd: wages, expectedRest: 0 } },
    ],
    investments: { ...DANI.investments, taxableInterest: 0, taxExemptInterest: 0, dividends: 0 },
    marketplace: { ...DANI.marketplace, incomeEstimate: wages, aptcMonthly: 300, slcspAnnualOverride: 9_600 },
  };
}

describe('diagnose', () => {
  test('F1: Dani, where you stand', () => {
    const d = diagnose(DANI, WHERE_YOU_STAND);
    expect(d.rulesId).toBe(TY2026.id);
    expect(d.asOf).toBe(DANI_AS_OF);
    expect(d.fpl).toBe(F1.fpl);
    expect(d.cliff).toBe(F1.cliff);
    expectDollars(d.income.halfSeTax, F1.halfSeTax);
    expectDollars(d.income.agi, F1.agi);
    expectDollars(d.income.magi, F1.magi);
    expect(d.fplPercent).toBe(F1.fplPercent);
    expect(d.overCliff).toBe(false);
    expect(d.applicableFigure).toBe(F1.applicableFigure);
    expect(d.slcsp.source).toBe('derived');
    expectDollars(d.slcsp.annual, F1.slcsp);
    expectDollars(d.aptcReceived, F1.aptcReceived);
    expectDollars(d.ptcAllowed, F1.ptcAllowed);
    expectDollars(d.repayment, F1.repayment);
    expect(d.refund).toBe(0);
    expectDollars(d.headroom, F1.headroom);
    expect(d.zone).toBe('near');
    expect(d.reportChange.recommended).toBe(true);
    expectDollars(d.reportChange.incomeToReport, F1.magi);
    expect(d.daysToYearEnd).toBe(F1.daysToYearEnd);
  });

  test('F8: far over the cliff (MAGI 250,036) → repays all 9,342 of the advance credit', () => {
    const farOver = { ...DANI, investments: { ...DANI.investments, otherIncome: 128_000 } };
    const d = diagnose(farOver, WHERE_YOU_STAND);
    expectDollars(d.income.magi, 250_036);
    expect(d.overCliff).toBe(true);
    expect(d.zone).toBe('over');
    expect(d.ptcAllowed).toBe(0);
    expectDollars(d.repayment, 9_342);
    expectDollars(d.headroom, 128_600 - 250_036);
  });

  test('passes SLCSP guard failures through (F12)', () => {
    expect(() => diagnose(withMarketplace({ tookFullCredit: false }), WHERE_YOU_STAND)).toThrow(
      expect.objectContaining({ code: 'SLCSP_REQUIRED' }),
    );
  });

  test('needs a rule set with a cliff', () => {
    expect(() => diagnose(DANI, WHERE_YOU_STAND, TY2025_ENHANCED)).toThrow(/cliff/);
  });

  test('levers lower MAGI and the repayment', () => {
    const before = diagnose(DANI, WHERE_YOU_STAND);
    const after = diagnose(DANI, WHERE_YOU_STAND, TY2026, { ...ZERO_LEVERS, hsa: 5_000 });
    expectDollars(after.income.magi, before.income.magi - 5_000);
    expectDollars(after.repayment, before.repayment - 498);
  });

  test('is deterministic', () => {
    expect(diagnose(DANI, WHERE_YOU_STAND)).toEqual(diagnose(DANI, WHERE_YOU_STAND));
  });
});

describe('diagnose: per1000', () => {
  test('Dani at F1: the extra repayment for $1,000 more MAGI (≈ 1000 × 9.96%)', () => {
    const d = diagnose(DANI, WHERE_YOU_STAND);
    expect(d.per1000).toBe(daniAt(d.income.magi + 1_000).repayment - daniAt(d.income.magi).repayment);
    expectDollars(d.per1000, 99.6);
    expect(d.flags).not.toContain('NEAR_CLIFF_STEP');
  });

  test('at 275% FPL it includes the rising applicable figure: ≈ $176, not 1000 × 9.2%', () => {
    // W-2 family of 4 at MAGI 88,500 (275%) that owes at filing: benchmark 19,800, credit $1,000/mo.
    const family: HouseholdInput = {
      ...w2Single(88_500),
      filingStatus: 'mfj',
      householdSize: 4,
      marketplace: { ...DANI.marketplace, aptcMonthly: 1_000, slcspAnnualOverride: 19_800 },
    };
    const d = diagnose(family, WHERE_YOU_STAND);
    const at = (magi: number) => reconcile({ ...DANI_RECONCILE, magi, aptcMonthly: 1_000 }, TY2026).repayment;
    expect(d.fplPercent).toBe(275);
    expect(d.per1000).toBe(at(89_500) - at(88_500));
    expectDollars(d.per1000, 176, 5);
  });

  test('a household due a refund loses the same credit: its refund shrinks', () => {
    const d = diagnose(DANI, daniPlus(-20_000));
    const now = daniAt(d.income.magi);
    expect(now.refund).toBeGreaterThan(0);
    expect(d.per1000).toBe(now.refund - daniAt(d.income.magi + 1_000).refund);
    expectDollars(d.per1000, 99.6);
  });

  test('when $1,000 more would cross the cliff, uses the last $1,000 below it (NEAR_CLIFF_STEP)', () => {
    const d = diagnose(DANI, daniPlus(6_000));
    expectDollars(d.income.magi, 128_036);
    expect(d.per1000).toBe(daniAt(F1.cliff).repayment - daniAt(F1.cliff - 1_000).repayment);
    expectDollars(d.per1000, 100);
    expect(d.flags).toContain('NEAR_CLIFF_STEP');
  });

  test('over the cliff, $1,000 more changes nothing', () => {
    const d = diagnose(DANI, daniPlus(10_000));
    expect(d.overCliff).toBe(true);
    expect(d.per1000).toBe(0);
    expect(d.flags).not.toContain('NEAR_CLIFF_STEP');
  });
});

describe('diagnose: zone', () => {
  test('clear when headroom is more than 10% of the cliff', () => {
    const d = diagnose(DANI, daniPlus(-10_000));
    expectDollars(d.headroom, 16_564);
    expect(d.zone).toBe('clear');
  });

  test('near includes exactly 10% of the cliff (single cliff 62,600 → 6,260)', () => {
    expect(diagnose(w2Single(56_340), WHERE_YOU_STAND).zone).toBe('near');
    expect(diagnose(w2Single(56_339), WHERE_YOU_STAND).zone).toBe('clear');
  });

  test('near includes income exactly at the cliff; one dollar over is over', () => {
    const atCliff = diagnose(w2Single(62_600), WHERE_YOU_STAND);
    expect(atCliff.headroom).toBe(0);
    expect(atCliff.zone).toBe('near');
    expect(diagnose(w2Single(62_601), WHERE_YOU_STAND).zone).toBe('over');
  });

  test('below_100 under 100% FPL, computed with the bottom rate and flagged', () => {
    const d = diagnose(w2Single(12_000), WHERE_YOU_STAND);
    expect(d.fplPercent).toBe(76);
    expect(d.applicableFigure).toBe(0.021);
    expect(d.zone).toBe('below_100');
    expect(d.flags).toContain('BELOW_100_FPL');
  });
});

describe('diagnose: report change (spec §A.8)', () => {
  test('reports MAGI before plan moves, so levers never shrink the number', () => {
    const d = diagnose(DANI, WHERE_YOU_STAND, TY2026, { ...ZERO_LEVERS, hsa: 5_000 });
    expectDollars(d.income.magi, F1.magi - 5_000);
    expectDollars(d.reportChange.incomeToReport, F1.magi);
  });

  test.each([
    ['2026-11-30', true],
    ['2026-12-01', false],
  ])('asOf %s → recommended %s (report before December 1)', (asOf, recommended) => {
    expect(diagnose(DANI, { ...WHERE_YOU_STAND, asOf }).reportChange.recommended).toBe(recommended);
  });

  test.each([
    ['5% of the estimate binds', 116_000, true],
    ['5% of the estimate binds', 117_000, false],
  ])('%s: Dani (MAGI 122,036) with estimate %i → recommended %s', (_rule, incomeEstimate, recommended) => {
    const input = withMarketplace({ incomeEstimate, slcspAnnualOverride: F1.slcsp });
    expect(diagnose(input, WHERE_YOU_STAND).reportChange.recommended).toBe(recommended);
  });

  test.each([
    ['the $2,500 floor binds', 27_000, true],
    ['the $2,500 floor binds', 28_000, false],
  ])('%s: MAGI 30,000 with estimate %i → recommended %s', (_rule, incomeEstimate, recommended) => {
    const input = withMarketplace({ incomeEstimate }, w2Single(30_000));
    expect(diagnose(input, WHERE_YOU_STAND).reportChange.recommended).toBe(recommended);
  });
});

describe('diagnose: daysToYearEnd', () => {
  test.each([
    [DANI_AS_OF, 47],
    ['2026-12-31', 0],
    ['2027-02-01', 0],
  ])('asOf %s → %i', (asOf, days) => {
    expect(diagnose(DANI, { ...WHERE_YOU_STAND, asOf }).daysToYearEnd).toBe(days);
  });
});

describe('diagnose: flags', () => {
  test('Dani has only the self-employed health insurance caveat', () => {
    expect(diagnose(DANI, WHERE_YOU_STAND).flags).toEqual(['SEHI_DEDUCTION_EXCLUDED']);
  });

  test('SBM_STATE for a state-based exchange (CA)', () => {
    expect(diagnose({ ...DANI, state: 'CA' }, WHERE_YOU_STAND).flags).toContain('SBM_STATE');
  });

  test('NO_APTC when no advance credit was paid: nothing to repay', () => {
    const d = diagnose(withMarketplace({ aptcMonthly: 0 }), WHERE_YOU_STAND);
    expect(d.flags).toContain('NO_APTC');
    expect(d.repayment).toBe(0);
  });

  test('PARTIAL_YEAR when the credit was paid for 6 months', () => {
    const d = diagnose(withMarketplace({ monthsWithAptc: 6 }), WHERE_YOU_STAND);
    expect(d.flags).toContain('PARTIAL_YEAR');
    expectDollars(d.aptcReceived, 4_671);
  });

  test('CATASTROPHIC_NO_PTC: a catastrophic plan earns no credit, so nothing to repay', () => {
    const d = diagnose(withMarketplace({ planMetal: 'catastrophic' }), WHERE_YOU_STAND);
    expect(d.flags).toContain('CATASTROPHIC_NO_PTC');
    expect(d.repayment).toBe(0);
    expect(d.refund).toBe(0);
    expect(d.ptcAllowed).toBe(0);
    expect(d.aptcReceived).toBe(0);
  });

  test('CAPITAL_LOSS_LIMITED when a net capital loss hits the $3,000 limit', () => {
    const losses = { ...DANI, investments: { ...DANI.investments, capitalGainsNet: -10_000 } };
    expect(diagnose(losses, WHERE_YOU_STAND).flags).toContain('CAPITAL_LOSS_LIMITED');
  });

  test('no self-employed health insurance caveat without SE income', () => {
    expect(diagnose(w2Single(40_000), WHERE_YOU_STAND).flags).toEqual([]);
  });
});

describe('engine index', () => {
  test('exports the public API and not the test-only rule set', () => {
    expect(engine.diagnose).toBe(diagnose);
    expect(engine.reconcile).toBe(reconcile);
    expect(engine.TY2026).toBe(TY2026);
    expect('TY2025_ENHANCED' in engine).toBe(false);
  });
});
