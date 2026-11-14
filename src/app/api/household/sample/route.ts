import { z } from 'zod';
import { todayAsOf } from '@/server/clock';
import { buildSample } from '@/server/household';
import { enforceLimit } from '@/server/ratelimit';
import { householdView } from '@/server/redact';
import { clientIp, readJson, route } from '@/server/route';
import { getSid } from '@/server/session';

const SampleRequestSchema = z.object({ persona: z.literal('dani') });

/** "Try Dani's family": stores the sample inputs, then computes her year and her gig offer live. */
export const POST = route(async (request) => {
  await readJson(request, SampleRequestSchema);
  const sid = await getSid();
  await enforceLimit('recordWriteIp', clientIp(request, sid));
  await enforceLimit('sample', sid);
  const { household, diagnosis, gig } = await buildSample(sid, todayAsOf());
  return Response.json({ household: householdView(household), diagnosis, gig });
});
