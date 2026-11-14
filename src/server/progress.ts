import 'server-only';
import { z } from 'zod';
import { LeverIdSchema } from '@/engine';
import { LEVER_COPY } from '@/engine/server';
import type { HouseholdRecord } from './household';

/** `PATCH /api/plan/progress` body (spec §D): a move marked done, or its proof checklist. */
export const ProgressChangeSchema = z
  .object({
    leverId: LeverIdSchema,
    done: z.boolean().optional(),
    /** Indexes into the lever's proof list. */
    proofsChecked: z.array(z.number().int().min(0)).optional(),
  })
  .superRefine(({ leverId, proofsChecked }, ctx) => {
    if (proofsChecked === undefined) return;
    const proofCount = LEVER_COPY[leverId].proof.length;
    if (proofsChecked.some((index) => index >= proofCount)) {
      const proofs = proofCount === 1 ? '1 proof' : `${proofCount} proofs`;
      ctx.addIssue({ code: 'custom', path: ['proofsChecked'], message: `This move has ${proofs}` });
    }
    if (new Set(proofsChecked).size !== proofsChecked.length) {
      ctx.addIssue({ code: 'custom', path: ['proofsChecked'], message: 'A proof is listed twice' });
    }
  });
export type ProgressChange = z.infer<typeof ProgressChangeSchema>;

/** The record with one move's progress updated; fields the change leaves out keep their value. */
export function applyProgress(record: HouseholdRecord, change: ProgressChange, now: string): HouseholdRecord {
  const current = record.planProgress[change.leverId];
  const done = change.done ?? current?.done ?? false;
  const doneAt = done ? (current?.done ? current.doneAt : now) : undefined;
  const proofsChecked = [...(change.proofsChecked ?? current?.proofsChecked ?? [])].sort((a, b) => a - b);
  return {
    ...record,
    updatedAt: now,
    planProgress: { ...record.planProgress, [change.leverId]: { done, doneAt, proofsChecked } },
  };
}
