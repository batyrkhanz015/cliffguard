import { describe, expect, it } from 'vitest';
import { diagnose } from '@/engine';
import { DANI, DANI_AS_OF } from '@/samples/dani';
import { cliffCurve } from '../cliffCurve';

const diagnosis = diagnose(DANI, { gig: null, asOf: DANI_AS_OF });

describe('cliffCurve', () => {
  const curve = cliffCurve(DANI, diagnosis, [diagnosis.income.magi]);

  it('is sorted by MAGI with the cliff and the dollar above it', () => {
    const magis = curve.map((point) => point.magi);
    expect(magis).toEqual([...magis].sort((a, b) => a - b));
    expect(magis).toContain(diagnosis.cliff);
    expect(magis).toContain(diagnosis.cliff + 1);
  });

  it('jumps to the whole advance credit in one dollar at the cliff', () => {
    const at = (magi: number) => curve.find((point) => point.magi === magi)?.repayment;
    expect(at(diagnosis.cliff + 1)).toBe(diagnosis.aptcReceived);
    expect(at(diagnosis.cliff)).toBeLessThan(diagnosis.aptcReceived);
  });

  it('covers the household and the cliff with a margin on both sides', () => {
    expect(curve[0].magi).toBeLessThan(diagnosis.income.magi);
    expect(curve.at(-1)?.magi).toBeGreaterThanOrEqual(diagnosis.cliff + 20_000);
  });

  it('widens to keep a marked point beyond the cliff on the curve', () => {
    const far = diagnosis.cliff + 40_000;
    expect(cliffCurve(DANI, diagnosis, [far]).at(-1)?.magi).toBeGreaterThanOrEqual(far);
  });
});
