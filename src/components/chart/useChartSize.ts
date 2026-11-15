import { useEffect, useRef, useState } from 'react';

const PHONE_MAX = 480;

/**
 * The drawn width of a chart's container, so the SVG is drawn 1:1 and 12px text stays 12px.
 * `width` is 0 until measured: draw nothing then, so a wide first render never stretches the layout.
 */
export function useChartSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (element === null) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(element);
    setWidth(Math.round(element.getBoundingClientRect().width));
    return () => observer.disconnect();
  }, []);

  const compact = width < PHONE_MAX;
  /** About 16:9 on desktop, closer to 4:3 on a phone. */
  const height = Math.max(Math.round(width * (compact ? 0.85 : 0.5)), 240);
  return { ref, width, height, compact };
}
