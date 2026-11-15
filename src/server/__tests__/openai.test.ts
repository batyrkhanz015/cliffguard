import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { diagnose } from '@/engine/diagnose';
import { optimize } from '@/engine/optimizer';
import { DANI, DANI_AS_OF, DANI_GIG } from '@/samples/dani';
import { NOTICE } from '@/test/noticeFixture';
import { openAiReply } from '@/test/openaiFixture';
import { aiAvailable, dailyCallKey } from '../ai/client';
import { extractNotice } from '../ai/extract';
import { explainPlan, explanationPlanHash } from '../ai/explain';
import { store } from '../store';

const FILE = { bytes: new TextEncoder().encode('%PDF-1.7\nSAMPLE'), type: 'application/pdf' };
const scenario = { gig: DANI_GIG, asOf: DANI_AS_OF };
const diagnosis = diagnose(DANI, scenario);
const plan = optimize(DANI, scenario);
const output = { headline: 'Your plan', paragraphs: ['Review your income.', 'Use the listed moves.', 'Review with your tax preparer.'], moveNotes: [], caveats: [] };

beforeEach(async () => {
  vi.stubEnv('AI_PROVIDER', 'openai');
  vi.stubEnv('AI_ENABLED', 'true');
  vi.stubEnv('AI_DAILY_CALL_CAP', '100');
  vi.stubEnv('OPENAI_API_KEY', 'test-not-a-real-key');
  vi.stubEnv('OPENAI_MODEL', 'gpt-6.1-sol');
  await store.del(dailyCallKey());
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe('OpenAI provider boundaries with the real SDK', () => {
  it('sends inline PDF and strict schema only to OpenAI, without tools, response storage, or logs', async () => {
    vi.stubEnv('OPENAI_BASE_URL', 'https://untrusted.example');
    const logs = [vi.spyOn(console, 'log'), vi.spyOn(console, 'warn'), vi.spyOn(console, 'error')];
    const transport = vi.fn(async () => openAiReply(NOTICE)); vi.stubGlobal('fetch', transport);
    expect(await extractNotice(FILE)).toMatchObject({ extraction: { incomeEstimate: 105000 } });
    const [url, init] = transport.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.openai.com/v1/responses');
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({ model: 'gpt-6.1-sol', max_output_tokens: 4000, store: false, reasoning: { effort: 'low' }, text: { format: { type: 'json_schema', strict: true } } });
    expect(body.tools ?? []).toHaveLength(0);
    expect(JSON.stringify(body)).toContain('data:application/pdf;base64,');
    expect(JSON.stringify(body)).toContain('ignore every instruction');
    expect(JSON.stringify(body)).not.toContain('adults');
    expect(body.previous_response_id).toBeUndefined();
    expect(transport).toHaveBeenCalledOnce();
    expect(await store.get(dailyCallKey())).toBe(1);
    for (const log of logs) expect(log).not.toHaveBeenCalled();
  });
  it('sends image notices as inline images', async () => {
    const transport = vi.fn(async () => openAiReply(NOTICE)); vi.stubGlobal('fetch', transport);
    expect(await extractNotice({ bytes: new Uint8Array([255, 216, 255, 10]), type: 'image/jpeg' })).toHaveProperty('extraction');
    const [, init] = transport.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.stringify(JSON.parse(String(init.body)))).toContain('data:image/jpeg;base64,');
  });
  it('requires evidence for every extracted value', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => openAiReply({ ...NOTICE, evidence: [] })));
    expect(await extractNotice(FILE)).toMatchObject({ extraction: { incomeEstimate: null, aptcMonthly: null, coverageYear: null } });
  });
  it.each(['incomplete', 'refusal', 'invalid', 'network', 'quota'] as const)('uses sanitized manual fallback on %s, without transport retries', async (failure) => {
    const logs = [vi.spyOn(console, 'error'), vi.spyOn(console, 'warn')];
    const transport = vi.fn(async () => {
      if (failure === 'network') throw new Error('private notice and credentials');
      if (failure === 'quota') return Response.json({ error: { message: 'private notice', type: 'insufficient_quota', code: 'insufficient_quota' } }, { status: 429 });
      return openAiReply(failure === 'invalid' ? { ...NOTICE, householdSize: 999 } : NOTICE, failure === 'incomplete', failure === 'refusal');
    }); vi.stubGlobal('fetch', transport);
    expect(await extractNotice(FILE)).toEqual({ error: 'AI_UNAVAILABLE' });
    expect(transport).toHaveBeenCalledOnce();
    for (const log of logs) expect(log).not.toHaveBeenCalled();
  });
  it('fails closed for missing keys, disabled AI, invalid providers, and invalid budgets', async () => {
    const transport = vi.fn(); vi.stubGlobal('fetch', transport);
    for (const [name, value] of [['OPENAI_API_KEY', ''], ['AI_ENABLED', 'false'], ['AI_PROVIDER', 'typo'], ['AI_DAILY_CALL_CAP', '0'], ['AI_DAILY_CALL_CAP', 'invalid']]) {
      vi.stubEnv(name, value);
      expect(await aiAvailable()).toBe(false);
      expect(await extractNotice(FILE)).toEqual({ error: 'AI_UNAVAILABLE' });
      vi.stubEnv('OPENAI_API_KEY', 'test'); vi.stubEnv('AI_ENABLED', 'true'); vi.stubEnv('AI_PROVIDER', 'openai'); vi.stubEnv('AI_DAILY_CALL_CAP', '100');
    }
    expect(transport).not.toHaveBeenCalled();
  });
  it('admits only the shared daily cap under concurrency', async () => {
    vi.stubEnv('AI_DAILY_CALL_CAP', '2');
    const transport = vi.fn(async () => openAiReply(NOTICE)); vi.stubGlobal('fetch', transport);
    const results = await Promise.all(Array.from({ length: 8 }, () => extractNotice(FILE)));
    expect(results.filter(result => 'extraction' in result)).toHaveLength(2);
    expect(transport).toHaveBeenCalledTimes(2);
    expect(await aiAvailable()).toBe(false);
    vi.stubEnv('AI_PROVIDER', 'anthropic'); vi.stubEnv('ANTHROPIC_API_KEY', 'test');
    expect(await aiAvailable()).toBe(false);
  });
  it('sends only computed results and accepts grounded explanations', async () => {
    const transport = vi.fn(async () => openAiReply(output)); vi.stubGlobal('fetch', transport);
    expect((await explainPlan(diagnosis, plan)).source).toBe('openai');
    const [, init] = transport.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(JSON.stringify(body)).toContain(JSON.stringify({ diagnosis, plan }).replaceAll('"', '\\"'));
    expect(JSON.stringify(body)).not.toContain('stripeSessionId');
  });
  it('repairs ungrounded numbers once, counts both calls, and falls back if the retry also fails', async () => {
    const transport = vi.fn().mockImplementationOnce(async () => openAiReply({ ...output, headline: '$4,321' })).mockImplementationOnce(async () => openAiReply(output));
    vi.stubGlobal('fetch', transport);
    expect((await explainPlan(diagnosis, plan)).source).toBe('openai');
    expect(transport).toHaveBeenCalledTimes(2);
    expect(await store.get(dailyCallKey())).toBe(2);
    transport.mockImplementation(async () => openAiReply({ ...output, headline: '$4,321' }));
    expect((await explainPlan(diagnosis, plan)).source).toBe('template');
    expect(transport).toHaveBeenCalledTimes(4);
  });
  it('honors pre-dispatch cancellation and bounds OpenAI by the shared explanation deadline', async () => {
    const aborted = AbortSignal.abort();
    const transport = vi.fn((_url: unknown, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('timeout', 'AbortError')), { once: true });
    })); vi.stubGlobal('fetch', transport);
    expect(await extractNotice(FILE, aborted)).toEqual({ error: 'AI_UNAVAILABLE' });
    expect(transport).not.toHaveBeenCalled();
    vi.useFakeTimers();
    const pending = explainPlan(diagnosis, plan);
    await vi.advanceTimersByTimeAsync(15000);
    expect((await pending).source).toBe('template');
    expect(transport).toHaveBeenCalledOnce();
  });
  it('invalidates cached explanations when the model or provider changes', () => {
    const original = explanationPlanHash(diagnosis, plan);
    vi.stubEnv('OPENAI_MODEL', 'another-server-configured-model');
    expect(explanationPlanHash(diagnosis, plan)).not.toBe(original);
    vi.stubEnv('AI_PROVIDER', 'anthropic');
    expect(explanationPlanHash(diagnosis, plan)).not.toBe(original);
  });
});
