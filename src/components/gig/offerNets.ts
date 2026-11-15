import type { GigCheckResult } from '@/engine';

type Curve = GigCheckResult['curve'];

/** What the offer nets with and without a plan, as shown on the chart and in its text table. */
export type OfferNets = { netWithPlan: number; netDoNothing: number; approximate: boolean };

/** The engine's own numbers for exactly this offer, when the checked result is for it. */
export type ExactNets = { netWithPlan: number; netDoNothing: number };

/** The value of a series at `gig`, read between the two nearest curve points. */
function interpolate(curve: Curve, gig: number, pick: (point: Curve[number]) => number): number {
  const after = curve.findIndex((point) => point.gig >= gig);
  if (after <= 0) return pick(curve[Math.max(after, 0)]);
  const [a, b] = [curve[after - 1], curve[after]];
  return pick(a) + ((gig - a.gig) / (b.gig - a.gig)) * (pick(b) - pick(a));
}

/** Exact numbers while the slider rests on the checked offer; otherwise values read off the curve. */
export function offerNets(curve: Curve, marked: number, exact: ExactNets | undefined, dragging: boolean): OfferNets {
  if (exact !== undefined && !dragging) return { ...exact, approximate: false };
  return {
    netWithPlan: interpolate(curve, marked, (point) => point.netWithPlan),
    netDoNothing: interpolate(curve, marked, (point) => point.netDoNothing),
    approximate: true,
  };
}

/** "$1,321", or "≈$1,321" when read off the curve. */
export function netLabel(amount: number, approximate: boolean): string {
  const rounded = Math.round(amount);
  const text = `${rounded < 0 ? '−' : ''}$${Math.abs(rounded).toLocaleString('en-US')}`;
  return approximate ? `≈${text}` : text;
}
