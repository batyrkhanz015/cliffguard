type TooltipRow = { label: string; value: string; color: string };

type ChartTooltipProps = { x: number; top: number; chartWidth: number; title: string; rows: readonly TooltipRow[] };

const GAP = 12;
const FLIP_AT = 200;

/** A small card beside the crosshair; it flips to the left of the line near the chart's right edge. */
export function ChartTooltip({ x, top, chartWidth, title, rows }: ChartTooltipProps) {
  const flip = x + GAP + FLIP_AT > chartWidth;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md"
      style={{ left: x + (flip ? -GAP : GAP), top, transform: flip ? 'translateX(-100%)' : undefined }}
    >
      <p className="font-medium text-gray-900">{title}</p>
      <ul className="mt-1 space-y-0.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-2 whitespace-nowrap">
            <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: row.color }} />
            <span className="text-gray-500">{row.label}</span>
            <strong className="ml-auto pl-2 font-semibold tabular-nums text-gray-900">{row.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
