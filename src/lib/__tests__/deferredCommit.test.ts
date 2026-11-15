import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDeferredCommit } from '../deferredCommit';

describe('createDeferredCommit', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('commits only the final value of a fast drag, once, on release', () => {
    const commit = vi.fn();
    const deferred = createDeferredCommit(commit, 400);
    [1000, 2000, 3000].forEach((value) => deferred.schedule(value));
    deferred.flush();
    vi.advanceTimersByTime(1000);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith(3000);
  });

  it('commits after a pause as a backstop', () => {
    const commit = vi.fn();
    const deferred = createDeferredCommit(commit, 400);
    deferred.schedule(500);
    vi.advanceTimersByTime(399);
    expect(commit).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(commit).toHaveBeenCalledWith(500);
  });

  it('does nothing on release when nothing is pending, or after cancel', () => {
    const commit = vi.fn();
    const deferred = createDeferredCommit(commit, 400);
    deferred.flush();
    deferred.schedule(500);
    deferred.cancel();
    vi.advanceTimersByTime(1000);
    expect(commit).not.toHaveBeenCalled();
  });
});
