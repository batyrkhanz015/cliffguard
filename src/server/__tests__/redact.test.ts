import { describe, expect, it } from 'vitest';
import { gigCheck, LEVER_COPY, optimize } from '@/engine/server';
import { DANI, DANI_AS_OF, DANI_GIG } from '@/samples/dani';
import { replaceInput } from '../household';
import { gigCheckView, householdView, redactPlan, unlockPlan } from '../redact';

const plan = optimize(DANI, { gig: DANI_GIG, asOf: DANI_AS_OF });

describe('redactPlan', () => {
  it('starts from a plan with moves', () => {
    expect(plan.moves.length).toBeGreaterThan(0);
  });

  it('nulls each amount, MAGI reduction, how-to and proof, and locks the move', () => {
    for (const move of redactPlan(plan).moves) {
      expect(move).toMatchObject({ amount: null, magiReduction: null, howTo: null, proof: null, locked: true });
    }
  });

  it('keeps the totals, verdict and each move lever, name and deadline', () => {
    const summary = redactPlan(plan);
    expect(summary.totals).toEqual(plan.totals);
    expect(summary.verdict).toBe(plan.verdict);
    expect(summary.moves.map(({ leverId, name, deadline }) => ({ leverId, name, deadline }))).toEqual(
      plan.moves.map(({ leverId, deadline }) => ({ leverId, name: LEVER_COPY[leverId].name, deadline })),
    );
  });

  it('leaves the plan it redacts unchanged', () => {
    const before = structuredClone(plan);
    redactPlan(plan);
    expect(plan).toEqual(before);
  });
});

describe('unlockPlan', () => {
  it('keeps every amount and adds the lever name', () => {
    const unlocked = unlockPlan(plan);
    expect(unlocked.moves).toEqual(
      plan.moves.map((move) => ({ ...move, name: LEVER_COPY[move.leverId].name, locked: false })),
    );
  });
});

describe('householdView', () => {
  it('omits private identity and exposes a non-secret household scope', () => {
    const record = replaceInput(null, {
      sid: crypto.randomUUID(),
      source: 'manual',
      input: DANI,
      now: '2026-11-14T15:00:00.000Z',
    });
    const view = householdView(record);
    expect(view).not.toHaveProperty('sid');
    expect(view).not.toHaveProperty('checkinIdentity');
    const { checkinIdentity, ...publicRecord } = record;
    expect({ ...view, sid: record.sid }).toStrictEqual({ ...publicRecord, householdScope: checkinIdentity });
  });
});

describe('gigCheckView', () => {
  const gig = gigCheck(DANI, DANI_GIG, DANI_AS_OF);

  it('locks the plan moves when not entitled and keeps the rest of the gig check', () => {
    const view = gigCheckView(gig, false);
    expect(view.plan.moves.every((move) => move.locked && move.amount === null)).toBe(true);
    expect(view.options).toEqual(gig.options);
    expect(view.curve).toEqual(gig.curve);
  });

  it('shows the plan amounts when entitled', () => {
    const view = gigCheckView(gig, true);
    expect(view.plan.moves.map((move) => move.amount)).toEqual(gig.plan.moves.map((move) => move.amount));
  });
});
