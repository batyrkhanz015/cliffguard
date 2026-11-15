'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createDeferredCommit } from './deferredCommit';

/**
 * `schedule` and `flush` for a value that settles after rapid changes, committed through `onCommit`.
 * A new `onCommit` replaces the committer and drops anything still pending.
 */
export function useDeferredCommit<T>(onCommit: (value: T) => void, delayMs: number) {
  const deferred = useRef<ReturnType<typeof createDeferredCommit<T>> | null>(null);
  useEffect(() => {
    const created = createDeferredCommit(onCommit, delayMs);
    deferred.current = created;
    return created.cancel;
  }, [onCommit, delayMs]);

  const schedule = useCallback((value: T) => deferred.current?.schedule(value), []);
  const flush = useCallback(() => deferred.current?.flush(), []);
  return { schedule, flush };
}
