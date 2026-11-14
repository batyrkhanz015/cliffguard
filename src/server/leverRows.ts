import 'server-only';
import { DEFAULT_LEVER_ORDER, TY2026, type HouseholdInput, type RuleSet } from '@/engine';
import { isEligible, LEVER_COPY } from '@/engine/server';
import type { LeverRow } from '@/lib/planView';

/**
 * All six levers for the plan screen: the household's saved order first, then any lever
 * missing from it in the default order, each with whether it is open to this household.
 */
export function leverRows(input: HouseholdInput, asOf: string, rules: RuleSet = TY2026): LeverRow[] {
  const saved = input.preferences.leverOrder;
  const order = [...saved, ...DEFAULT_LEVER_ORDER.filter((leverId) => !saved.includes(leverId))];
  return order.map((leverId) => {
    const eligibility = isEligible(leverId, input, asOf, rules);
    return {
      leverId,
      name: LEVER_COPY[leverId].name,
      eligible: eligibility.ok,
      reason: eligibility.ok ? null : eligibility.reason,
    };
  });
}
