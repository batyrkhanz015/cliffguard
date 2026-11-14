import type { GigCheckResult } from '@/engine';
import { usd } from '@/engine/format';
import { linePath, linearScale } from '@/components/chart/scale';
import { formatMoney } from '@/lib/money';
import { RoughEstimateNote } from './RoughEstimateNote';

type GigChartProps = {
  curve: GigCheckResult['curve'];
  lossZone: GigCheckResult['lossZone'];
  /** The offer being checked, marked on the chart and set by the slider. */
  gigAmount: number;
  onGigChange: (amount: number) => void;
};

const WIDTH = 360;
const HEIGHT = 230;
const PLOT = { left: 10, right: 350, top: 16, bottom: 196 } as const;
const SLIDER_STEP = 500;

/** What you keep from a gig of any size, with and without a plan. Losing money turns the band red. */
export function GigChart({ curve, lossZone, gigAmount, onGigChange }: GigChartProps) {
  const maxGig = curve[curve.length - 1].gig;
  const nets = curve.flatMap((point) => [point.netDoNothing, point.netWithPlan, 0]);
  const x = linearScale([0, maxGig], [PLOT.left, PLOT.right]);
  const y = linearScale([Math.min(...nets), Math.max(...nets)], [PLOT.bottom, PLOT.top]);
  const zeroY = y(0);
  const marked = Math.min(gigAmount, maxGig);
  const summary = lossZone
    ? `Net from a gig by size. Gigs between ${usd(lossZone.from)} and ${usd(lossZone.to)} leave you poorer than saying no.`
    : 'Net from a gig by size. No gig size leaves you poorer than saying no.';

  return (
    <figure>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={summary} className="h-auto w-full font-sans">
        {lossZone && (
          <rect
            x={x(lossZone.from)}
            y={PLOT.top}
            width={Math.max(x(lossZone.to) - x(lossZone.from), 2)}
            height={PLOT.bottom - PLOT.top}
            className="fill-cliff/15"
          />
        )}
        <line x1={PLOT.left} x2={PLOT.right} y1={zeroY} y2={zeroY} className="stroke-gray-400" />
        <path
          d={linePath(curve.map((point) => [x(point.gig), y(point.netDoNothing)]))}
          fill="none"
          className="stroke-cliff"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path
          d={linePath(curve.map((point) => [x(point.gig), y(point.netWithPlan)]))}
          fill="none"
          className="stroke-kept"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <line x1={x(marked)} x2={x(marked)} y1={PLOT.top} y2={PLOT.bottom} className="stroke-violet" strokeWidth={2} strokeDasharray="4 3" />

        {lossZone && (
          <text x={x(lossZone.from) + 4} y={PLOT.top + 10} className="fill-cliff-strong font-pixel" fontSize="9">
            Loss zone
          </text>
        )}
        <text x={PLOT.left} y={HEIGHT - 8} className="fill-gray-500 font-pixel" fontSize="9">
          {usd(0)}
        </text>
        <text x={WIDTH / 2} y={HEIGHT - 8} textAnchor="middle" className="fill-gray-500 font-pixel" fontSize="9">
          Size of the gig
        </text>
        <text x={PLOT.right} y={HEIGHT - 8} textAnchor="end" className="fill-gray-500 font-pixel" fontSize="9">
          {usd(maxGig)}
        </text>
      </svg>

      <figcaption className="mt-3 space-y-3 text-sm text-gray-700">
        <p className="flex flex-wrap gap-x-5 gap-y-1">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1 w-5 bg-cliff" />
            Doing nothing
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1 w-5 bg-kept" />
            With a plan
          </span>
          {lossZone && (
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="size-3 bg-cliff/15 ring-1 ring-cliff" />
              Loss zone: {usd(lossZone.from)} to {usd(lossZone.to)}
            </span>
          )}
        </p>
        <RoughEstimateNote />
      </figcaption>

      <div className="mt-4">
        <label htmlFor="gig-size" className="flex items-baseline justify-between gap-4 font-semibold">
          Try another size
          <output htmlFor="gig-size" className="type-display text-2xl tabular text-violet">
            {formatMoney(gigAmount)}
          </output>
        </label>
        <input
          id="gig-size"
          type="range"
          min={0}
          max={maxGig}
          step={SLIDER_STEP}
          value={marked}
          onChange={(event) => onGigChange(Number(event.target.value))}
          className="mt-2 h-11 w-full accent-violet"
        />
        {gigAmount > maxGig && (
          <p className="mt-1 text-sm text-gray-600">This offer is beyond the {usd(maxGig)} the chart covers.</p>
        )}
      </div>
    </figure>
  );
}
