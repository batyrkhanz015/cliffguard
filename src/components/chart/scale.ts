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

/** The tick step: 1, 2 or 5 times a power of ten, giving about `count` intervals over `span`. */
export function niceStep(span: number, count: number): number {
  const rough = span / count;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const fraction = rough / magnitude;
  return (fraction <= 1.5 ? 1 : fraction <= 3 ? 2 : fraction <= 7 ? 5 : 10) * magnitude;
}

/**
 * Round ticks that cover `[min, max]` in about `count` intervals. The first tick is at or below
 * `min`, the last at or above `max`.
 */
export function niceTicks(min: number, max: number, count: number): number[] {
  if (!(max > min) || count < 1) return [min];
  const step = niceStep(max - min, count);
  const first = Math.floor(min / step + 1e-9);
  const last = Math.ceil(max / step - 1e-9);
  return Array.from({ length: last - first + 1 }, (_, i) => (first + i) * step);
}

/** "$0", "$2K", "$2.5K", "−$500": one style per axis, decided by the tick step. */
export function compactUsd(value: number, step: number): string {
  const sign = value < 0 ? '−' : '';
  const abs = Math.abs(value);
  if (abs < 1000) return `${sign}$${abs}`;
  return `${sign}$${(abs / 1000).toFixed(step % 1000 === 0 ? 0 : 1)}K`;
}

/** Whole dollars with a true minus sign: 1321 gives "$1,321", -400 gives "−$400". */
export function signedUsd(value: number): string {
  const rounded = Math.round(value);
  return `${rounded < 0 ? '−' : ''}$${Math.abs(rounded).toLocaleString('en-US')}`;
}
