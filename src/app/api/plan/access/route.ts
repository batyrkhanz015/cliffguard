import { todayAsOf } from '@/server/clock';
import { requireHousehold } from '@/server/household';
import { planAccess } from '@/server/planAccess';
import { enforceLimit } from '@/server/ratelimit';
import { route } from '@/server/route';
import { getSid } from '@/server/session';

export const GET = route(async () => {
  const sid = await getSid();
  await enforceLimit('plan', sid);
  return Response.json(planAccess(await requireHousehold(sid), todayAsOf()), { headers: { 'Cache-Control': 'no-store' } });
});
