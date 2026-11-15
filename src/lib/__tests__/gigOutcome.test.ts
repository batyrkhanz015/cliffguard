import { describe, expect, it } from 'vitest';
import type { GigCheckView } from '../planView';
import { gigOutcome } from '../gigOutcome';

const previous = { curve: [] } as unknown as GigCheckView;
const fresh = { curve: [1] } as unknown as GigCheckView;
const failure = (status: number, retryAfterSec: number | null) => ({
  ok: false as const,
  status,
  code: `HTTP_${status}`,
  issues: [],
  retryAfterSec,
});

describe('gigOutcome', () => {
  it('replaces the result on success and clears the error', () => {
    expect(gigOutcome(previous, { ok: true, data: fresh })).toEqual({ result: fresh, error: null });
  });

  it('keeps the previous result on any error', () => {
    for (const status of [0, 400, 429, 500]) {
      expect(gigOutcome(previous, failure(status, null)).result).toBe(previous);
    }
  });

  it('tells the user how long to wait after a rate limit', () => {
    expect(gigOutcome(previous, failure(429, 12)).error).toBe('Too many updates, try again in 12 s.');
  });

  it('uses the generic message for other failures', () => {
    expect(gigOutcome(null, failure(500, null)).error).toBe("We couldn't check this offer. Try again.");
  });
});
