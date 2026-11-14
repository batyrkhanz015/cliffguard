import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PUT } from '@/app/api/household/route';
import { POST as SAMPLE } from '@/app/api/household/sample/route';
import { DANI } from '@/samples/dani';
import { loadHousehold } from '../household';
import { LIMITS } from '../ratelimit';
import { clientIp } from '../route';

const identity = vi.hoisted(() => ({ sid: '' }));
vi.mock('../session', () => ({ getSid: async () => identity.sid, endSession: vi.fn(async () => {}) }));

const URL_BASE = 'http://localhost:3000';

/** A client that drops its cookie: every request arrives with a fresh session id. */
function fromNewSession(path: string, method: string, body: unknown, ip: string): Promise<Response> {
  identity.sid = crypto.randomUUID();
  const request = new Request(`${URL_BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
  return method === 'PUT' ? PUT(request) : SAMPLE(request);
}

const putFrom = (ip: string) => fromNewSession('/api/household', 'PUT', DANI, ip);

async function useUpIpCap(ip: string): Promise<void> {
  for (let i = 0; i < LIMITS.recordWriteIp.max; i += 1) expect((await putFrom(ip)).status).toBe(200);
}

beforeEach(() => {
  // Only the clock is faked, so the limit window can't roll over mid-test.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-11-15T10:00:10.000Z'));
});
afterEach(() => {
  vi.useRealTimers();
});

describe('per-IP cap on routes that create a household record', () => {
  it('stops a cookie-dropping client from creating records past the cap, without saving', async () => {
    await useUpIpCap('203.0.113.7');
    const blocked = await putFrom('203.0.113.7');
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get('Retry-After'))).toBeGreaterThan(0);
    await expect(loadHousehold(identity.sid)).resolves.toBeNull();
    expect((await putFrom('203.0.113.8')).status).toBe(200);
  });

  it('shares the cap between PUT and the sample', async () => {
    await useUpIpCap('198.51.100.4');
    const blocked = await fromNewSession('/api/household/sample', 'POST', { persona: 'dani' }, '198.51.100.4');
    expect(blocked.status).toBe(429);
    await expect(loadHousehold(identity.sid)).resolves.toBeNull();
  });
});

describe('clientIp', () => {
  const withHeaders = (headers: Record<string, string>) => new Request(URL_BASE, { headers });

  it('takes the first x-forwarded-for entry, then x-real-ip', () => {
    expect(clientIp(withHeaders({ 'x-forwarded-for': '192.0.2.1, 10.0.0.1' }), 'sid')).toBe('192.0.2.1');
    expect(clientIp(withHeaders({ 'x-real-ip': '192.0.2.9' }), 'sid')).toBe('192.0.2.9');
  });

  it('falls back to the session id, not one bucket shared by every caller', () => {
    expect(clientIp(withHeaders({}), 'sid-a')).toBe('sid-a');
    expect(clientIp(withHeaders({}), 'sid-b')).toBe('sid-b');
  });
});
