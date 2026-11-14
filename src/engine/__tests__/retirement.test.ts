import { describe, expect, test } from 'vitest';
import { iraDeductibleLimit, sepLimit } from '../retirement';
import { TY2026 } from '../rules/ty2026';
import { expectDollars } from './fixtures';

const { ira, sep } = TY2026;
const SINGLE_COVERED = ira.phaseOut.singleOrHohCovered;
const MFJ_COVERED = ira.phaseOut.mfjContributorCovered;

describe('iraDeductibleLimit (Pub 590-A phase-out)', () => {
  test('a covered single filer with IRA MAGI of $86,000 can deduct $3,750', () => {
    expect(iraDeductibleLimit(86_000, SINGLE_COVERED, ira)).toBe(3_750);
  });

  test('the full $7,500 with no phase-out range (nobody covered)', () => {
    expect(iraDeductibleLimit(500_000, null, ira)).toBe(7_500);
  });

  test('the full limit at or below the bottom of the range', () => {
    expect(iraDeductibleLimit(81_000, SINGLE_COVERED, ira)).toBe(7_500);
  });

  test('zero at or above the top of the range', () => {
    expect(iraDeductibleLimit(91_000, SINGLE_COVERED, ira)).toBe(0);
    expect(iraDeductibleLimit(95_000, SINGLE_COVERED, ira)).toBe(0);
  });

  test('rounds up to the next $10', () => {
    // 7,500 × (149,000 − 139,001) / 20,000 = 3,749.625 → 3,750
    expect(iraDeductibleLimit(139_001, MFJ_COVERED, ira)).toBe(3_750);
  });

  test('at least $200 while not fully phased out', () => {
    // 7,500 × (91,000 − 90,900) / 10,000 = 75 → 200
    expect(iraDeductibleLimit(90_900, SINGLE_COVERED, ira)).toBe(200);
  });
});

describe('sepLimit (Pub 560, self-employed)', () => {
  test('F4: 20% of SE profit minus half SE tax (Dani with the gig: $19,238)', () => {
    // 103,500 SE profit; half SE tax = 103,500 × 0.9235 × 0.153 / 2
    const halfSeTax = (103_500 * 0.9235 * 0.153) / 2;
    expectDollars(sepLimit(103_500 - halfSeTax, sep), 19_238);
  });

  test('capped at $72,000', () => {
    expect(sepLimit(1_000_000, sep)).toBe(72_000);
  });

  test('zero for a loss', () => {
    expect(sepLimit(-2_000, sep)).toBe(0);
  });
});
