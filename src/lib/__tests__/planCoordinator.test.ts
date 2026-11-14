import { describe, expect, it } from 'vitest';
import { createPlanCoordinator } from '../planCoordinator';

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}

describe('plan access lifecycle scheduling', () => {
  it('defers refresh/focus until a delayed PATCH finishes, blocks another checkbox, then reads current progress', async () => {
    const coordinator = createPlanCoordinator();
    const patch = deferred();
    const read = deferred();
    const order: string[] = [];
    let persisted = { hsa: false, invoiceTiming: false };
    let displayed = { ...persisted };
    const first = coordinator.mutate(async () => {
      order.push('PATCH hsa');
      const snapshot = { ...persisted };
      await patch.promise;
      persisted = { ...snapshot, hsa: true };
      order.push('PATCH complete');
    });
    const refresh = coordinator.refresh(async () => {
      order.push('GET after refresh/focus');
      const snapshot = { ...persisted };
      await read.promise;
      displayed = snapshot;
    });
    const attempted = coordinator.mutate(async () => {
      order.push('overlapping PATCH');
      persisted = { ...persisted, invoiceTiming: true };
    });

    expect(await attempted).toBe(false);
    expect(order).toEqual(['PATCH hsa']);
    expect(displayed.hsa).toBe(false);
    patch.resolve();
    expect(await first).toBe(true);
    expect(order).toEqual(['PATCH hsa', 'PATCH complete', 'GET after refresh/focus']);
    // A stale checkbox handler cannot write while replacement progress is being fetched either.
    expect(await coordinator.mutate(async () => { order.push('PATCH during GET'); })).toBe(false);
    read.resolve();
    await refresh;
    expect(displayed).toEqual({ hsa: true, invoiceTiming: false });
    expect(await coordinator.mutate(async () => {
      persisted = { ...persisted, invoiceTiming: true };
    })).toBe(true);
    expect(persisted).toEqual({ hsa: true, invoiceTiming: true });
  });

  it('keeps queued refreshes ordered and releases the coordinator after a rejected PATCH', async () => {
    const coordinator = createPlanCoordinator();
    const patch = deferred();
    const order: string[] = [];
    const first = coordinator.mutate(async () => { await patch.promise; throw new Error('network failed'); });
    const rejected = expect(first).rejects.toThrow('network failed');
    const manual = coordinator.refresh(async () => { order.push('manual'); });
    const focus = coordinator.refresh(async () => { order.push('focus'); });
    expect(order).toEqual([]);
    patch.resolve();
    await rejected;
    await Promise.all([manual, focus]);
    expect(order).toEqual(['manual', 'focus']);
    expect(await coordinator.mutate(async () => { order.push('retry'); })).toBe(true);
    expect(order).toEqual(['manual', 'focus', 'retry']);
  });
});
