import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DANI, DANI_GIG } from '@/samples/dani';
import { POST } from '@/app/api/explain/route';
import { requireHousehold, replaceInput, saveHousehold } from '../household';
import { planExport } from '../planAccess';
import { dailyCallKey } from '../claude/client';
import { calculationExplanation, explanationPlanHash } from '../claude/explain';
import { limit } from '../ratelimit';
import { store } from '../store';

const identity = vi.hoisted(() => ({ sid: '' }));
vi.mock('../session', () => ({ getSid: async () => identity.sid }));
vi.mock('../ratelimit', () => ({ limit: vi.fn(async () => ({ ok: true, retryAfterSec: 0 })) }));
const output = { headline: 'Your plan', paragraphs: ['Review your income.', 'Use the listed moves.', 'Review with your tax preparer.'], moveNotes: [], caveats: [] };
function reply() {
  return Response.json({ id: 'msg_test', type: 'message', role: 'assistant', model: 'claude-opus-5-5', content: [{ type: 'text', text: JSON.stringify(output) }], stop_reason: 'end_turn', stop_sequence: null, usage: { input_tokens: 50, output_tokens: 100 } });
}
function request(body: unknown = {}, origin = 'http://localhost:3000') {
  return new Request('http://localhost:3000/api/explain', { method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify(body) });
}
async function grant() {
  identity.sid = crypto.randomUUID();
  await saveHousehold({ ...replaceInput(null, { sid: identity.sid, input: DANI, source: 'sample_dani', now: new Date().toISOString() }), lastGig: DANI_GIG,
    entitlement: { product: 'rescue', stripeSessionId: 'demo_private', paidAt: new Date().toISOString(), validUntil: '2027-10-15' } });
}
beforeEach(async () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-15T10:00:00Z'));
  vi.stubEnv('ANTHROPIC_API_KEY', 'test-not-real'); vi.stubEnv('CLAUDE_ENABLED', 'true'); vi.stubEnv('CLAUDE_DAILY_CALL_CAP', '1000');
  vi.mocked(limit).mockResolvedValue({ ok: true, retryAfterSec: 0 });
  vi.stubGlobal('fetch', vi.fn(async () => reply()));
  await store.del(dailyCallKey()); await grant();
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); vi.clearAllMocks(); });

describe('explanation disclosure and cache', () => {
  it('requires access, same origin and an empty server-owned request', async () => {
    expect((await POST(request({ sid: 'other' }))).status).toBe(400);
    expect((await POST(request({}, 'https://other.example'))).status).toBe(400);
    await saveHousehold({ ...await requireHousehold(identity.sid), entitlement: null });
    expect((await POST(request())).status).toBe(402);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('uses the saved gig and preferences for keyless template; key configuration immediately enables AI', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '');
    const record = await requireHousehold(identity.sid);
    const saved = { ...record, input: { ...record.input, preferences: { ...record.input.preferences, keepMyCash: true } } };
    await saveHousehold(saved);
    const { before, plan } = planExport(saved, '2026-11-15');
    const response = await POST(request());
    expect(await response.json()).toEqual(calculationExplanation(before, plan));
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(fetch).not.toHaveBeenCalled();
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-not-real');
    expect((await (await POST(request())).json()).source).toBe('claude');
    expect(fetch).toHaveBeenCalledOnce();
  });
  it('caches only valid AI output for 24 hours per session and full plan hash', async () => {
    const write = vi.spyOn(store, 'set');
    expect((await (await POST(request())).json()).source).toBe('claude');
    const { before, plan } = planExport(await requireHousehold(identity.sid), '2026-11-15');
    expect(write).toHaveBeenCalledWith(`cg:explain:${identity.sid}:${explanationPlanHash(before, plan)}`, { ...output, source: 'claude' }, 86400);
    expect((await (await POST(request())).json()).source).toBe('claude');
    expect(fetch).toHaveBeenCalledOnce();
    await saveHousehold({ ...await requireHousehold(identity.sid), lastGig: null });
    await POST(request()); expect(fetch).toHaveBeenCalledTimes(2);
    await grant(); await POST(request()); expect(fetch).toHaveBeenCalledTimes(3);
  });
  it('enforces session limits, kill switch and budget even on cache hits', async () => {
    await POST(request());
    expect(limit).toHaveBeenCalledWith('explain', identity.sid, 10, 3600);
    vi.stubEnv('CLAUDE_ENABLED', 'false');
    expect((await (await POST(request())).json()).source).toBe('template');
    vi.stubEnv('CLAUDE_ENABLED', 'true'); vi.stubEnv('CLAUDE_DAILY_CALL_CAP', '1');
    expect((await (await POST(request())).json()).source).toBe('template');
    vi.mocked(limit).mockResolvedValue({ ok: false, retryAfterSec: 42 });
    const response = await POST(request());
    expect(response.status).toBe(429); expect(response.headers.get('Retry-After')).toBe('42');
    expect(fetch).toHaveBeenCalledOnce();
  });
  it.each(['access', 'gig', 'kill'] as const)('revalidates %s after an in-flight provider call', async (change) => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      const record = await requireHousehold(identity.sid);
      if (change === 'access') await saveHousehold({ ...record, entitlement: null });
      if (change === 'gig') await saveHousehold({ ...record, lastGig: null });
      if (change === 'kill') vi.stubEnv('CLAUDE_ENABLED', 'false');
      return reply();
    }));
    const response = await POST(request());
    if (change === 'kill') expect((await response.json()).source).toBe('template');
    else expect(response.status).toBe(change === 'access' ? 402 : 422);
  });
  it('rejects corrupted cached output and never discloses record IDs', async () => {
    const { before, plan } = planExport(await requireHousehold(identity.sid), '2026-11-15');
    await store.set(`cg:explain:${identity.sid}:${explanationPlanHash(before, plan)}`, { ...output, headline: '$4,321' });
    const response = await POST(request()); const text = await response.text();
    expect(fetch).toHaveBeenCalledOnce(); expect(text).not.toContain('$4,321');
    expect(text).not.toContain(identity.sid); expect(text).not.toContain('demo_private');
  });
});
