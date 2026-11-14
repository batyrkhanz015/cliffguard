import { requireYear } from '@/server/checkin';
import { todayAsOf } from '@/server/clock';
import { requireHousehold } from '@/server/household';
import { buildIcs } from '@/server/ics';
import { route } from '@/server/route';
import { getSid } from '@/server/session';
const handler = route(async request => {
  const record = await requireHousehold(await getSid()); const asOf = todayAsOf();
  requireYear(record, asOf);
  return new Response(buildIcs(asOf, new URL(request.url).origin), { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="cliffguard-2026.ics"', 'X-Content-Type-Options': 'nosniff' } });
});
export async function GET(request: Request) {
  const response = await handler(request); response.headers.set('Cache-Control', 'no-store'); return response;
}
