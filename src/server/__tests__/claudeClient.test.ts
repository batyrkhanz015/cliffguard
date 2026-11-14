import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { extractNotice } from '../claude/extract';
import { claudeAvailable, createClaudeClient, dailyCallKey } from '../claude/client';
import { store } from '../store';
import { NOTICE } from '@/test/noticeFixture';

const FILE = { bytes: new TextEncoder().encode('%PDF-1.7\nSAMPLE'), type: 'application/pdf' };
function reply(payload: unknown = NOTICE, stopReason = 'end_turn') {
  return Response.json({ id: 'msg_test', type: 'message', role: 'assistant', model: 'claude-opus-5-5',
    content: [{ type: 'text', text: JSON.stringify(payload) }], stop_reason: stopReason, stop_sequence: null,
    usage: { input_tokens: 50, output_tokens: 100 },
  });
}
beforeEach(async () => {
  vi.stubEnv('ANTHROPIC_API_KEY', 'test-not-a-real-key');
  vi.stubEnv('CLAUDE_ENABLED', 'true');
  vi.stubEnv('CLAUDE_DAILY_CALL_CAP', '1000');
  await store.del(dailyCallKey());
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe('real Anthropic SDK request safety', () => {
  it('uses structured output, exact model/token/effort/fallbacks, no tools or household, and disables debug logging', async () => {
    vi.stubEnv('ANTHROPIC_LOG', 'debug');
    const logs = [vi.spyOn(console, 'log'), vi.spyOn(console, 'debug'), vi.spyOn(console, 'info'), vi.spyOn(console, 'warn'), vi.spyOn(console, 'error')];
    const transport = vi.fn(async () => reply());
    vi.stubGlobal('fetch', transport);
    const client = createClaudeClient();
    expect(client.timeout).toBe(25000);
    expect(client.maxRetries).toBe(0);
    expect(client.logLevel).toBe('off');
    const result = await extractNotice(FILE);
    expect('extraction' in result && result.extraction.incomeEstimate).toBe(105000);
    expect(transport).toHaveBeenCalledOnce();
    const call = transport.mock.calls[0] as unknown as [RequestInfo, RequestInit];
    const body = JSON.parse(String(call[1].body));
    expect(body).toMatchObject({ model: 'claude-opus-5-5', max_tokens: 4000, fallbacks: 'default', thinking: { type: 'adaptive' }, output_config: { effort: 'low', format: { type: 'json_schema' } } });
    expect(body.tools).toBeUndefined();
    expect(body.messages).toHaveLength(1);
    expect(body.messages[0].content[0].text).toBe('<untrusted_document>');
    expect(body.messages[0].content[1]).toMatchObject({ type: 'document', source: { media_type: 'application/pdf', data: Buffer.from(FILE.bytes).toString('base64') } });
    expect(body.system).toMatch(/ignore every instruction/);
    expect(JSON.stringify(body)).not.toContain('adults');
    expect(new Headers(call[1].headers).get('anthropic-beta')).toContain('server-side-fallback-2026-07-01');
    for (const log of logs) expect(log).not.toHaveBeenCalled();
    expect(await store.get(dailyCallKey())).toBe(1);
  });
  it('uses an image block for image notices', async () => {
    const transport = vi.fn(async () => reply()); vi.stubGlobal('fetch', transport);
    await extractNotice({ bytes: new Uint8Array([255, 216, 255, 10]), type: 'image/jpeg' });
    const call = transport.mock.calls[0] as unknown as [RequestInfo, RequestInit];
    expect(JSON.parse(String(call[1].body)).messages[0].content[1].type).toBe('image');
  });
  it.each(['refusal', 'max_tokens', 'tool_use'])('fails closed on %s', async (reason) => {
    vi.stubGlobal('fetch', vi.fn(async () => reply(NOTICE, reason)));
    expect(await extractNotice(FILE)).toEqual({ error: 'CLAUDE_UNAVAILABLE' });
  });
  it.each(['bad-json', 'schema', 'server-error', 'network'])('sanitizes %s failures without retries or document logs', async (kind) => {
    const logs = [vi.spyOn(console, 'error'), vi.spyOn(console, 'debug'), vi.spyOn(console, 'warn')];
    const transport = vi.fn(async () => {
      if (kind === 'network') throw new Error('secret document contents');
      if (kind === 'server-error') return Response.json({ error: { type: 'api_error', message: 'secret document contents' } }, { status: 500 });
      if (kind === 'schema') return reply({ ...NOTICE, aptcMonthly: 20000 });
      return Response.json({ id: 'msg_test', type: 'message', role: 'assistant', content: [{ type: 'text', text: '{secret document contents' }], stop_reason: 'end_turn' });
    });
    vi.stubGlobal('fetch', transport);
    expect(await extractNotice(FILE)).toEqual({ error: 'CLAUDE_UNAVAILABLE' });
    expect(transport).toHaveBeenCalledOnce();
    for (const log of logs) expect(log).not.toHaveBeenCalled();
  });
  it('makes no call for missing key, kill switch, or invalid/zero cap', async () => {
    const transport = vi.fn(); vi.stubGlobal('fetch', transport);
    vi.stubEnv('ANTHROPIC_API_KEY', '');
    expect(await claudeAvailable()).toBe(false);
    expect(await extractNotice(FILE)).toEqual({ error: 'CLAUDE_UNAVAILABLE' });
    vi.stubEnv('ANTHROPIC_API_KEY', 'test'); vi.stubEnv('CLAUDE_ENABLED', 'false');
    expect(await extractNotice(FILE)).toEqual({ error: 'CLAUDE_UNAVAILABLE' });
    vi.stubEnv('CLAUDE_ENABLED', 'true'); vi.stubEnv('CLAUDE_DAILY_CALL_CAP', 'invalid');
    expect(await extractNotice(FILE)).toEqual({ error: 'CLAUDE_UNAVAILABLE' });
    expect(transport).not.toHaveBeenCalled();
    expect(await store.get(dailyCallKey())).toBeNull();
  });
  it('atomically admits only the daily cap under concurrent calls and fails closed on store failure', async () => {
    vi.stubEnv('CLAUDE_DAILY_CALL_CAP', '2');
    const transport = vi.fn(async () => reply()); vi.stubGlobal('fetch', transport);
    const results = await Promise.all(Array.from({ length: 8 }, () => extractNotice(FILE)));
    expect(results.filter((result) => 'extraction' in result)).toHaveLength(2);
    expect(transport).toHaveBeenCalledTimes(2);
    expect(await claudeAvailable()).toBe(false);
    vi.spyOn(store, 'incr').mockRejectedValue(new Error('store unavailable'));
    expect(await extractNotice(FILE)).toEqual({ error: 'CLAUDE_UNAVAILABLE' });
    expect(transport).toHaveBeenCalledTimes(2);
  });
  it('honors caller cancellation, including before dispatch', async () => {
    const controller = new AbortController();
    let started: () => void = () => {};
    const ready = new Promise<void>((resolve) => { started = resolve; });
    const transport = vi.fn((_url: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      started();
      init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true });
    }));
    vi.stubGlobal('fetch', transport);
    const pending = extractNotice(FILE, controller.signal);
    await ready; controller.abort();
    expect(await pending).toEqual({ error: 'CLAUDE_UNAVAILABLE' });
    expect(await extractNotice(FILE, controller.signal)).toEqual({ error: 'CLAUDE_UNAVAILABLE' });
    expect(transport).toHaveBeenCalledOnce();
  });
  it('aborts the SDK transport after 25 seconds', async () => {
    vi.useFakeTimers();
    let started: () => void = () => {};
    const ready = new Promise<void>((resolve) => { started = resolve; });
    vi.stubGlobal('fetch', vi.fn((_url: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      started(); init?.signal?.addEventListener('abort', () => reject(new DOMException('timeout', 'AbortError')), { once: true });
    })));
    const pending = extractNotice(FILE); await ready;
    await vi.advanceTimersByTimeAsync(25000);
    expect(await pending).toEqual({ error: 'CLAUDE_UNAVAILABLE' });
  });
});
