import { describe, expect, it } from 'vitest';
import { grantDemoAccess, demoUnlockEnabled, DemoProductSchema } from '../entitlement';
import type { HouseholdRecord } from '../household';

const NOW = '2026-11-15T10:00:00.000Z';
type Entitlement = NonNullable<HouseholdRecord['entitlement']>;

describe('demo unlock eligibility', () => {
  it('requires explicit enablement in every environment, including production', () => {
    expect(demoUnlockEnabled({ NODE_ENV: 'development' })).toBe(false);
    expect(demoUnlockEnabled({ NODE_ENV: 'production', DEMO_UNLOCK_ENABLED: 'false' })).toBe(false);
    expect(demoUnlockEnabled({ NODE_ENV: 'production', DEMO_UNLOCK_ENABLED: 'true' })).toBe(true);
    expect(demoUnlockEnabled({ DEMO_UNLOCK_ENABLED: 'TRUE' })).toBe(false);
  });
  it('accepts only the two demo products and rejects extra client authority fields', () => {
    expect(DemoProductSchema.safeParse({ product: 'rescue' }).success).toBe(true);
    for (const body of [{ product: 'admin' }, { product: 'year', validUntil: '2099-01-01' }, {}]) {
      expect(DemoProductSchema.safeParse(body).success).toBe(false);
    }
  });
  it('fails closed when disabled', () => {
    expect(() => grantDemoAccess('year', NOW, null, false)).toThrow('Demo unlock is unavailable');
  });
});

describe('demo entitlement', () => {
  it('grants rescue through the fixed final day with a truthful demo identifier', () => {
    const result = grantDemoAccess('rescue', NOW, null, true);
    expect(result.changed).toBe(true);
    expect(result.entitlement).toMatchObject({ product: 'rescue', paidAt: NOW, validUntil: '2027-10-15' });
    expect(result.entitlement.stripeSessionId).toMatch(/^demo_/);
  });
  it('grants year access for 365 days', () => {
    expect(grantDemoAccess('year', NOW, null, true).entitlement.validUntil).toBe('2027-11-15');
  });
  it('preserves valid paid access and active Year demos on retries or product changes', () => {
    const existing: Entitlement = {
      product: 'year', stripeSessionId: 'cs_existing', paidAt: NOW, validUntil: '2028-11-15',
    };
    expect(grantDemoAccess('rescue', NOW, existing, true)).toEqual({ changed: false, entitlement: existing });
    const first = grantDemoAccess('year', NOW, null, true);
    expect(grantDemoAccess('rescue', NOW, first.entitlement, true)).toEqual({ changed: false, entitlement: first.entitlement });
    expect(grantDemoAccess('year', NOW, first.entitlement, true)).toEqual({ changed: false, entitlement: first.entitlement });
  });
  it('allows an explicit Rescue demo to Year demo upgrade, then keeps retries idempotent', () => {
    const rescue = grantDemoAccess('rescue', NOW, null, true).entitlement;
    expect(grantDemoAccess('rescue', NOW, rescue, true)).toEqual({ changed: false, entitlement: rescue });
    const upgraded = grantDemoAccess('year', NOW, rescue, true);
    expect(upgraded.changed).toBe(true);
    expect(upgraded.entitlement).toMatchObject({ product: 'year', validUntil: '2027-11-15' });
    expect(grantDemoAccess('year', '2026-11-16T10:00:00.000Z', upgraded.entitlement, true)).toEqual({ changed: false, entitlement: upgraded.entitlement });
  });
  it('renews an expired entitlement and refuses already expired rescue access', () => {
    const old: Entitlement = { product: 'rescue', stripeSessionId: 'demo_old', paidAt: NOW, validUntil: '2026-11-14' };
    expect(grantDemoAccess('year', NOW, old, true).changed).toBe(true);
    expect(() => grantDemoAccess('rescue', '2027-10-17T10:00:00.000Z', null, true)).toThrow('Rescue demo access has ended');
  });
});
