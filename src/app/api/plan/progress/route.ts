import { todayAsOf } from '@/server/clock';
import { ApiError } from '@/server/errors';
import { isEntitled, requireHousehold, saveHousehold } from '@/server/household';
import { applyProgress, ProgressChangeSchema } from '@/server/progress';
import { enforceLimit } from '@/server/ratelimit';
import { readJson, route } from '@/server/route';
import { getSid } from '@/server/session';

/** Marks a move done or ticks its proofs; a paid feature. */
export const PATCH = route(async (request) => {
  const change = await readJson(request, ProgressChangeSchema);
  const sid = await getSid();
  await enforceLimit('progress', sid);
  const household = await requireHousehold(sid);
  if (!isEntitled(household, todayAsOf())) {
    throw new ApiError('NOT_ENTITLED', 402, 'Unlock the plan to track your progress.');
  }
  await saveHousehold(applyProgress(household, change, new Date().toISOString()));
  return Response.json({ ok: true });
});
