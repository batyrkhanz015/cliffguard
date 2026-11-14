import { describe, expect, it } from 'vitest';
import { householdIncome } from '@/engine';
import { DANI, DANI_AS_OF } from '@/samples/dani';
import {
  buildSample,
  isEntitled,
  loadHousehold,
  replaceInput,
  saveHousehold,
  type HouseholdRecord,
} from '../household';
import { leverRows } from '../leverRows';
import { store } from '../store';

const NOW = '2026-11-14T15:00:00.000Z';
const newSid = () => crypto.randomUUID();

function manualRecord(sid: string): HouseholdRecord {
  return replaceInput(null, { sid, source: 'manual', input: DANI, now: NOW });
}

function paid(record: HouseholdRecord, validUntil: string): HouseholdRecord {
  return {
    ...record,
    entitlement: { product: 'rescue', stripeSessionId: 'cs_test_1', paidAt: NOW, validUntil },
  };
}

describe('loadHousehold (Review Focus 3)', () => {
  it.each([
    ['nothing stored', undefined],
    ['an old version', { version: 0 }],
    ['invalid JSON', 'not json{'],
  ])('resolves to null for %s', async (_case, stored) => {
    await store.del('cg:hh:sid');
    if (stored !== undefined) await store.set('cg:hh:sid', stored);
    await expect(loadHousehold('sid')).resolves.toBeNull();
  });

  it('round-trips a valid record', async () => {
    const record = manualRecord(newSid());
    await saveHousehold(record);
    await expect(loadHousehold(record.sid)).resolves.toEqual(record);
  });

  it("ignores a record stored under another session's key", async () => {
    const record = manualRecord(newSid());
    const otherSid = newSid();
    await store.set(`cg:hh:${otherSid}`, record);
    await expect(loadHousehold(otherSid)).resolves.toBeNull();
  });
});

describe('replaceInput', () => {
  const saved = { keepMyCash: false, leverOrder: ['hsa' as const, 'sepIra' as const] };

  it('keeps the saved preferences over the form defaults', () => {
    const existing = manualRecord(newSid());
    existing.input = { ...existing.input, preferences: saved };
    const next = replaceInput(existing, { sid: existing.sid, source: 'manual', input: DANI, now: NOW });
    expect(next.input.preferences).toEqual(saved);
  });

  it('takes the preferences from the input for a new record', () => {
    const next = replaceInput(null, { sid: newSid(), source: 'manual', input: DANI, now: NOW });
    expect(next.input.preferences).toEqual(DANI.preferences);
  });

  it('keeps progress for the same household and starts it fresh on a switch, keeping the purchase', () => {
    const existing: HouseholdRecord = {
      ...paid(manualRecord(newSid()), '2027-10-15'),
      lastGig: { amount: 5_000, canBillInJanuary: true },
      planProgress: { hsa: { done: true, doneAt: NOW, proofsChecked: [0] } },
    };
    const same = replaceInput(existing, { sid: existing.sid, source: 'manual', input: DANI, now: NOW });
    expect(same.planProgress).toEqual(existing.planProgress);
    expect(same.lastGig).toEqual(existing.lastGig);

    const switched = replaceInput(existing, { sid: existing.sid, source: 'sample_dani', input: DANI, now: NOW });
    expect(switched).toMatchObject({ planProgress: {}, checkins: [], lastGig: null });
    expect(switched.entitlement).toEqual(existing.entitlement);
    expect(switched.createdAt).toBe(existing.createdAt);
  });
});

describe('isEntitled', () => {
  const record = manualRecord(newSid());

  it('is false without a purchase', () => {
    expect(isEntitled(record, '2026-11-14')).toBe(false);
  });

  it('is true through the last valid day, then false', () => {
    const rescue = paid(record, '2027-10-15');
    expect(isEntitled(rescue, '2027-10-15')).toBe(true);
    expect(isEntitled(rescue, '2027-10-16')).toBe(false);
  });
});

describe('leverRows', () => {
  it('lists all six levers, saved order first, with HSA closed and a reason on a silver plan', () => {
    const silver = {
      ...DANI,
      marketplace: { ...DANI.marketplace, planMetal: 'silver' as const },
      preferences: { keepMyCash: true, leverOrder: ['sepIra' as const, 'hsa' as const] },
    };
    const rows = leverRows(silver, DANI_AS_OF);
    expect(rows.map((row) => row.leverId)).toEqual([
      'sepIra',
      'hsa',
      'invoiceTiming',
      'businessPurchases',
      'delayStockSale',
      'traditionalIra',
    ]);
    expect(rows[1]).toMatchObject({ eligible: false, reason: expect.stringContaining('silver plan') });
    expect(rows.filter((row) => row.leverId !== 'hsa').every((row) => row.eligible && row.reason === null)).toBe(true);
  });
});

describe('buildSample', () => {
  it("computes Dani's diagnosis and locks the gig plan amounts when not entitled", async () => {
    const { household, diagnosis, gig } = await buildSample(newSid(), DANI_AS_OF);
    expect(household.source).toBe('sample_dani');
    // The engine keeps cents; household income (spec §A.9) is MAGI rounded to whole dollars.
    expect(householdIncome(diagnosis.income.magi)).toBe(122_036);
    expect(gig.plan.moves.length).toBeGreaterThan(0);
    expect(gig.plan.moves.every((move) => move.amount === null)).toBe(true);
  });

  it('saves the sample to the session', async () => {
    const sid = newSid();
    const { household } = await buildSample(sid, DANI_AS_OF);
    await expect(loadHousehold(sid)).resolves.toEqual(household);
  });

  it('shows the plan amounts to an entitled session', async () => {
    const sid = newSid();
    await saveHousehold(paid(manualRecord(sid), '2027-10-15'));
    const { gig } = await buildSample(sid, DANI_AS_OF);
    expect(gig.plan.moves.every((move) => typeof move.amount === 'number')).toBe(true);
  });
});
