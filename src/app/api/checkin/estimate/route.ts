import { z } from 'zod';
import { estimate2027 } from '@/engine';
import { requireYear } from '@/server/checkin';
import { todayAsOf } from '@/server/clock';
import { ApiError } from '@/server/errors';
import { requireHousehold } from '@/server/household';
import { requireSameOrigin } from '@/server/origin';
import { planExport } from '@/server/planAccess';
import { limit } from '@/server/ratelimit';
import { readJson, route } from '@/server/route';
import { getSid } from '@/server/session';

export const POST = route(async request => {
  requireSameOrigin(request, 'Open your estimate from this site.');
  const body = await readJson(request, z.strictObject({ expected2027: z.number().min(0).max(1_000_000_000) }));
  const sid = await getSid();
  const record = await requireHousehold(sid);
  const asOf = todayAsOf();
  requireYear(record, asOf);
  const rate = await limit('checkin-estimate', sid, 30, 86400);
  if (!rate.ok) {
    throw new ApiError('RATE_LIMITED', 429, 'Too many estimate requests today. Try again later.', { retryAfterSec: rate.retryAfterSec });
  }
  const { plan } = planExport(record, asOf);
  return Response.json({ ...estimate2027(body.expected2027, plan, record.input), deferredToNextYear: plan.totals.deferredToNextYear });
}, { noStore: true });
