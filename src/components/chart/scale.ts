/** Minimal helpers for the hand-drawn SVG charts. */

export type Scale = (value: number) => number;

/** Maps `[d0, d1]` onto `[r0, r1]` linearly; a flat domain maps to `r0`. */
export function linearScale([d0, d1]: readonly [number, number], [r0, r1]: readonly [number, number]): Scale {
  const span = d1 - d0;
  return (value) => (span === 0 ? r0 : r0 + ((value - d0) / span) * (r1 - r0));
}

/** An SVG path through the points, straight segments. */
export function linePath(points: ReadonlyArray<readonly [number, number]>): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}
