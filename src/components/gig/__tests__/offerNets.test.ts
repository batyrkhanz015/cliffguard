import { describe, expect, it } from 'vitest';
import { netLabel, offerNets } from '../offerNets';

const curve = [
  { gig: 0, netDoNothing: 0, netWithPlan: 0 },
  { gig: 1000, netDoNothing: 400, netWithPlan: 800 },
];

describe('offerNets', () => {
  it('uses the exact numbers at rest', () => {
    expect(offerNets(curve, 500, { netWithPlan: 777, netDoNothing: 333 }, false)).toEqual({
      netWithPlan: 777,
      netDoNothing: 333,
      approximate: false,
    });
  });

  it('reads the curve while dragging or without exact numbers', () => {
    const exact = { netWithPlan: 777, netDoNothing: 333 };
    expect(offerNets(curve, 500, exact, true)).toEqual({ netWithPlan: 400, netDoNothing: 200, approximate: true });
    expect(offerNets(curve, 500, undefined, false).approximate).toBe(true);
  });
});

describe('netLabel', () => {
  it('marks approximate values and uses a true minus', () => {
    expect(netLabel(1321.4, false)).toBe('$1,321');
    expect(netLabel(-400, true)).toBe('≈−$400');
  });
});
