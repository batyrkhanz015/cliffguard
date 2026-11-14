import 'server-only';
import { z } from 'zod';
import { todayAsOf } from './clock';
import { ApiError } from './errors';
import type { HouseholdRecord } from './household';

export const DemoProductSchema = z.strictObject({ product: z.enum(['rescue', 'year']) });
type Product = z.infer<typeof DemoProductSchema>['product'];
type Entitlement = NonNullable<HouseholdRecord['entitlement']>;
type DemoEnv = { NODE_ENV?: string; DEMO_UNLOCK_ENABLED?: string };

/** Deliberately opt-in even in development; production must explicitly enable the public demo. */
export function demoUnlockEnabled(env: DemoEnv = process.env): boolean {
  return env.DEMO_UNLOCK_ENABLED === 'true';
}

/** No payment is created or verified. Existing field names remain compatible with T6 storage. */
export function grantDemoAccess(
  product: Product,
  now: string,
  existing: HouseholdRecord['entitlement'],
  enabled: boolean,
): { entitlement: Entitlement; changed: boolean } {
  if (!enabled) throw new ApiError('PAYMENT_UNAVAILABLE', 503, 'Demo unlock is unavailable right now. No payment was taken.');
  const asOf = todayAsOf(new Date(now));
  const active = existing !== null && existing.validUntil >= asOf;
  const upgrade = active && existing.stripeSessionId.startsWith('demo_') && existing.product === 'rescue' && product === 'year';
  if (active && !upgrade) return { entitlement: existing, changed: false };
  let validUntil = product === 'rescue'
    ? '2027-10-15'
    : todayAsOf(new Date(Date.parse(now) + 365 * 86_400_000));
  if (validUntil < asOf) throw new ApiError('PAYMENT_UNAVAILABLE', 503, 'Rescue demo access has ended. Try the Year demo.');
  if (upgrade && existing.validUntil > validUntil) validUntil = existing.validUntil;
  return {
    changed: true,
    entitlement: { product, stripeSessionId: `demo_${crypto.randomUUID()}`, paidAt: now, validUntil },
  };
}
