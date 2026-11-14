import { diagnose, HouseholdInputSchema } from '@/engine';
import { todayAsOf } from '@/server/clock';
import { deleteHousehold, loadHousehold, replaceInput, saveHousehold } from '@/server/household';
import { enforceLimit } from '@/server/ratelimit';
import { householdView } from '@/server/redact';
import { clientIp, readJson, route } from '@/server/route';
import { endSession, getSid } from '@/server/session';

/** The session's household and where it stands today; both null before the first check. */
export const GET = route(async (request) => {
  await enforceLimit('householdRead', clientIp(request));
  const household = await loadHousehold(await getSid());
  if (household === null) return Response.json({ household: null, diagnosis: null });
  const diagnosis = diagnose(household.input, { gig: null, asOf: todayAsOf() });
  return Response.json({ household: householdView(household), diagnosis });
});

/** Saves the user's own numbers, keeping their saved preferences. Input the engine can't check is not saved. */
export const PUT = route(async (request) => {
  const input = await readJson(request, HouseholdInputSchema);
  const sid = await getSid();
  await enforceLimit('householdWrite', sid);
  const existing = await loadHousehold(sid);
  const source = request.headers.get('x-cliffguard-input-source') === 'upload' ? 'upload' : 'manual';
  const household = replaceInput(existing, { sid, source, input, now: new Date().toISOString() });
  const diagnosis = diagnose(household.input, { gig: null, asOf: todayAsOf() });
  await saveHousehold(household);
  return Response.json({ household: householdView(household), diagnosis });
});

/** "Delete my data": removes the record and expires the session cookie. */
export const DELETE = route(async () => {
  await deleteHousehold(await getSid());
  await endSession();
  return Response.json({ ok: true });
});
