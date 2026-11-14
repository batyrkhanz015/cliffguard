import { describe, expect, test } from 'vitest';
import { applicableFigure } from '../applicable';
import { cliffAmount, fplPercent, povertyLine } from '../fpl';
import { TY2025_ENHANCED } from '../rules/ty2025-enhanced';
import { TY2026 } from '../rules/ty2026';
import { F1 } from './fixtures';

describe('povertyLine and cliffAmount (2025 guidelines for 2026 coverage)', () => {
  test('F1: Texas family of 4', () => {
    expect(povertyLine('TX', 4, TY2026)).toBe(F1.fpl);
    expect(cliffAmount('TX', 4, TY2026)).toBe(F1.cliff);
  });

  test.each([
    [1, 62_600],
    [3, 106_600],
  ])('48-state household of %i → cliff %i', (size, cliff) => {
    expect(cliffAmount('CA', size, TY2026)).toBe(cliff);
  });

  test('Hawaii family of 4 uses the Hawaii table', () => {
    expect(povertyLine('HI', 4, TY2026)).toBe(36_980);
    expect(cliffAmount('HI', 4, TY2026)).toBe(147_920);
  });

  test('Alaska family of 4 uses the Alaska table', () => {
    expect(povertyLine('AK', 4, TY2026)).toBe(40_190);
    expect(cliffAmount('AK', 4, TY2026)).toBe(160_760);
  });

  test('households above 8 add the per-person step (Form 8962 example: 11 → 70,650)', () => {
    expect(povertyLine('OH', 11, TY2026)).toBe(70_650);
  });

  test('2027 cliff for a family of 4 uses the 2026 guidelines', () => {
    const nextYear = { ...TY2026, fpl: TY2026.nextYear.fpl };
    expect(cliffAmount('TX', 4, nextYear)).toBe(132_000);
    expect(cliffAmount('AK', 4, nextYear)).toBe(165_000);
    expect(cliffAmount('HI', 4, nextYear)).toBe(151_800);
  });

  test('rules without a cliff have no cliff amount', () => {
    expect(cliffAmount('TX', 4, TY2025_ENHANCED)).toBeNull();
  });
});

describe('fplPercent (Form 8962 line 5)', () => {
  const fpl = F1.fpl;

  test('F11: truncates, never rounds (3.997 × FPL → 399)', () => {
    expect(fplPercent(3.997 * fpl, fpl, TY2026)).toBe(399);
  });

  test('F1: Dani MAGI → 379', () => {
    expect(fplPercent(F1.magi, fpl, TY2026)).toBe(F1.fplPercent);
  });

  test('income exactly at the cliff is 400, eligible', () => {
    expect(fplPercent(F1.cliff, fpl, TY2026)).toBe(400);
  });

  test('one dollar over the cliff is 401', () => {
    expect(fplPercent(F1.cliff + 1, fpl, TY2026)).toBe(401);
  });

  test('household income is rounded to whole dollars before the cliff test', () => {
    expect(fplPercent(F1.cliff + 0.4, fpl, TY2026)).toBe(400);
    expect(fplPercent(F1.cliff + 0.5, fpl, TY2026)).toBe(401);
  });

  test('negative household income counts as 0 (line 3)', () => {
    expect(fplPercent(-5_000, fpl, TY2026)).toBe(0);
  });

  test('without a cliff, percentages above 400 are kept (F7: 105,000 / 25,820 → 406)', () => {
    expect(fplPercent(105_000, 25_820, TY2025_ENHANCED)).toBe(406);
  });
});

describe('applicableFigure (TY2026, Rev. Proc. 2025-25)', () => {
  test.each([
    [100, 0.021],
    [132, 0.021],
    [133, 0.0314],
    [149, 0.0413],
    [150, 0.0419],
    [175, 0.054],
    [200, 0.066],
    [225, 0.0752],
    [250, 0.0844],
    [275, 0.092],
    [300, 0.0996],
    [400, 0.0996],
  ])('F11 %i%% → %d', (pct, figure) => {
    expect(applicableFigure(pct, TY2026)).toBe(figure);
  });

  test('F11 401 → null (no credit above the cliff)', () => {
    expect(applicableFigure(401, TY2026)).toBeNull();
  });

  test('F1: Dani at 379% → 0.0996', () => {
    expect(applicableFigure(F1.fplPercent, TY2026)).toBe(F1.applicableFigure);
  });

  test('below 100% uses the bottom-band rate', () => {
    expect(applicableFigure(0, TY2026)).toBe(0.021);
    expect(applicableFigure(99, TY2026)).toBe(0.021);
  });

  // IRS 2026 Form 8962 instructions, Table 2 (research/tax-tables-2026.md §2c).
  test.each([
    [132, 0.021],
    [133, 0.0314],
    [136, 0.0333],
    [142, 0.037],
    [150, 0.0419],
    [160, 0.0467],
    [175, 0.054],
    [200, 0.066],
    [202, 0.0667],
    [229, 0.0767],
    [250, 0.0844],
    [263, 0.0884],
    [288, 0.096],
    [299, 0.0993],
    [300, 0.0996],
    [350, 0.0996],
    [400, 0.0996],
  ])('IRS Table 2: line 5 = %i → %d', (pct, figure) => {
    expect(applicableFigure(pct, TY2026)).toBe(figure);
  });
});

describe('applicableFigure (test-only TY2025_ENHANCED)', () => {
  test('F7: 387% → 0.0818 (exact half rounds up)', () => {
    expect(applicableFigure(387, TY2025_ENHANCED)).toBe(0.0818);
  });

  test('no cliff: above 400% pays the flat 8.5%', () => {
    expect(applicableFigure(406, TY2025_ENHANCED)).toBe(0.085);
  });

  test('below 150% pays nothing', () => {
    expect(applicableFigure(149, TY2025_ENHANCED)).toBe(0);
  });
});
