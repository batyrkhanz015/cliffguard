/** Owns the panel's request ordering even when loading replaces its checklist children. */
export function createPlanCoordinator() {
  let tail: Promise<void> = Promise.resolve();
  let pending = 0;

  function enqueue(operation: () => Promise<void>): Promise<void> {
    pending += 1;
    const work = tail.then(operation);
    // A failed request must not block the subsequent refresh or retry.
    tail = work.catch(() => undefined);
    return work.finally(() => { pending -= 1; });
  }

  return {
    /** Reject extra checkbox actions synchronously while any save/read is queued or running. */
    mutate(operation: () => Promise<void>): Promise<boolean> {
      if (pending > 0) return Promise.resolve(false);
      return enqueue(operation).then(() => true);
    },
    /** Start the read only after earlier writes finish, so replacement UI sees persisted checks. */
    refresh(operation: () => Promise<void>): Promise<void> {
      return enqueue(operation);
    },
  };
}

export type PlanCoordinator = ReturnType<typeof createPlanCoordinator>;
