import { z } from 'zod';
import { LeverIdSchema } from '@/engine';
import { optimize } from '@/engine/server';
import { todayAsOf } from '@/server/clock';
import { GigInputSchema, isEntitled, requireHousehold, saveHousehold } from '@/server/household';
import { leverRows } from '@/server/leverRows';
import { enforceLimit } from '@/server/ratelimit';
import { planView } from '@/server/redact';
import { readJson, route } from '@/server/route';
import { getSid } from '@/server/session';

const PlanRequestSchema = z.object({
  gig: GigInputSchema.nullable(),
  keepMyCash: z.boolean(),
  leverOrder: z
    .array(LeverIdSchema)
    .max(LeverIdSchema.options.length)
    .refine((order) => new Set(order).size === order.length, 'Lever order repeats a lever'),
});

/**
 * The rescue plan for the user's preferences, which are saved for next time. Unpaid sessions
 * get the plan with each move's amount, how-to and proof locked.
 */
export const POST = route(async (request) => {
  const { gig, keepMyCash, leverOrder } = await readJson(request, PlanRequestSchema);
  const sid = await getSid();
  await enforceLimit('plan', sid);
  const saved = await requireHousehold(sid);
  const household = {
    ...saved,
    updatedAt: new Date().toISOString(),
    input: { ...saved.input, preferences: { keepMyCash, leverOrder } },
  };
  const asOf = todayAsOf();
  const plan = optimize(household.input, { gig, asOf });
  await saveHousehold(household);
  const entitled = isEntitled(household, asOf);
  return Response.json({ plan: planView(plan, entitled), entitled, levers: leverRows(household.input, asOf) });
});
