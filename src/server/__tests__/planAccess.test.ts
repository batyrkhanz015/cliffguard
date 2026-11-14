import { describe, expect, it } from 'vitest';
import { DANI, DANI_AS_OF, DANI_GIG } from '@/samples/dani';
import { planAccess, planExport } from '../planAccess';
import { replaceInput } from '../household';

const record = () => ({ ...replaceInput(null, { sid: crypto.randomUUID(), input: DANI, source: 'sample_dani', now: `${DANI_AS_OF}T12:00:00.000Z` }), lastGig: DANI_GIG });

describe('saved plan details and preparer export', () => {
  it('applies the proposed moves to Form 8962 without using hardcoded sample results', () => {
    const { plan, before, after } = planExport(record(), DANI_AS_OF);
    expect(plan.moves.length).toBeGreaterThan(0);
    expect(before.income.magi).toBeCloseTo(plan.magiBefore, 6);
    expect(after.income.magi).toBeCloseTo(plan.magiAfter, 6);
    expect(after.repayment).toBe(plan.repaymentAfter);
    expect(before.repayment).toBe(plan.repaymentBefore);
  });
  it('recomputes from changed saved preferences and gig, including retirement and per-adult IRA', () => {
    const saved = record();
    saved.input = { ...saved.input, preferences: { keepMyCash: false, leverOrder: ['sepIra', 'traditionalIra', 'invoiceTiming', 'hsa'] } };
    const first = planExport(saved, DANI_AS_OF);
    expect(first.plan.moves.some((move) => move.leverId === 'sepIra')).toBe(true);
    expect(first.after.income.magi).toBeCloseTo(first.plan.magiAfter, 6);
    saved.input = { ...saved.input, preferences: { keepMyCash: false, leverOrder: ['traditionalIra', 'invoiceTiming', 'hsa'] } };
    const ira = planExport(saved, DANI_AS_OF);
    expect(ira.plan.moves.some((move) => move.leverId === 'traditionalIra')).toBe(true);
    expect(ira.after.income.magi).toBeCloseTo(ira.plan.magiAfter, 6);
    saved.lastGig = { amount: 8_000, canBillInJanuary: false };
    const updated = planExport(saved, DANI_AS_OF);
    expect(updated.before.income.magi).not.toBe(first.before.income.magi);
    expect(planAccess(saved, DANI_AS_OF).plan.magiBefore).toBe(updated.plan.magiBefore);
  });
});
