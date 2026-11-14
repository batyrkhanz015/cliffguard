import { expect } from 'vitest';

/** Spec §B: dollar fixtures pass within ±$1 unless a row says otherwise. */
export function expectDollars(actual: number, expected: number, tolerance = 1): void {
  const message = `${actual} vs expected ${expected} ±${tolerance}`;
  expect(Math.abs(actual - expected), message).toBeLessThanOrEqual(tolerance);
}

/** F1 values covered by the Task 1 functions (Dani, where you stand). */
export const F1 = {
  fpl: 32_150,
  cliff: 128_600,
  halfSeTax: 6_464,
  agi: 121_536,
  magi: 122_036,
  fplPercent: 379,
  applicableFigure: 0.0996,
} as const;
