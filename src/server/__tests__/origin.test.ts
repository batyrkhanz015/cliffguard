import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { requireSameOrigin } from '../origin';

const check = (request: Request) => requireSameOrigin(request, 'Use this site.');
function request(origin: string, host = '127.0.0.1:3002', url = 'http://127.0.0.1:3002/api/explain') {
  return new NextRequest(url, { headers: { origin, host } });
}
afterEach(() => vi.unstubAllEnvs());

describe('same origin with Next loopback normalization', () => {
  it.each(['127.0.0.1', '[::1]', 'localhost'])('accepts actual same-origin %s development traffic', (host) => {
    vi.stubEnv('NODE_ENV', 'development');
    const input = request(`http://${host}:3002`, `${host}:3002`, `http://${host}:3002/api/explain`);
    expect(new URL(input.url).hostname).toBe('localhost');
    expect(() => check(input)).not.toThrow();
  });
  it.each(['https://127.0.0.1:3002', 'http://127.0.0.1:3003', 'http://localhost:3002', 'http://[::1]:3002', 'http://foreign.example:3002', 'http://127.0.0.1.evil.example:3002', 'null', 'http://127.0.0.1:3002/path', 'not a URL'])('rejects foreign or malformed origin %s', (origin) => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => check(request(origin))).toThrow('Use this site.');
  });
  it('does not accept spoofed forwarded hosts or a missing/malformed actual host', () => {
    vi.stubEnv('NODE_ENV', 'development');
    for (const host of [null, 'localhost:3002', '127.0.0.1:3002, foreign.example', '127.0.0.1:3003']) {
      const input = request('http://127.0.0.1:3002');
      if (host === null) input.headers.delete('host'); else input.headers.set('host', host);
      input.headers.set('x-forwarded-host', '127.0.0.1:3002');
      input.headers.set('forwarded', 'host=127.0.0.1:3002;proto=http');
      expect(() => check(input)).toThrow();
    }
  });
  it('keeps the loopback correction development-only', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => check(request('http://127.0.0.1:3002'))).toThrow();
    expect(() => check(request('http://localhost:3002', 'localhost:3002'))).not.toThrow();
  });
  it('preserves exact public origins and requests without Origin, without public aliasing', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => check(new Request('https://cliffguard.example/api/explain', { headers: { origin: 'https://cliffguard.example' } }))).not.toThrow();
    expect(() => check(new Request('https://cliffguard.example/api/explain'))).not.toThrow();
    expect(() => check(request('https://other.example', 'other.example', 'https://cliffguard.example/api/explain'))).toThrow();
  });
});
