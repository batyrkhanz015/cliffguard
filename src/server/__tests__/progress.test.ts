import { describe, expect, it } from 'vitest';
import { DANI } from '@/samples/dani';
import { replaceInput } from '../household';
import { applyProgress, ProgressChangeSchema } from '../progress';

const NOW = '2026-11-14T15:00:00.000Z';
const LATER = '2026-11-20T15:00:00.000Z';
const record = replaceInput(null, { sid: crypto.randomUUID(), source: 'manual', input: DANI, now: NOW });

describe('ProgressChangeSchema', () => {
  it("accepts proof indexes within the lever's proof list", () => {
    expect(ProgressChangeSchema.safeParse({ leverId: 'invoiceTiming', proofsChecked: [0, 2] }).success).toBe(true);
  });

  it('refuses a proof index past the list, a repeated index and an unknown lever', () => {
    expect(ProgressChangeSchema.safeParse({ leverId: 'delayStockSale', proofsChecked: [1] }).success).toBe(false);
    expect(ProgressChangeSchema.safeParse({ leverId: 'hsa', proofsChecked: [0, 0] }).success).toBe(false);
    expect(ProgressChangeSchema.safeParse({ leverId: 'rothIra', done: true }).success).toBe(false);
  });
});

describe('applyProgress', () => {
  it('marks a move done with the time, and keeps that time while it stays done', () => {
    const done = applyProgress(record, { leverId: 'hsa', done: true }, NOW);
    expect(done.planProgress.hsa).toEqual({ done: true, doneAt: NOW, proofsChecked: [] });
    const proofs = applyProgress(done, { leverId: 'hsa', proofsChecked: [1, 0] }, LATER);
    expect(proofs.planProgress.hsa).toEqual({ done: true, doneAt: NOW, proofsChecked: [0, 1] });
  });

  it('clears the time when a move is unmarked and leaves other moves alone', () => {
    const hsaDone = applyProgress(record, { leverId: 'hsa', done: true }, NOW);
    const both = applyProgress(hsaDone, { leverId: 'invoiceTiming', done: true }, NOW);
    const undone = applyProgress(both, { leverId: 'hsa', done: false }, LATER);
    expect(undone.planProgress.hsa).toMatchObject({ done: false, doneAt: undefined });
    expect(undone.planProgress.invoiceTiming).toEqual(both.planProgress.invoiceTiming);
    expect(undone.updatedAt).toBe(LATER);
  });
});
