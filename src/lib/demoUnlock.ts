import { sendJson, type ApiResult } from './api';
import type { PlanCoordinator } from './planCoordinator';

/** Uses the panel's proof/read exclusion; null means busy and no request was sent. */
export async function requestDemoUnlock(
  coordinator: PlanCoordinator,
  product: 'year' | 'rescue',
  onUnlocked: () => Promise<void>,
): Promise<ApiResult | null> {
  const outcome: { result: ApiResult | null } = { result: null };
  const accepted = await coordinator.mutate(async () => {
    outcome.result = await sendJson('POST', '/api/demo-unlock', { product });
  });
  if (!accepted) return null;
  // The refresh uses the same queue: release the mutation before waiting for that read.
  if (outcome.result?.ok) await onUnlocked();
  return outcome.result;
}
