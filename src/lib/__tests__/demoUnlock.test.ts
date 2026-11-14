import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestDemoUnlock } from '../demoUnlock';
import { createPlanCoordinator } from '../planCoordinator';
import { sendJson } from '../api';

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}

afterEach(() => { vi.unstubAllGlobals(); });

describe('same-panel demo grants and proof writes', () => {
  it('rejects upgrade while a proof PATCH is pending, then upgrades from the saved proof on retry', async () => {
    const coordinator = createPlanCoordinator();
    const patch = deferred();
    const order: string[] = [];
    let stored = { product: 'rescue', proof: false };
    let displayed = { ...stored };
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      const snapshot = { ...stored };
      if (url === '/api/plan/progress') {
        order.push('PATCH start');
        await patch.promise;
        stored = { ...snapshot, proof: true };
        order.push('PATCH saved');
      } else {
        expect(url).toBe('/api/demo-unlock');
        order.push('upgrade saved');
        stored = { ...snapshot, product: 'year' };
      }
      return Response.json({ ok: true });
    }));
    const refresh = () => coordinator.refresh(async () => {
      order.push('fresh GET');
      displayed = { ...stored };
    });
    const save = coordinator.mutate(async () => { await sendJson('PATCH', '/api/plan/progress', { leverId: 'hsa', proofsChecked: [0] }); });
    const attemptedUpgrade = requestDemoUnlock(coordinator, 'year', refresh);
    await Promise.resolve();
    expect(order).toEqual(['PATCH start']);
    patch.resolve();
    await save;
    expect(await attemptedUpgrade).toBeNull();
    expect((await requestDemoUnlock(coordinator, 'year', refresh))?.ok).toBe(true);
    expect(order).toEqual(['PATCH start', 'PATCH saved', 'upgrade saved', 'fresh GET']);
    expect(stored).toEqual({ product: 'year', proof: true });
    expect(displayed).toEqual(stored);
  });

  it('rejects proof writes during upgrade and its refresh, then preserves Year on a later proof save', async () => {
    const coordinator = createPlanCoordinator();
    const grant = deferred();
    const read = deferred();
    const readStarted = deferred();
    const order: string[] = [];
    let stored = { product: 'rescue', proof: false };
    let displayed = { ...stored };
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      const snapshot = { ...stored };
      if (url === '/api/demo-unlock') {
        order.push('upgrade start');
        await grant.promise;
        stored = { ...snapshot, product: 'year' };
        order.push('upgrade saved');
      } else {
        expect(url).toBe('/api/plan/progress');
        order.push('PATCH saved');
        stored = { ...snapshot, proof: true };
      }
      return Response.json({ ok: true });
    }));
    const refresh = () => coordinator.refresh(async () => {
      order.push('fresh GET');
      readStarted.resolve();
      await read.promise;
      displayed = { ...stored };
    });
    const upgrade = requestDemoUnlock(coordinator, 'year', refresh);
    const save = () => coordinator.mutate(async () => { await sendJson('PATCH', '/api/plan/progress', { leverId: 'hsa', proofsChecked: [0] }); });
    expect(await save()).toBe(false);
    expect(order).toEqual(['upgrade start']);
    grant.resolve();
    // This would never start if the grant waited for refresh before releasing its mutation.
    await readStarted.promise;
    expect(await save()).toBe(false);
    read.resolve();
    expect((await upgrade)?.ok).toBe(true);
    expect(displayed).toEqual({ product: 'year', proof: false });
    expect(await save()).toBe(true);
    expect(stored).toEqual({ product: 'year', proof: true });
    expect(order).toEqual(['upgrade start', 'upgrade saved', 'fresh GET', 'PATCH saved']);
  });

  it('keeps failed initial grants retryable and refreshes only after a successful grant', async () => {
    const coordinator = createPlanCoordinator();
    const fetcher = vi.fn()
      .mockResolvedValueOnce(Response.json({ error: { code: 'PAYMENT_UNAVAILABLE', message: 'Unavailable' } }, { status: 503 }))
      .mockResolvedValueOnce(Response.json({ ok: true, mode: 'demo', product: 'rescue' }));
    vi.stubGlobal('fetch', fetcher);
    const refreshed = vi.fn(async () => undefined);
    const refresh = () => coordinator.refresh(refreshed);
    const failure = await requestDemoUnlock(coordinator, 'rescue', refresh);
    expect(failure?.ok).toBe(false);
    expect(refreshed).not.toHaveBeenCalled();
    expect((await requestDemoUnlock(coordinator, 'rescue', refresh))?.ok).toBe(true);
    expect(refreshed).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[1]?.[1].body).toBe(JSON.stringify({ product: 'rescue' }));
  });
});
