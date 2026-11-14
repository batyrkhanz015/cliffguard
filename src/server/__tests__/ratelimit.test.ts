import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { enforceLimit, limit, LIMITS } from '../ratelimit';

describe('limit (in-memory window)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-14T15:00:10.000Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows up to the maximum in a window, then says when to retry', async () => {
    const id = crypto.randomUUID();
    const results = [];
    for (let i = 0; i < 4; i += 1) results.push(await limit('test', id, 3, 60));
    expect(results.map((result) => result.ok)).toEqual([true, true, true, false]);
    expect(results[3].retryAfterSec).toBe(50);
  });

  it('opens again in the next window', async () => {
    const id = crypto.randomUUID();
    await limit('test', id, 1, 60);
    expect((await limit('test', id, 1, 60)).ok).toBe(false);
    vi.advanceTimersByTime(50_000);
    expect((await limit('test', id, 1, 60)).ok).toBe(true);
  });

  it('counts each name and id separately', async () => {
    const id = crypto.randomUUID();
    await limit('one', id, 1, 60);
    expect((await limit('two', id, 1, 60)).ok).toBe(true);
    expect((await limit('one', crypto.randomUUID(), 1, 60)).ok).toBe(true);
  });
});

describe('enforceLimit', () => {
  it("throws a RATE_LIMITED error with the retry delay once over the route's limit", async () => {
    const id = crypto.randomUUID();
    for (let i = 0; i < LIMITS.sample.max; i += 1) await enforceLimit('sample', id);
    await expect(enforceLimit('sample', id)).rejects.toMatchObject({
      code: 'RATE_LIMITED',
      status: 429,
      retryAfterSec: expect.any(Number),
    });
  });
});
