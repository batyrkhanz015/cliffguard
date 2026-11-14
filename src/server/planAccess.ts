import 'server-only';
import { diagnose, type LeverAmounts, ZERO_LEVERS } from '@/engine';
import { optimize } from '@/engine/server';
import { demoUnlockEnabled } from './entitlement';
import { isEntitled, type HouseholdRecord } from './household';
import { planView } from './redact';

/** Uses exactly the saved preferences and the last gig-check scenario; never saves defaults. */
export function planAccess(record: HouseholdRecord, asOf: string) {
  const entitled = isEntitled(record, asOf);
  const plan = optimize(record.input, { gig: record.lastGig, asOf });
  return {
    entitled,
    demoEnabled: demoUnlockEnabled(),
    access: entitled && record.entitlement ? {
      product: record.entitlement.product,
      validUntil: record.entitlement.validUntil,
      mode: record.entitlement.stripeSessionId.startsWith('demo_') ? 'demo' as const : 'paid' as const,
    } : null,
    plan: planView(plan, entitled),
    progress: entitled ? record.planProgress : {},
  };
}
export type PlanAccessData = ReturnType<typeof planAccess>;

/** Export reconciliation uses the same move amounts as the optimizer, including per-adult IRA. */
export function planExport(record: HouseholdRecord, asOf: string) {
  const scenario = { gig: record.lastGig, asOf };
  const plan = optimize(record.input, scenario);
  const levers: LeverAmounts = { ...ZERO_LEVERS, traditionalIra: { a: 0, b: 0 } };
  for (const move of plan.moves) {
    if (move.leverId === 'traditionalIra') {
      if (move.adultId) levers.traditionalIra[move.adultId] += move.amount;
    } else {
      levers[move.leverId] += move.amount;
    }
  }
  return { plan, before: diagnose(record.input, scenario), after: diagnose(record.input, scenario, undefined, levers) };
}
