/** Label placement for the SVG charts: pick a spot beside a dot that stays clear of other things. */

export type Rect = { x: number; y: number; width: number; height: number };
export type Placement = { rect: Rect; anchor: 'start' | 'end' };
export type Candidate = 'above-right' | 'above-left' | 'below-right' | 'below-left' | 'right' | 'left';

/** A deliberate slight overestimate of Inter's glyph width, so labels never clip. */
export function estimateTextWidth(text: string, fontSize = 12): number {
  return text.length * fontSize * 0.56;
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

const contains = (outer: Rect, inner: Rect): boolean =>
  inner.x >= outer.x &&
  inner.y >= outer.y &&
  inner.x + inner.width <= outer.x + outer.width &&
  inner.y + inner.height <= outer.y + outer.height;

const pointIn = (rect: Rect, [x, y]: readonly [number, number]): boolean =>
  x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;

type PlaceOptions = {
  /** Tried in order; the first free one wins, then the first that at least stays in bounds. */
  candidates: readonly Candidate[];
  bounds: Rect;
  obstacles: readonly Rect[];
  /** Pixel points of lines the label should not sit on. */
  avoid?: ReadonlyArray<readonly [number, number]>;
  gap?: number;
};

/** Places a label of `size` next to the dot at `(x, y)`. */
export function placeLabel(
  [x, y]: readonly [number, number],
  { width, height }: { width: number; height: number },
  { candidates, bounds, obstacles, avoid = [], gap = 10 }: PlaceOptions,
): Placement {
  const options = candidates.map((candidate): Placement => {
    const left = candidate.endsWith('left');
    const centred = candidate === 'left' || candidate === 'right';
    const above = candidate.startsWith('above');
    const rect = {
      x: left ? x - gap - width : x + gap,
      y: centred ? y - height / 2 : above ? y - gap - height : y + gap,
      width,
      height,
    };
    return { rect, anchor: left ? 'end' : 'start' };
  });
  const free = options.find(
    ({ rect }) =>
      contains(bounds, rect) && !obstacles.some((o) => overlaps(rect, o)) && !avoid.some((p) => pointIn(rect, p)),
  );
  return free ?? options.find(({ rect }) => contains(bounds, rect)) ?? options[0];
}
