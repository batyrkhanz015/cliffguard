import { z } from 'zod';
import { householdScope } from '@/lib/householdScope';
import { claudeAvailable } from '@/server/claude/client';
import { calculationExplanation, explainPlan, explanationPlanHash, validateExplanation } from '@/server/claude/explain';
import { todayAsOf } from '@/server/clock';
import { ApiError } from '@/server/errors';
import { explanationCacheKey, ExplanationCacheSchema } from '@/server/explanationCache';
import { requireSameOrigin } from '@/server/origin';
import { isEntitled, requireHousehold } from '@/server/household';
import { planExport } from '@/server/planAccess';
import { limit } from '@/server/ratelimit';
import { clientIp, readJson, route } from '@/server/route';
import { getSid } from '@/server/session';
import { store } from '@/server/store';

export const maxDuration = 60;

export const POST = route(async (request) => {
  requireSameOrigin(request, 'Open your plan from this site.');
  await readJson(request, z.strictObject({}));
  const sid = await getSid();
  const readPlan = async () => {
    const household = await requireHousehold(sid);
    const asOf = todayAsOf();
    if (!isEntitled(household, asOf)) throw new ApiError('NOT_ENTITLED', 402, 'Unlock your plan to read its explanation.');
    return { ...planExport(household, asOf), scope: householdScope(household) };
  };
  const { before, plan, scope } = await readPlan();
  // Demo unlock needs no payment, so the IP cap is what stops a dropped cookie draining the daily budget.
  const limits = await Promise.all([
    limit('explain', sid, 10, 3600),
    limit('explainIp', clientIp(request, sid), 30, 86400),
  ]);
  const denied = limits.filter((result) => !result.ok);
  if (denied.length) {
    throw new ApiError('RATE_LIMITED', 429, 'Too many explanation requests. Try again later.', {
      retryAfterSec: Math.max(...denied.map((result) => result.retryAfterSec)),
    });
  }
  const hash = explanationPlanHash(before, plan);
  const key = explanationCacheKey(sid);
  const revalidate = async () => {
    const current = await readPlan();
    if (current.scope !== scope || explanationPlanHash(current.before, current.plan) !== hash) {
      throw new ApiError('VALIDATION', 422, 'Your plan changed. Refresh it and request a new explanation.');
    }
  };
  let result = calculationExplanation(before, plan);
  let shouldCache = false;
  if (await claudeAvailable()) {
    const envelope = ExplanationCacheSchema.safeParse(await store.get(key));
    const cached = envelope.success && envelope.data.hash === hash ? validateExplanation(envelope.data.explanation, before, plan) : null;
    result = cached ? { ...cached, source: 'claude' } : await explainPlan(before, plan);
    // Configuration and budget also govern cached disclosures, not just new dispatches.
    if (result.source === 'claude' && !(await claudeAvailable())) result = calculationExplanation(before, plan);
    else shouldCache = result.source === 'claude' && !cached;
  }
  // Check before persisting any provider result, then check again after awaited storage.
  // Deletion during a cache write can finish first; remove that late write before returning.
  await revalidate();
  if (shouldCache) {
    try {
      await store.set(key, { hash, explanation: result }, 24 * 60 * 60);
      await revalidate();
    } catch (error) {
      await store.del(key);
      throw error;
    }
  }
  return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
});
