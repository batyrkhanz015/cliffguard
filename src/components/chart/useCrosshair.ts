import { useState, type PointerEvent } from 'react';

/** The index of the nearest x position under the pointer; null when it is away from the plot. */
export function useCrosshair(positions: readonly number[]) {
  const [index, setIndex] = useState<number | null>(null);

  const onPointerMove = (event: PointerEvent<SVGRectElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (svg === null) return;
    const pointerX = event.clientX - svg.getBoundingClientRect().left;
    let best = 0;
    positions.forEach((position, i) => {
      if (Math.abs(position - pointerX) < Math.abs(positions[best] - pointerX)) best = i;
    });
    setIndex(best);
  };

  return { index, handlers: { onPointerMove, onPointerDown: onPointerMove, onPointerLeave: () => setIndex(null) } };
}
