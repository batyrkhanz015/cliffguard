import { gigCheck } from '@/engine/server';
import { todayAsOf } from '@/server/clock';
import { GigInputSchema, isEntitled, requireHousehold, saveHousehold } from '@/server/household';
import { enforceLimit } from '@/server/ratelimit';
import { gigCheckView } from '@/server/redact';
import { readJson, route } from '@/server/route';
import { getSid } from '@/server/session';

/** Is this gig worth taking? Remembers the offer; the rescue plan's amounts stay locked unless paid. */
export const POST = route(async (request) => {
  const gig = await readJson(request, GigInputSchema);
  const sid = await getSid();
  await enforceLimit('gigCheck', sid);
  const household = await requireHousehold(sid);
  const asOf = todayAsOf();
  const result = gigCheck(household.input, gig, asOf);
  await saveHousehold({ ...household, lastGig: gig, updatedAt: new Date().toISOString() });
  return Response.json(gigCheckView(result, isEntitled(household, asOf)));
});
