import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DANI, DANI_AS_OF, DANI_GIG } from '@/samples/dani';
import { diagnose } from '@/engine/diagnose';
import { optimize } from '@/engine/optimizer';
import { explainPlan, explanationPlanHash, validateExplanation } from '../claude/explain';
import { dailyCallKey } from '../claude/client';
import { store } from '../store';

const scenario = { gig: DANI_GIG, asOf: DANI_AS_OF };
const diagnosis = diagnose(DANI, scenario);
const plan = optimize(DANI, scenario);
const output = { headline: 'Your plan', paragraphs: ['Review your income.', 'Use the listed moves.', 'Review with your tax preparer.'], moveNotes: [], caveats: [] };
function reply(payload: unknown = output) {
  return Response.json({ id: 'msg_test', type: 'message', role: 'assistant', model: 'claude-opus-5-5', content: [{ type: 'text', text: JSON.stringify(payload) }], stop_reason: 'end_turn', stop_sequence: null, usage: { input_tokens: 50, output_tokens: 100 } });
}
beforeEach(async () => {
  vi.stubEnv('ANTHROPIC_API_KEY', 'test-not-real'); vi.stubEnv('CLAUDE_ENABLED', 'true'); vi.stubEnv('CLAUDE_DAILY_CALL_CAP', '1000');
  await store.del(dailyCallKey());
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });
describe('grounded explanation with real SDK and fake transport', () => {
  it('falls back after two ungrounded replies', async () => {
    const fetch = vi.fn(async () => reply({ ...output, headline: '$4,321 is saved' })); vi.stubGlobal('fetch', fetch);
    expect((await explainPlan(diagnosis, plan)).source).toBe('template');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it('uses the template immediately when the kill switch is on or the key missing', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch); vi.stubEnv('CLAUDE_ENABLED', 'false');
    expect((await explainPlan(diagnosis, plan)).source).toBe('template');
    vi.stubEnv('CLAUDE_ENABLED', 'true'); vi.stubEnv('ANTHROPIC_API_KEY', '');
    expect((await explainPlan(diagnosis, plan)).source).toBe('template');
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('provider boundaries', () => {
  it('accepts grounded structured output and sends only engine results', async () => {
    const transport = vi.fn(async () => reply()); vi.stubGlobal('fetch', transport);
    expect((await explainPlan(diagnosis, plan)).source).toBe('claude');
    const call = transport.mock.calls[0] as unknown as [RequestInfo, RequestInit];
    const body = JSON.parse(String(call[1].body));
    expect(body).toMatchObject({ model: 'claude-opus-5-5', max_tokens: 900, output_config: { format: { type: 'json_schema' } } });
    expect(body.tools).toBeUndefined();
    expect(JSON.parse(body.messages[0].content)).toEqual({ diagnosis, plan });
    expect(body.system).toMatch(/hide income/);
    expect(body.system).toMatch(/tax preparer/);
  });
  it('repairs grounding once with the offending numbers and counts both calls', async () => {
    const transport = vi.fn().mockImplementationOnce(async () => reply({ ...output, headline: '$4,321' })).mockImplementationOnce(async () => reply());
    vi.stubGlobal('fetch', transport);
    expect((await explainPlan(diagnosis, plan)).source).toBe('claude');
    expect(String(transport.mock.calls[1][1].body)).toContain('4,321'.replaceAll(',', ''));
    expect(await store.get(dailyCallKey())).toBe(2);
  });
  it('rejects malformed output and unmatched or invalid move IDs', async () => {
    for (const payload of [{ ...output, headline: 'x'.repeat(141) }, { ...output, moveNotes: [{ leverId: 'invented', note: 'Do this' }] }, { ...output, moveNotes: [{ leverId: 'sepIra', note: 'Do this' }] }]) {
      vi.stubGlobal('fetch', vi.fn(async () => reply(payload)));
      expect((await explainPlan(diagnosis, { ...plan, moves: [] })).source).toBe('template');
    }
    expect(validateExplanation({ ...output, paragraphs: ['Only one'] }, diagnosis, plan)).toBeNull();
  });
  it('respects daily cap on a grounding retry', async () => {
    vi.stubEnv('CLAUDE_DAILY_CALL_CAP', '1');
    const transport = vi.fn(async () => reply({ ...output, headline: '$4,321' })); vi.stubGlobal('fetch', transport);
    expect((await explainPlan(diagnosis, plan)).source).toBe('template');
    expect(transport).toHaveBeenCalledOnce();
  });
  it('aborts a retry at the shared deadline, not a fresh deadline', async () => {
    vi.useFakeTimers();
    let secondStarted: () => void = () => {};
    const ready = new Promise<void>((resolve) => { secondStarted = resolve; });
    const transport = vi.fn()
      .mockImplementationOnce(async () => { await new Promise((resolve) => setTimeout(resolve, 10000)); return reply({ ...output, headline: '$4,321' }); })
      .mockImplementationOnce((_url: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
        secondStarted(); init?.signal?.addEventListener('abort', () => reject(new DOMException('timeout', 'AbortError')), { once: true });
      }));
    vi.stubGlobal('fetch', transport);
    const pending = explainPlan(diagnosis, plan);
    await vi.advanceTimersByTimeAsync(10000); await ready;
    await vi.advanceTimersByTimeAsync(5000);
    expect((await pending).source).toBe('template');
    expect(transport).toHaveBeenCalledTimes(2);
  });
  it.each(['first', 'retry'] as const)('bounds a stalled %s budget reservation by the shared deadline', async (attempt) => {
    vi.useFakeTimers();
    let release: () => void = () => {};
    const reservationReady = new Promise<void>((resolve) => { release = resolve; });
    const originalIncr = store.incr.bind(store);
    const incr = vi.spyOn(store, 'incr');
    if (attempt === 'retry') incr.mockImplementationOnce(originalIncr);
    incr.mockImplementationOnce(async (...args) => {
      await reservationReady;
      return originalIncr(...args);
    });
    const transport = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      return reply({ ...output, headline: '$4,321' });
    });
    vi.stubGlobal('fetch', transport);
    const settled = vi.fn();
    const pending = explainPlan(diagnosis, plan).then(settled);
    try {
      await vi.advanceTimersByTimeAsync(14999);
      expect(incr).toHaveBeenCalledTimes(attempt === 'first' ? 1 : 2);
      expect(settled).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(1);
      expect(settled).toHaveBeenCalledWith(expect.objectContaining({ source: 'template' }));
    } finally {
      release();
      await vi.advanceTimersByTimeAsync(0);
    }
    await pending;
    expect(transport).toHaveBeenCalledTimes(attempt === 'first' ? 0 : 1);
    // A late reservation may still consume budget, but must never dispatch after the deadline.
    expect(await store.get(dailyCallKey())).toBe(attempt === 'first' ? 1 : 2);
    expect(settled).toHaveBeenCalledOnce();
  });
  it('hashes the full diagnosis and plan rather than moves alone', () => {
    expect(explanationPlanHash(diagnosis, plan)).not.toBe(explanationPlanHash({ ...diagnosis, repayment: diagnosis.repayment + 10 }, plan));
    expect(explanationPlanHash(diagnosis, plan)).not.toBe(explanationPlanHash(diagnosis, { ...plan, repaymentAfter: plan.repaymentAfter + 10 }));
  });
});
