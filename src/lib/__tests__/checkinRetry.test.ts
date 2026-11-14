import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sendJson } from '../api';
import { clearPendingCheckin, readPendingCheckin, savePendingCheckin, settleCheckinAttempt, subscribeCheckinInvalidation } from '../checkinRetry';
import { replaceInput } from '@/server/household';
import { householdView } from '@/server/redact';
import { DANI } from '@/samples/dani';
import type { CheckinBody } from '@/server/checkin';

const body: CheckinBody = { requestId: '04ffb0fc-60f7-4b1b-9d75-de096a57130b', baselineVersion: '2026-11-15T12:00:00Z', received: { seByAdult: { a: 9000 }, wagesByAdult: { b: 1000 }, capitalGains: -350, interestOrDividends: 200 }, expectedRestAfter: { seByAdult: { a: 13500, b: 0 }, wagesByAdult: { a: 0, b: 4800 } } };
function household(source: 'sample_dani' | 'manual' = 'sample_dani') { return replaceInput(null, { sid: crypto.randomUUID(), source, input: structuredClone(DANI), now: '2026-11-15T12:00:00Z' }); }
const browserData = new Map<string, string>();
beforeEach(() => {
  browserData.clear();
  vi.stubGlobal('window', new EventTarget());
  vi.stubGlobal('sessionStorage', { getItem: (key: string) => browserData.get(key) ?? null, setItem: (key: string, value: string) => { browserData.set(key, value); }, removeItem: (key: string) => { browserData.delete(key); } });
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('pending check-in household lifecycle', () => {
  it.each([400, 402, 404, 429])('a %s rejection only releases the original body when no earlier save was uncertain', (status) => {
    const response = { ok: false as const, status, code: 'REJECTED', issues: [], retryAfterSec: null };
    savePendingCheckin('scope', body);
    expect(settleCheckinAttempt(response, true)).toBe(true);
    expect(readPendingCheckin('scope')).toEqual(body);
    expect(settleCheckinAttempt(response, false)).toBe(false);
    expect(readPendingCheckin('scope')).toBeNull();
  });
  it('successful Delete my data clears persisted financial data and mounted retry state before a new household', async () => {
    const original = householdView(household(), '2026-11-15');
    savePendingCheckin(original.householdScope, body);
    expect(readPendingCheckin(original.householdScope)).toEqual(body);
    let mountedPending: CheckinBody | null = body;
    const abort = new AbortController();
    const unsubscribe = subscribeCheckinInvalidation(original.householdScope, () => { mountedPending = null; abort.abort(); });
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ ok: true })));
    expect((await sendJson('DELETE', '/api/household')).ok).toBe(true);
    expect(browserData.size).toBe(0); expect(mountedPending).toBeNull(); expect(abort.signal.aborted).toBe(true);
    const replacement = householdView(household(), '2026-11-15');
    expect(replacement.householdScope).not.toBe(original.householdScope);
    expect(readPendingCheckin(replacement.householdScope)).toBeNull();
    unsubscribe();
  });
  it('same-household successful save and reload recover the exact UUID/body without invalidating mounted retry state', async () => {
    const original = household(); const view = householdView(original, '2026-11-15');
    savePendingCheckin(view.householdScope, body);
    const invalidated = vi.fn(); const unsubscribe = subscribeCheckinInvalidation(view.householdScope, invalidated);
    const saved = { ...original, updatedAt: '2026-11-15T12:01:00Z' };
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ household: householdView(saved, '2026-11-15') })));
    expect((await sendJson('PUT', '/api/household', DANI)).ok).toBe(true);
    expect(readPendingCheckin(view.householdScope)).toEqual(body);
    expect(invalidated).not.toHaveBeenCalled();
    // A successful check-in may change updatedAt before its response is lost; scope does not.
    expect(householdView(saved).householdScope).toBe(view.householdScope);
    expect(readPendingCheckin(householdView(saved).householdScope)?.requestId).toBe(body.requestId);
    unsubscribe();
  });
  it('sample/personal replacement invalidates the old retry even if the source later cycles back', async () => {
    const sample = household(); const view = householdView(sample, '2026-11-15');
    savePendingCheckin(view.householdScope, body);
    const invalidated = vi.fn(); const unsubscribe = subscribeCheckinInvalidation(view.householdScope, invalidated);
    const personal = replaceInput(sample, { sid: sample.sid, source: 'manual', input: DANI, now: '2026-11-15T12:01:00Z' });
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ household: householdView(personal) })));
    await sendJson('PUT', '/api/household', DANI);
    expect(browserData.size).toBe(0); expect(invalidated).toHaveBeenCalled();
    expect(readPendingCheckin(householdView(personal).householdScope)).toBeNull();
    const secondSample = replaceInput(personal, { sid: sample.sid, source: 'sample_dani', input: DANI, now: '2026-11-15T12:02:00Z' });
    expect(householdView(secondSample).householdScope).not.toBe(view.householdScope);
    savePendingCheckin(view.householdScope, body);
    expect(readPendingCheckin(householdView(secondSample).householdScope)).toBeNull();
    expect(browserData.size).toBe(0);
    unsubscribe();
  });
  it('manual/upload entry changes preserve scope; failed deletes preserve legitimate pending retries', async () => {
    const manual = household('manual'); const scope = householdView(manual).householdScope;
    const uploaded = replaceInput(manual, { sid: manual.sid, source: 'upload', input: DANI, now: '2026-11-15T12:02:00Z' });
    expect(householdView(uploaded).householdScope).toBe(scope);
    const legacy = { ...manual, checkinIdentity: undefined };
    const legacyUpload = replaceInput(legacy, { sid: legacy.sid, source: 'upload', input: DANI, now: '2026-11-15T12:03:00Z' });
    expect(householdView(legacyUpload).householdScope).toBe(householdView(legacy).householdScope);
    savePendingCheckin(scope, body);
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ error: { code: 'STORE_UNAVAILABLE', message: 'Try again.' } }, { status: 503 })));
    expect((await sendJson('DELETE', '/api/household')).ok).toBe(false);
    expect(readPendingCheckin(scope)).toEqual(body);
  });
  it('erases unscoped legacy financial data and does not persist session/grant identifiers', () => {
    sessionStorage.setItem('cliffguard:pending-checkin:v1', JSON.stringify(body));
    expect(readPendingCheckin('new-household')).toBeNull(); expect(browserData.size).toBe(0);
    const original = household(); const scope = householdView(original).householdScope;
    savePendingCheckin(scope, body);
    const text = [...browserData.values()].join(''); expect(text).not.toContain(original.sid); expect(text).not.toContain('stripeSessionId');
    clearPendingCheckin(); expect(browserData.size).toBe(0);
  });
});
