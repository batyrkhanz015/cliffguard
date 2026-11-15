'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GigCheckResult } from '@/engine';
import { useDeferredCommit } from '@/lib/useDeferredCommit';
import { usd } from '@/engine/format';
import { CHART } from '@/components/chart/palette';
import { formatMoney } from '@/lib/money';
import { GigPlot } from './GigPlot';
import { netLabel, offerNets, type ExactNets } from './offerNets';
import { RoughEstimateNote } from './RoughEstimateNote';

type GigChartProps = {
  curve: GigCheckResult['curve'];
  lossZone: GigCheckResult['lossZone'];
  /** The offer being checked, marked on the chart and set by the slider. */
  gigAmount: number;
  /** The engine's numbers for `gigAmount`; leave out while the result is for another offer. */
  exact?: ExactNets;
  onGigChange: (amount: number) => void;
};

const SLIDER_STEP = 500;
/** Quiet time after the last slider move before the offer is re-checked, if the user never releases. */
const COMMIT_DELAY_MS = 400;

/**
 * What you keep from a gig of any size, with and without a plan. Losing money turns the band red.
 * Dragging only moves the marker; the offer is re-checked once, when the slider is released.
 */
export function GigChart({ curve, lossZone, gigAmount, exact, onGigChange }: GigChartProps) {
  const [draft, setDraft] = useState<number | null>(null);
  const onGigChangeRef = useRef(onGigChange);
  useEffect(() => {
    onGigChangeRef.current = onGigChange;
  });
  const commit = useCallback(
    (amount: number) => {
      setDraft(null);
      if (amount > 0 && amount !== gigAmount) onGigChangeRef.current(amount);
    },
    [gigAmount],
  );
  const deferred = useDeferredCommit(commit, COMMIT_DELAY_MS);

  const shownAmount = draft ?? gigAmount;
  const maxGig = curve[curve.length - 1].gig;
  const marked = Math.min(shownAmount, maxGig);
  const summary = lossZone
    ? `Net from a gig by size. Gigs between ${usd(lossZone.from)} and ${usd(lossZone.to)} leave you poorer than saying no.`
    : 'Net from a gig by size. No gig size leaves you poorer than saying no.';
  const nets = offerNets(curve, marked, exact, draft !== null);

  return (
    <figure>
      <p className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-700">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-4 rounded-full" style={{ backgroundColor: CHART.plan }} />
          With a plan
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-4 rounded-full" style={{ backgroundColor: CHART.doNothing }} />
          Doing nothing
        </span>
      </p>
      <GigPlot curve={curve} lossZone={lossZone} marked={marked} nets={nets} summary={summary} />
      <figcaption className="mt-3 space-y-3 text-sm text-gray-700">
        <div className="sr-only">
        <table>
          <caption>Key points on the gig curve</caption>
          <tbody>
            <tr>
              <th>Your offer</th>
              <td>{usd(marked)}</td>
              <td>With a plan {netLabel(nets.netWithPlan, nets.approximate)}</td>
              <td>Doing nothing {netLabel(nets.netDoNothing, nets.approximate)}</td>
            </tr>
            <tr>
              <th>Loss zone</th>
              <td>{lossZone ? `${usd(lossZone.from)} to ${usd(lossZone.to)}` : 'None'}</td>
            </tr>
          </tbody>
        </table>
        </div>
        <RoughEstimateNote />
      </figcaption>

      <div className="mt-4">
        <label htmlFor="gig-size" className="flex items-baseline justify-between gap-4 font-semibold">
          Try another size
          <output htmlFor="gig-size" className="type-display text-2xl tabular text-violet">
            {formatMoney(shownAmount)}
          </output>
        </label>
        <input
          id="gig-size"
          type="range"
          min={0}
          max={maxGig}
          step={SLIDER_STEP}
          value={marked}
          onChange={(event) => {
            const amount = Number(event.target.value);
            setDraft(amount);
            deferred.schedule(amount);
          }}
          onPointerUp={deferred.flush}
          onKeyUp={deferred.flush}
          onBlur={deferred.flush}
          aria-valuetext={`${formatMoney(shownAmount)} gig`}
          className="mt-2 h-11 w-full accent-violet"
        />
        {gigAmount > maxGig && (
          <p className="mt-1 text-sm text-gray-600">This offer is beyond the {usd(maxGig)} the chart covers.</p>
        )}
      </div>
    </figure>
  );
}
