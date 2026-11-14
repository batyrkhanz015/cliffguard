import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DANI, DANI_GIG } from '@/samples/dani';
import { loadHousehold, replaceInput, saveHousehold } from '../household';
import { POST } from '@/app/api/demo-unlock/route';
import { GET } from '@/app/api/plan/access/route';
import { limit } from '../ratelimit';

const identity = vi.hoisted(() => ({ sid: '' }));
vi.mock('../session', () => ({ getSid: async () => identity.sid }));
vi.mock('../ratelimit', () => ({ limit: vi.fn(async () => ({ ok: true, retryAfterSec: 0 })), enforceLimit: vi.fn() }));

function request(body: unknown, origin = 'http://localhost:3000') {
  return new Request('http://localhost:3000/api/demo-unlock', {
    method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify(body),
  });
}

beforeEach(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-15T10:00:00.000Z'));
  vi.stubEnv('DEMO_UNLOCK_ENABLED', 'true');
  identity.sid = crypto.randomUUID();
  await saveHousehold({ ...replaceInput(null, { sid: identity.sid, input: DANI, source: 'sample_dani', now: new Date().toISOString() }), lastGig: DANI_GIG });
  vi.mocked(limit).mockResolvedValue({ ok: true, retryAfterSec: 0 });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); vi.clearAllMocks(); });

describe('demo unlock route', () => {
  it('rejects disabled demo, unknown products, injected authority and foreign origins without granting', async () => {
    vi.stubEnv('DEMO_UNLOCK_ENABLED', 'false');
    expect((await POST(request({ product: 'year' }))).status).toBe(503);
    vi.stubEnv('DEMO_UNLOCK_ENABLED', 'true');
    expect((await POST(request({ product: 'admin' }))).status).toBe(400);
    expect((await POST(request({ product: 'year', sid: crypto.randomUUID() }))).status).toBe(400);
    expect((await POST(request({ product: 'year' }, 'https://foreign.example'))).status).toBe(400);
    expect((await loadHousehold(identity.sid))?.entitlement).toBeNull();
  });
  it('requires an existing session household', async () => {
    identity.sid = crypto.randomUUID();
    expect((await POST(request({ product: 'rescue' }))).status).toBe(404);
  });
  it('uses the existing generic limiter and returns Retry-After without granting when limited', async () => {
    vi.mocked(limit).mockResolvedValue({ ok: false, retryAfterSec: 47 });
    const response = await POST(request({ product: 'year' }));
    expect(limit).toHaveBeenCalledWith('demoUnlock', identity.sid, 10, 3600);
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('47');
    expect((await loadHousehold(identity.sid))?.entitlement).toBeNull();
  });
  it('grants without exposing sid, retains preferences/gig/progress, and does not rewrite a retry', async () => {
    const before = await loadHousehold(identity.sid);
    const response = await POST(request({ product: 'rescue' }));
    expect(response.status).toBe(200);
    const payload = await response.text();
    expect(payload).not.toContain(identity.sid);
    expect(payload).not.toContain('stripeSessionId');
    const first = await loadHousehold(identity.sid);
    expect(first?.input.preferences).toEqual(before?.input.preferences);
    expect(first?.lastGig).toEqual(before?.lastGig);
    expect(first?.planProgress).toEqual(before?.planProgress);
    vi.setSystemTime(new Date('2026-11-16T10:00:00.000Z'));
    expect((await POST(request({ product: 'rescue' }))).status).toBe(200);
    expect(await loadHousehold(identity.sid)).toEqual(first);
  });
});

describe('plan access route', () => {
  it('redacts protected details before access and exposes them after demo grant without session identity', async () => {
    const locked = await GET(new Request('http://localhost:3000/api/plan/access'));
    const lockedJson = await locked.json();
    expect(lockedJson.entitled).toBe(false);
    expect(lockedJson.plan.moves.length).toBeGreaterThan(0);
    expect(lockedJson.plan.moves.every((move: { amount: unknown; howTo: unknown }) => move.amount === null && move.howTo === null)).toBe(true);
    await POST(request({ product: 'rescue' }));
    const unlocked = await GET(new Request('http://localhost:3000/api/plan/access'));
    const unlockedText = await unlocked.text();
    const data = JSON.parse(unlockedText) as typeof lockedJson;
    expect(data.entitled).toBe(true);
    expect(data.plan.moves.every((move: { amount: unknown; howTo: string[] }) => typeof move.amount === 'number' && move.howTo.length > 0)).toBe(true);
    expect(unlockedText).not.toContain(identity.sid);
    expect(unlockedText).not.toContain('stripeSessionId');
    expect(unlocked.headers.get('Cache-Control')).toBe('no-store');
  });
});
