import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { enforceLimit, limit } from '../ratelimit';
import { route } from '../route';
import { store, StoreUnavailableError, withStoreErrors, type Store } from '../store';

/** A backend outage as the Upstash client reports it: a plain error with internal details. */
const outage = new Error('ECONNRESET talking to Upstash at cg:hh:secret');
const fail = async (): Promise<never> => {
  throw outage;
};
const broken: Store = { get: fail, set: fail, del: fail, incr: fail };

const answer = (handler: () => Promise<unknown>) =>
  route(async () => {
    await handler();
    return Response.json({ ok: true });
  })(new Request('http://localhost:3000/api/test', { method: 'POST' }));

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('withStoreErrors', () => {
  it('reports every failing store call as StoreUnavailableError, keeping the cause', async () => {
    const guarded = withStoreErrors(broken);
    for (const call of [guarded.get('k'), guarded.set('k', 1), guarded.del('k'), guarded.incr('k')]) {
      await expect(call).rejects.toSatisfy(
        (error) => error instanceof StoreUnavailableError && error.cause === outage,
      );
    }
  });

  it('passes successful calls through', async () => {
    const guarded = withStoreErrors(store);
    await guarded.set('cg:test:ok', { a: 1 });
    await expect(guarded.get('cg:test:ok')).resolves.toEqual({ a: 1 });
  });
});

describe('store outages in routes', () => {
  it('answers a failing store call with 503 STORE_UNAVAILABLE and no internal details', async () => {
    const response = await answer(() => withStoreErrors(broken).get('cg:hh:secret'));
    expect(response.status).toBe(503);
    const body = await response.text();
    expect(JSON.parse(body)).toMatchObject({ error: { code: 'STORE_UNAVAILABLE' } });
    expect(body).not.toContain('ECONNRESET');
    expect(body).not.toContain('secret');
  });

  it('reports a failing limiter as StoreUnavailableError and answers 503, not 500', async () => {
    vi.spyOn(store, 'incr').mockRejectedValue(outage);
    await expect(limit('test', crypto.randomUUID(), 5, 60)).rejects.toBeInstanceOf(StoreUnavailableError);
    const response = await answer(() => enforceLimit('plan', crypto.randomUUID()));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: { code: 'STORE_UNAVAILABLE' } });
  });
});
