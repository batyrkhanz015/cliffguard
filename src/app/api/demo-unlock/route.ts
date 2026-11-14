import { demoUnlockEnabled, DemoProductSchema, grantDemoAccess } from '@/server/entitlement';
import { ApiError } from '@/server/errors';
import { requireHousehold, saveHousehold } from '@/server/household';
import { limit } from '@/server/ratelimit';
import { readJson, route } from '@/server/route';
import { getSid } from '@/server/session';

/** Public, explicitly enabled demo access. No sid, price, payment token or dates are client-controlled. */
export const POST = route(async (request) => {
  const origin = request.headers.get('origin');
  if (origin !== null && origin !== new URL(request.url).origin) {
    throw new ApiError('VALIDATION', 400, 'Open the demo from this site to unlock it.');
  }
  const { product } = await readJson(request, DemoProductSchema);
  const sid = await getSid();
  const { ok, retryAfterSec } = await limit('demoUnlock', sid, 10, 3600);
  if (!ok) throw new ApiError('RATE_LIMITED', 429, 'Too many unlock attempts. Try again later.', { retryAfterSec });
  const household = await requireHousehold(sid);
  const now = new Date().toISOString();
  const result = grantDemoAccess(product, now, household.entitlement, demoUnlockEnabled());
  if (result.changed) await saveHousehold({ ...household, entitlement: result.entitlement, updatedAt: now });
  return Response.json({ ok: true, mode: 'demo', product: result.entitlement.product, validUntil: result.entitlement.validUntil }, {
    headers: { 'Cache-Control': 'no-store' },
  });
});
