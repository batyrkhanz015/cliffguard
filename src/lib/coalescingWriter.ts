/**
 * Runs writes one at a time. A value submitted while a write is running replaces any earlier
 * waiting value, so after the current write only the newest value is written. The server has no
 * compare-and-set, so overlapping writes could otherwise land out of order.
 */
export function createCoalescingWriter<T>(initialWrite: (value: T) => Promise<void> = async () => undefined): {
  submit(value: T): void;
  /** Replaces the write function, e.g. when the closure behind it changes; takes effect on the next write. */
  setWrite(write: (value: T) => Promise<void>): void;
} {
  let write = initialWrite;
  type Waiting = { value: T } | null;
  let running = false;
  let waiting = null as Waiting;

  async function drain(first: T): Promise<void> {
    running = true;
    let next: Waiting = { value: first };
    while (next !== null) {
      waiting = null;
      await write(next.value).catch(() => undefined);
      next = waiting;
    }
    running = false;
  }

  return {
    setWrite(next) {
      write = next;
    },
    submit(value) {
      if (running) waiting = { value };
      else void drain(value);
    },
  };
}
