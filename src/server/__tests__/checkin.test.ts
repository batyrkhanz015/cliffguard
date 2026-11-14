import { describe, expect, it } from 'vitest';
import { DANI } from '@/samples/dani';
import { replaceInput } from '../household';
import { applyCheckin, CheckinBodySchema } from '../checkin';
const record = () => replaceInput(null, { sid: crypto.randomUUID(), input: structuredClone(DANI), source: 'sample_dani', now: '2026-11-14T12:00:00Z' });
const body = () => CheckinBodySchema.parse({ requestId: 'checkin-0001', received: { seByAdult: { a: 9000 }, wagesByAdult: {}, capitalGains: 0, interestOrDividends: 0 }, expectedRestAfter: { seByAdult: { a: 13500, b: 0 }, wagesByAdult: { a: 0, b: 5800 } } });
describe('monthly check-in', () => {
  it('compares the saved baseline before the first update and is pure', () => {
    const original = record(); const copy = structuredClone(original);
    const result = applyCheckin(original, body(), '2026-11-15');
    expect(result.diagnosis.zone).toBe('over');
    expect(result.alerts.map(a => a.code)).toContain('CROSSED_CLIFF');
    expect(original).toEqual(copy);
    expect(result.record.input.adults[0].selfEmploymentProfit.ytd).toBe(87000);
  });
  it('caps check-ins at 24, newest last', () => {
    let current = record();
    for (let i = 0; i < 26; i++) current = applyCheckin(current, { ...body(), requestId: `request-${i}` }, '2026-11-15').record;
    expect(current.checkins).toHaveLength(24); expect(current.checkins[0].id).toBe('request-2'); expect(current.checkins.at(-1)?.id).toBe('request-25');
  });
});

describe('check-in validation and preservation', () => {
  it('moves forecast receipts into year-to-date once, and adds only uncounted investment income', () => {
    const original = record();
    const result = applyCheckin(original, { requestId: 'default-0001', received: { seByAdult: { a: 9000 }, wagesByAdult: { b: 1000 }, capitalGains: -500, interestOrDividends: 200 } }, '2026-11-15');
    expect(result.record.input.adults[0].selfEmploymentProfit).toEqual({ ytd: 87000, expectedRest: 4500 });
    expect(result.record.input.adults[1]?.wages).toEqual({ ytd: 30200, expectedRest: 4800 });
    expect(result.record.input.investments).toEqual({ ...DANI.investments, capitalGainsNet: -500, taxableInterest: 700 });
    // Moving forecast SE/wages from expected to received changes no projection; only investments do.
    expect(result.diagnosis.income.magi - result.checkin.baseline!.magi).toBeCloseTo(-300, 6);
    const exhausted = applyCheckin(original, { requestId: 'default-0002', received: { seByAdult: { a: 20000 }, wagesByAdult: {}, capitalGains: 0, interestOrDividends: 0 } }, '2026-11-15');
    expect(exhausted.record.input.adults[0].selfEmploymentProfit.expectedRest).toBe(0);
  });
  it('preserves provenance, preferences, saved gig, proof progress, entitlement and server timestamps', () => {
    const original = { ...record(), lastGig: { amount: 12000, canBillInJanuary: true }, planProgress: { hsa: { done: true, doneAt: '2026-11-14T12:00:00Z', proofsChecked: [0] } }, entitlement: { product: 'year' as const, stripeSessionId: 'demo_private', paidAt: '2026-11-14T12:00:00Z', validUntil: '2027-11-14' } };
    const result = applyCheckin(original, body(), '2026-11-15');
    for (const key of ['sid', 'source', 'createdAt', 'updatedAt', 'lastGig', 'planProgress', 'entitlement'] as const) expect(result.record[key]).toEqual(original[key]);
    expect(result.record.input.preferences).toEqual(original.input.preferences);
    expect(result.record.input.coverageYear).toBe(2026);
    expect(result.checkin.asOf).toBe('2026-11-15');
  });
  it('does not double-count the saved gig, and still updates only 2026 after year-end', () => {
    const original = { ...record(), lastGig: { amount: 12000, canBillInJanuary: false } };
    const result = applyCheckin(original, body(), '2027-01-10');
    expect(result.record.input.coverageYear).toBe(2026);
    expect(result.record.lastGig).toEqual(original.lastGig);
    const withoutGig = applyCheckin({ ...original, lastGig: null }, body(), '2027-01-10');
    expect(result.diagnosis).toEqual(withoutGig.diagnosis);
  });
  it('reproduces an original retry after later updates, without adding income or saving again', () => {
    const initial = applyCheckin(record(), body(), '2026-11-15');
    const later = applyCheckin(initial.record, { ...body(), requestId: 'checkin-0002' }, '2026-12-01');
    const replay = applyCheckin(later.record, body(), '2026-12-02');
    expect(replay.replayed).toBe(true); expect(replay.record).toBe(later.record);
    expect(replay.checkin).toEqual(initial.checkin); expect(replay.diagnosis).toEqual(initial.diagnosis); expect(replay.alerts).toEqual(initial.alerts);
    expect(() => applyCheckin(initial.record, { ...body(), received: { ...body().received, capitalGains: 1 } }, '2026-11-15')).toThrow('different amounts');
  });
  it('rejects stale baselines, unknown adults/keys, nonfinite or out-of-range amounts', () => {
    expect(() => applyCheckin(record(), { ...body(), baselineVersion: '2026-11-13T12:00:00Z' }, '2026-11-15')).toThrow('changed');
    const single = record(); single.input.adults = [single.input.adults[0]];
    expect(() => applyCheckin(single, body(), '2026-11-15')).toThrow('adult');
    expect(CheckinBodySchema.safeParse({ ...body(), sid: crypto.randomUUID() }).success).toBe(false);
    expect(CheckinBodySchema.safeParse({ ...body(), received: { ...body().received, seByAdult: { c: 1 } } }).success).toBe(false);
    expect(CheckinBodySchema.safeParse({ ...body(), expectedRestAfter: { ...body().expectedRestAfter, surprise: 10 } }).success).toBe(false);
    for (const amount of [Infinity, NaN, -1, 1_000_000_001]) expect(CheckinBodySchema.safeParse({ ...body(), received: { ...body().received, seByAdult: { a: amount } } }).success).toBe(false);
    const huge = record(); huge.input.adults[0].selfEmploymentProfit.ytd = 1_000_000_000;
    expect(() => applyCheckin(huge, body(), '2026-11-15')).toThrow('supported range');
  });
});
