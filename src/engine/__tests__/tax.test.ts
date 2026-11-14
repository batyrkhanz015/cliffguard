import { describe, expect, test } from 'vitest';
import { TY2026 } from '../rules/ty2026';
import { federalTax, incomeTaxSaved, marginalRate, taxableIncome } from '../tax';
import { expectDollars, F1, F3 } from './fixtures';

/** Dani's AGI is MAGI minus $500 of tax-exempt interest. */
const DANI_AGI = F1.agi;
const DANI_AGI_WITH_GIG = F3.magiWithGig - 500;

describe('taxableIncome', () => {
  test('AGI minus the standard deduction for the filing status', () => {
    expect(taxableIncome(100_000, 'mfj', TY2026)).toBe(67_800);
    expect(taxableIncome(100_000, 'single', TY2026)).toBe(83_900);
    expect(taxableIncome(100_000, 'hoh', TY2026)).toBe(75_850);
  });

  test('never negative', () => {
    expect(taxableIncome(10_000, 'mfj', TY2026)).toBe(0);
  });
});

describe('federalTax', () => {
  test('progressive brackets: each slice taxed at its own rate (mfj)', () => {
    // 10% × 24,800 + 12% × (100,488 − 24,800)
    expectDollars(federalTax(100_488, 'mfj', TY2026), 2_480 + 9_082.56, 0.01);
  });

  test('single filer across three brackets', () => {
    // 10% × 12,400 + 12% × 38,000 + 22% × 9,600
    expectDollars(federalTax(60_000, 'single', TY2026), 1_240 + 4_560 + 2_112, 0.01);
  });

  test('head of household uses its own brackets', () => {
    // 10% × 17,700 + 12% × 12,300
    expectDollars(federalTax(30_000, 'hoh', TY2026), 1_770 + 1_476, 0.01);
  });

  test('top bracket has no upper bound', () => {
    const atTop = federalTax(768_700, 'mfj', TY2026);
    expectDollars(federalTax(868_700, 'mfj', TY2026) - atTop, 37_000, 0.01);
  });

  test('zero for zero or negative taxable income', () => {
    expect(federalTax(0, 'single', TY2026)).toBe(0);
    expect(federalTax(-5_000, 'single', TY2026)).toBe(0);
  });

  test('F3: the $12k gig adds $1,338 of income tax for Dani (12% bracket)', () => {
    const withGig = federalTax(taxableIncome(DANI_AGI_WITH_GIG, 'mfj', TY2026), 'mfj', TY2026);
    const without = federalTax(taxableIncome(DANI_AGI, 'mfj', TY2026), 'mfj', TY2026);
    expectDollars(withGig - without, 1_338);
  });
});

describe('marginalRate', () => {
  test('F3: Dani with the gig is in the 12% bracket', () => {
    expect(marginalRate(taxableIncome(DANI_AGI_WITH_GIG, 'mfj', TY2026), 'mfj', TY2026)).toBe(0.12);
  });

  test('the next dollar at a bracket edge is taxed at the higher rate', () => {
    expect(marginalRate(100_799, 'mfj', TY2026)).toBe(0.12);
    expect(marginalRate(100_800, 'mfj', TY2026)).toBe(0.22);
  });

  test('10% at zero, 37% at the top', () => {
    expect(marginalRate(0, 'single', TY2026)).toBe(0.1);
    expect(marginalRate(1_000_000, 'single', TY2026)).toBe(0.37);
  });
});

describe('incomeTaxSaved', () => {
  test('F4: a $5,590 SEP saves $671 at 12%', () => {
    expectDollars(incomeTaxSaved(DANI_AGI_WITH_GIG, F3.oneToOneMove, 'mfj', TY2026), F3.sepIncomeTaxSaved);
  });

  test('F3: a $1,130 HSA deposit saves about $136', () => {
    expectDollars(incomeTaxSaved(DANI_AGI_WITH_GIG, F3.hsa, 'mfj', TY2026), 135.6, 0.01);
  });

  test('a deduction that spans a bracket edge saves at both rates', () => {
    // single taxable 52,000 → 47,000: 1,600 at 22% + 3,400 at 12%
    const agi = 52_000 + TY2026.standardDeduction.single;
    expectDollars(incomeTaxSaved(agi, 5_000, 'single', TY2026), 352 + 408, 0.01);
  });

  test('saves nothing below the standard deduction', () => {
    expect(incomeTaxSaved(20_000, 5_000, 'mfj', TY2026)).toBe(0);
  });

  test('zero deductions save nothing', () => {
    expect(incomeTaxSaved(DANI_AGI_WITH_GIG, 0, 'mfj', TY2026)).toBe(0);
  });
});
