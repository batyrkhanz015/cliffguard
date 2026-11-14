import { cliffAmount } from './fpl';
import { usd } from './format';
import { TY2026 } from './rules/ty2026';
import type { HouseholdInput, PlanResult, RuleSet } from './types';

export type Estimate2027 = { floor: number; cliff2027: number; headroom2027: number; warning: string | null };

/**
 * The 2027 income estimate to give the Marketplace (spec §A.8). The floor is the expected 2027
 * income plus everything the plan moves into January. The engine never offers a lower number:
 * understating income to the Marketplace is penalized (45 CFR 155.285).
 */
export function estimate2027(
  expected2027: number,
  plan: PlanResult | null,
  household: Pick<HouseholdInput, 'state' | 'householdSize'>,
  rules: RuleSet = TY2026,
): Estimate2027 {
  const floor = expected2027 + (plan?.totals.deferredToNextYear ?? 0);
  const cliff2027 = cliffAmount(household.state, household.householdSize, { ...rules, fpl: rules.nextYear.fpl });
  if (cliff2027 === null) throw new Error(`estimate2027 needs a rule set with a subsidy cliff; ${rules.id} has none`);
  const headroom2027 = cliff2027 - floor;
  const warning =
    headroom2027 < 0
      ? `Even your lowest honest 2027 estimate, ${usd(floor)}, is over the ${usd(cliff2027)} line for 2027. Plan for no credit, or look for ways to lower 2027 income.`
      : null;
  return { floor, cliff2027, headroom2027, warning };
}
