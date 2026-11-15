import { describe, expect, it } from 'vitest';
import { placeLabel } from '../labels';
import { compactUsd, niceTicks, signedUsd } from '../scale';

describe('niceTicks', () => {
  it('gives round steps that cover the range', () => {
    expect(niceTicks(0, 9342, 4)).toEqual([0, 2000, 4000, 6000, 8000, 10000]);
    expect(niceTicks(-1200, 8548, 5)).toEqual([-2000, 0, 2000, 4000, 6000, 8000, 10000]);
  });

  it('handles a flat range', () => {
    expect(niceTicks(5, 5, 4)).toEqual([5]);
  });
});

describe('compactUsd', () => {
  it('uses one style per axis', () => {
    expect(compactUsd(0, 2000)).toBe('$0');
    expect(compactUsd(90_000, 10_000)).toBe('$90K');
    expect(compactUsd(2500, 500)).toBe('$2.5K');
    expect(compactUsd(-500, 500)).toBe('−$500');
  });
});

describe('signedUsd', () => {
  it('formats whole dollars with a true minus', () => {
    expect(signedUsd(1321.4)).toBe('$1,321');
    expect(signedUsd(-400)).toBe('−$400');
  });
});

describe('placeLabel', () => {
  const bounds = { x: 0, y: 0, width: 300, height: 200 };
  const size = { width: 100, height: 16 };

  it('takes the first candidate that fits', () => {
    const placed = placeLabel([50, 100], size, { candidates: ['above-right', 'below-right'], bounds, obstacles: [] });
    expect(placed.anchor).toBe('start');
    expect(placed.rect.y).toBeLessThan(100);
  });

  it('flips left near the right edge and below when above is taken', () => {
    const edge = placeLabel([280, 100], size, { candidates: ['above-right', 'above-left'], bounds, obstacles: [] });
    expect(edge.anchor).toBe('end');
    const taken = { x: 0, y: 60, width: 300, height: 30 };
    const below = placeLabel([50, 100], size, { candidates: ['above-right', 'below-right'], bounds, obstacles: [taken] });
    expect(below.rect.y).toBeGreaterThan(100);
  });

  it('keeps off the lines it is told to avoid', () => {
    const placed = placeLabel([50, 100], size, {
      candidates: ['above-right', 'below-right'],
      bounds,
      obstacles: [],
      avoid: [[100, 82]],
    });
    expect(placed.rect.y).toBeGreaterThan(100);
  });
});
