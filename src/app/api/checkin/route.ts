import { diagnose } from '@/engine';
import { applyCheckin, CheckinBodySchema, checkinSchedule, requireYear } from '@/server/checkin';
import { todayAsOf } from '@/server/clock';
import { ApiError } from '@/server/errors';
import { loadHousehold, requireHousehold, saveHousehold } from '@/server/household';
import { requireSameOrigin } from '@/server/origin';
import { limit } from '@/server/ratelimit';
import { publicCheckin } from '@/server/redact';
import { readJson, route } from '@/server/route';
import { getSid } from '@/server/session';
import { householdScope } from '@/lib/householdScope';

function privateRoute(handler: (request: Request) => Promise<Response>) {
  const wrapped = route(handler);
  return async (request: Request) => {
    const response = await wrapped(request); response.headers.set('Cache-Control', 'no-store'); return response;
  };
}
export const GET = privateRoute(async () => {
  const record = await loadHousehold(await getSid());
  if (!record) return Response.json({ kind: 'empty' });
  const asOf = todayAsOf();
  if (record.entitlement?.product !== 'year' || record.entitlement.validUntil < asOf) return Response.json({ kind: 'locked', householdScope: householdScope(record) });
  const latest = record.checkins.at(-1);
  return Response.json({ kind: 'ready', householdScope: householdScope(record), asOf, baselineVersion: record.updatedAt, since: latest?.asOf ?? record.createdAt.slice(0, 10),
    adults: record.input.adults.map(adult => ({ id: adult.id, label: adult.label, seExpected: adult.selfEmploymentProfit.expectedRest, wagesExpected: adult.wages.expectedRest })),
    diagnosis: diagnose(record.input, { gig: null, asOf }), history: record.checkins.map(publicCheckin), schedule: checkinSchedule(asOf, latest?.asOf),
  });
});
export const POST = privateRoute(async request => {
  requireSameOrigin(request, 'Open your check-in from this site.');
  const body = await readJson(request, CheckinBodySchema);
  const sid = await getSid(); const record = await requireHousehold(sid); const asOf = todayAsOf();
  requireYear(record, asOf);
  const rate = await limit('checkin', sid, 30, 86400);
  if (!rate.ok) throw new ApiError('RATE_LIMITED', 429, 'Too many check-in requests today. Try again later.', { retryAfterSec: rate.retryAfterSec });
  // Legacy API clients can omit requestId; the server generates a fresh ID before the pure update.
  const applied = applyCheckin(record, { ...body, requestId: body.requestId ?? crypto.randomUUID() }, asOf);
  const updatedAt = applied.replayed ? record.updatedAt : new Date(Math.max(Date.now(), Date.parse(record.updatedAt) + 1)).toISOString();
  if (!applied.replayed) await saveHousehold({ ...applied.record, updatedAt });
  return Response.json({ checkin: publicCheckin(applied.checkin), diagnosis: applied.diagnosis, alerts: applied.alerts, replayed: applied.replayed, baselineVersion: updatedAt });
});
