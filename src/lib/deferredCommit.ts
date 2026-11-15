/**
 * Collects rapid changes (a dragged slider) and commits only the last value: after `delayMs` of
 * quiet, or at once on `flush()` (release). Nothing is committed twice.
 */
export function createDeferredCommit<T>(commit: (value: T) => void, delayMs: number) {
  let pending: { value: T } | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function flush() {
    clearTimeout(timer);
    if (pending === null) return;
    const { value } = pending;
    pending = null;
    commit(value);
  }

  return {
    schedule(value: T) {
      pending = { value };
      clearTimeout(timer);
      timer = setTimeout(flush, delayMs);
    },
    flush,
    cancel() {
      clearTimeout(timer);
      pending = null;
    },
  };
}
