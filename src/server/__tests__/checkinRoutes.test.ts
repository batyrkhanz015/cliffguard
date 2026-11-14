import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DANI, DANI_GIG } from '@/samples/dani';
import { GET, POST } from '@/app/api/checkin/route';
import { POST as estimate } from '@/app/api/checkin/estimate/route';
import { GET as calendar } from '@/app/api/calendar.ics/route';
import { estimate2027 } from '@/engine';
import { sendJson } from '@/lib/api';
import { readPendingCheckin, savePendingCheckin, settleCheckinAttempt } from '@/lib/checkinRetry';
import { householdScope } from '@/lib/householdScope';
import { HouseholdRecordSchema, replaceInput, requireHousehold, saveHousehold } from '../household';
import { planExport } from '../planAccess';
import { limit } from '../ratelimit';
import { store } from '../store';
const identity = vi.hoisted(() => ({ sid: '' }));
vi.mock('../session', () => ({ getSid: async () => identity.sid }));
vi.mock('../ratelimit', () => ({ limit: vi.fn(async () => ({ ok: true, retryAfterSec: 0 })) }));
const url = 'http://localhost:3000';
function request(path = '/api/checkin', body?: unknown, origin = url) {
  return new Request(url + path, { method: body === undefined ? 'GET' : 'POST', headers: { origin, 'content-type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
function body() { return { requestId: 'test-request-01', received: { seByAdult: { a: 9000 }, wagesByAdult: {}, capitalGains: 0, interestOrDividends: 0 }, expectedRestAfter: { seByAdult: { a: 13500, b: 0 }, wagesByAdult: { a: 0, b: 5800 } } }; }
async function grant(product: 'year' | 'rescue' = 'year', validUntil = '2027-11-15') {
  const original = replaceInput(null, { sid: identity.sid, input: DANI, source: 'sample_dani', now: '2026-11-15T10:00:00Z' });
  await saveHousehold({ ...original, lastGig: DANI_GIG, planProgress: { hsa: { done: true, proofsChecked: [0] } }, entitlement: { product, validUntil, stripeSessionId: 'demo_internal_grant', paidAt: '2026-11-15T10:00:00Z' } });
}
beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-15T12:00:00Z'));
  identity.sid = crypto.randomUUID(); vi.mocked(limit).mockResolvedValue({ ok: true, retryAfterSec: 0 });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.clearAllMocks(); });

describe('Year-only check-in routes', () => {
  it('returns useful empty and locked reads without protected numbers; gates writes/calendar/estimate', async () => {
    expect(await (await GET(request())).json()).toEqual({ kind: 'empty' });
    expect((await POST(request('/api/checkin', body()))).status).toBe(404);
    expect((await calendar(request('/api/calendar.ics'))).status).toBe(404);
    expect((await estimate(request('/api/checkin/estimate', { expected2027: 100000 }))).status).toBe(404);
    for (const [product, validUntil] of [['rescue', '2027-11-15'], ['year', '2026-11-14']] as const) {
      await grant(product, validUntil);
      const read = await GET(request()); expect(await read.json()).toMatchObject({ kind: 'locked', householdScope: expect.any(String) });
      for (const response of [await POST(request('/api/checkin', body())), await calendar(request('/api/calendar.ics')), await estimate(request('/api/checkin/estimate', { expected2027: 100000 }))]) {
        expect(response.status).toBe(402); expect(response.headers.get('Cache-Control')).toBe('no-store');
      }
    }
  });
  it('computes the first crossing from the baseline, saves once, and omits internal identifiers and retry snapshots', async () => {
    await grant(); const before = await requireHousehold(identity.sid);
    const save = vi.spyOn(store, 'set');
    const first = await POST(request('/api/checkin', { ...body(), baselineVersion: before.updatedAt }));
    expect(first.status).toBe(200); expect(first.headers.get('Cache-Control')).toBe('no-store');
    const payload = await first.json();
    expect(payload.diagnosis.zone).toBe('over'); expect(payload.alerts.map((alert: { code: string }) => alert.code)).toContain('CROSSED_CLIFF');
    expect(payload.replayed).toBe(false); expect(payload.checkin.baseline).toBeDefined();
    const saved = await requireHousehold(identity.sid); const savedCalls = save.mock.calls.length;
    const replay = await POST(request('/api/checkin', { ...body(), baselineVersion: before.updatedAt }));
    const retried = await replay.json();
    expect(retried.replayed).toBe(true); expect(retried.checkin).toEqual(payload.checkin); expect(retried.alerts).toEqual(payload.alerts);
    expect(save.mock.calls.length).toBe(savedCalls);
    expect(saved.checkins).toHaveLength(1); expect(saved.updatedAt > before.updatedAt).toBe(true);
    for (const key of ['lastGig', 'planProgress', 'entitlement'] as const) expect(saved[key]).toEqual(before[key]);
    expect(saved.input.preferences).toEqual(before.input.preferences);
    const read = await GET(request()); const text = await read.text();
    for (const secret of [identity.sid, 'demo_internal_grant', 'projectionInput', 'requestFingerprint']) expect(text).not.toContain(secret);
    expect(text).toContain('"kind":"ready"'); expect(text).toContain('"due":false');
    expect(limit).toHaveBeenCalledWith('checkin', identity.sid, 30, 86400);
  });
  it('rejects changed replay payloads and stale baseline writes without adding income', async () => {
    await grant(); const original = await requireHousehold(identity.sid);
    await POST(request('/api/checkin', body()));
    const saved = await requireHousehold(identity.sid);
    expect((await POST(request('/api/checkin', { ...body(), received: { ...body().received, capitalGains: 1 } }))).status).toBe(400);
    expect((await POST(request('/api/checkin', { ...body(), requestId: 'test-request-02', baselineVersion: original.updatedAt }))).status).toBe(400);
    expect(await requireHousehold(identity.sid)).toEqual(saved);
  });
  it.each(['rate limit', 'expired access'] as const)('retains a committed but lost response through %s, reload and same-ID recovery', async (gate) => {
    const storage = new Map<string, string>();
    vi.stubGlobal('sessionStorage', { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) });
    await grant(); const original = await requireHousehold(identity.sid);
    const scope = householdScope(original);
    const submission = { ...body(), requestId: crypto.randomUUID(), baselineVersion: original.updatedAt };
    savePendingCheckin(scope, submission);
    let loseResponse = true;
    const submitted: unknown[] = [];
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init: RequestInit) => {
      const sent: unknown = JSON.parse(init.body as string); submitted.push(sent);
      const response = await POST(request('/api/checkin', sent));
      if (loseResponse) { loseResponse = false; expect(response.status).toBe(200); throw new Error('response lost after commit'); }
      return response;
    }));
    const lost = await sendJson('POST', '/api/checkin', submission);
    expect(lost).toMatchObject({ ok: false, status: 0 });
    expect(settleCheckinAttempt(lost, false)).toBe(true);
    const committed = await requireHousehold(identity.sid);
    expect(committed.checkins).toHaveLength(1);
    if (gate === 'rate limit') vi.mocked(limit).mockResolvedValue({ ok: false, retryAfterSec: 86400 });
    else await saveHousehold({ ...committed, entitlement: { ...committed.entitlement!, validUntil: '2026-11-14' } });
    const rejected = await sendJson('POST', '/api/checkin', readPendingCheckin(scope));
    expect(rejected).toMatchObject({ ok: false, status: gate === 'rate limit' ? 429 : 402 });
    expect(settleCheckinAttempt(rejected, true)).toBe(true);
    // A page reload reconstructs only from persisted household-scoped data.
    const recovered = readPendingCheckin(scope);
    expect(recovered).toEqual(submission);
    if (gate === 'rate limit') vi.mocked(limit).mockResolvedValue({ ok: true, retryAfterSec: 0 });
    else await saveHousehold({ ...await requireHousehold(identity.sid), entitlement: committed.entitlement });
    const replay = await sendJson('POST', '/api/checkin', recovered);
    expect(replay).toMatchObject({ ok: true, data: { replayed: true, checkin: { id: submission.requestId } } });
    expect(settleCheckinAttempt(replay, recovered !== null)).toBe(false);
    expect(readPendingCheckin(scope)).toBeNull(); expect(storage.size).toBe(0);
    expect(submitted).toEqual([submission, submission, submission]);
    expect(await requireHousehold(identity.sid)).toEqual(committed);
  });
  it('validates unknown fields/amounts/adults, rejects foreign origins and enforces daily limits', async () => {
    await grant();
    expect((await POST(request('/api/checkin', { ...body(), coverageYear: 2027 }))).status).toBe(400);
    expect((await POST(request('/api/checkin', { ...body(), received: { ...body().received, wagesByAdult: { c: 1 } } }))).status).toBe(400);
    expect((await POST(request('/api/checkin', body(), 'https://foreign.example'))).status).toBe(400);
    vi.mocked(limit).mockResolvedValue({ ok: false, retryAfterSec: 123 });
    const response = await POST(request('/api/checkin', body())); expect(response.status).toBe(429); expect(response.headers.get('Retry-After')).toBe('123');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect((await requireHousehold(identity.sid)).checkins).toHaveLength(0);
  });
  it('keeps older stored check-ins readable without new retry metadata', async () => {
    await grant(); await POST(request('/api/checkin', body()));
    const current = await requireHousehold(identity.sid);
    const legacy = { ...current, checkins: current.checkins.map(({ id, asOf, received, expectedRestAfter, result }) => ({ id, asOf, received, expectedRestAfter, result })) };
    expect(HouseholdRecordSchema.safeParse(legacy).success).toBe(true);
    await saveHousehold(legacy); expect((await GET(request())).status).toBe(200);
  });
});

describe('calendar and January 15', () => {
  it('serves a private downloadable standards-based calendar', async () => {
    await grant(); const response = await calendar(request('/api/calendar.ics')); const text = await response.text();
    expect(response.status).toBe(200); expect(response.headers.get('Content-Type')).toContain('text/calendar');
    expect(response.headers.get('Content-Disposition')).toContain('.ics'); expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(text).toContain('URL:http://localhost:3000/checkin'); expect(text).not.toContain(identity.sid);
    expect(text).toContain('RRULE:FREQ=MONTHLY;COUNT=12');
  });
  it('uses the actual saved plan and exact engine floor, including deferrals and fractional dollars', async () => {
    await grant(); const original = await requireHousehold(identity.sid);
    await saveHousehold({ ...original, lastGig: { amount: 9000, canBillInJanuary: true } });
    const saved = await requireHousehold(identity.sid); const { plan } = planExport(saved, '2026-11-15');
    expect(plan.totals.deferredToNextYear).toBeGreaterThan(0);
    const expected2027 = 120000.49;
    const response = await estimate(request('/api/checkin/estimate', { expected2027 })); const value = await response.json();
    expect(value).toEqual({ ...estimate2027(expected2027, plan, saved.input), deferredToNextYear: plan.totals.deferredToNextYear });
    expect(value.floor).toBeGreaterThanOrEqual(expected2027); expect(value.floor % 1).toBeCloseTo(0.49, 6);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await requireHousehold(identity.sid)).toEqual(saved);
    expect(limit).toHaveBeenCalledWith('checkin-estimate', identity.sid, 30, 86400);
    expect((await estimate(request('/api/checkin/estimate', { expected2027, plan: {} }))).status).toBe(400);
    expect((await estimate(request('/api/checkin/estimate', { expected2027: -1 }))).status).toBe(400);
    expect((await estimate(request('/api/checkin/estimate', { expected2027 }, 'https://foreign.example'))).status).toBe(400);
    vi.mocked(limit).mockResolvedValue({ ok: false, retryAfterSec: 10 });
    expect((await estimate(request('/api/checkin/estimate', { expected2027 }))).status).toBe(429);
  });
});

describe('legacy household serializer privacy', () => {
  it('never exposes retry snapshots or grant IDs, and shows history only with active Year access', async () => {
    const { householdView } = await import('../redact');
    await grant(); await POST(request('/api/checkin', body()));
    const record = await requireHousehold(identity.sid);
    const exposed = householdView(record, '2026-11-15'); const text = JSON.stringify(exposed);
    expect(exposed.checkins).toHaveLength(1);
    expect(exposed.entitlement).toEqual({ product: 'year', validUntil: '2027-11-15' });
    for (const secret of [identity.sid, 'demo_internal_grant', 'stripeSessionId', 'paidAt', 'projectionInput', 'requestFingerprint']) expect(text).not.toContain(secret);
    expect(householdView(record, '2027-11-16').checkins).toEqual([]);
    expect(householdView({ ...record, entitlement: { ...record.entitlement!, product: 'rescue' } }, '2026-11-15').checkins).toEqual([]);
    expect(householdView({ ...record, entitlement: null }, '2026-11-15').checkins).toEqual([]);
  });
});
