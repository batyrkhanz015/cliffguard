import { z } from 'zod';
import { claudeAvailable } from '@/server/claude/client';
import { calculationExplanation, explainPlan, explanationPlanHash, validateExplanation } from '@/server/claude/explain';
import { todayAsOf } from '@/server/clock';
import { ApiError } from '@/server/errors';
import { isEntitled, requireHousehold } from '@/server/household';
import { planExport } from '@/server/planAccess';
import { limit } from '@/server/ratelimit';
import { readJson, route } from '@/server/route';
import { getSid } from '@/server/session';
import { store } from '@/server/store';

export const POST = route(async (request) => {
  const origin = request.headers.get('origin');
  if (origin !== null && origin !== new URL(request.url).origin) throw new ApiError('VALIDATION', 400, 'Open your plan from this site.');
  await readJson(request, z.strictObject({}));
  const sid = await getSid();
  const readPlan = async () => {
    const household = await requireHousehold(sid);
    const asOf = todayAsOf();
    if (!isEntitled(household, asOf)) throw new ApiError('NOT_ENTITLED', 402, 'Unlock your plan to read its explanation.');
    return planExport(household, asOf);
  };
  const { before, plan } = await readPlan();
  const { ok, retryAfterSec } = await limit('explain', sid, 10, 3600);
  if (!ok) throw new ApiError('RATE_LIMITED', 429, 'Too many explanation requests. Try again later.', { retryAfterSec });
  const hash = explanationPlanHash(before, plan);
  const key = `cg:explain:${sid}:${hash}`;
  let result = calculationExplanation(before, plan);
  if (await claudeAvailable()) {
    const cached = validateExplanation(await store.get(key), before, plan);
    result = cached ? { ...cached, source: 'claude' } : await explainPlan(before, plan);
    if (result.source === 'claude') {
      // Configuration and budget also govern cached disclosures, not just new dispatches.
      if (!(await claudeAvailable())) result = calculationExplanation(before, plan);
      else if (!cached) await store.set(key, result, 24 * 60 * 60);
    }
  }
  // Access, saved scenario and preferences can change while a provider request is in flight.
  const current = await readPlan();
  if (explanationPlanHash(current.before, current.plan) !== hash) {
    throw new ApiError('VALIDATION', 422, 'Your plan changed. Refresh it and request a new explanation.');
  }
  if (result.source === 'claude' && !(await claudeAvailable())) result = calculationExplanation(before, plan);
  return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
});
