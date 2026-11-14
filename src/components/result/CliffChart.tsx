'use client';

import { useMemo } from 'react';
import type { Diagnosis, HouseholdInput } from '@/engine';
import { usd } from '@/engine/format';
import { linePath, linearScale } from '@/components/chart/scale';
import { cliffCurve } from '@/lib/cliffCurve';

/** A dot on the curve: where the household stands, or would stand, and what it repays there. */
export type ChartMark = { id: string; label: string; magi: number; repayment: number; tone: 'now' | 'scenario' };

type CliffChartProps = { input: HouseholdInput; diagnosis: Diagnosis; marks: readonly ChartMark[] };

const WIDTH = 360;
const HEIGHT = 230;
const PLOT = { left: 10, right: 350, top: 16, bottom: 196 } as const;
const DOT_TONES = { now: 'fill-violet stroke-white', scenario: 'fill-white stroke-violet' } as const;

/** What you repay in April, against your income. It falls off a wall at the cliff. */
export function CliffChart({ input, diagnosis, marks }: CliffChartProps) {
  const curve = useMemo(
    () => cliffCurve(input, diagnosis, [diagnosis.income.magi, ...marks.map((mark) => mark.magi)]),
    [input, diagnosis, marks],
  );
  const first = curve[0].magi;
  const last = curve[curve.length - 1].magi;
  const topRepayment = Math.max(...curve.map((point) => point.repayment), 1);

  const x = linearScale([first, last], [PLOT.left, PLOT.right]);
  const y = linearScale([0, topRepayment], [PLOT.bottom, PLOT.top]);
  const wallX = x(diagnosis.cliff);
  const summary = `Repayment against income, from ${usd(first)} to ${usd(last)}. It reaches ${usd(topRepayment)} at the ${usd(diagnosis.cliff)} cliff.`;

  return (
    <figure>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={summary} className="h-auto w-full font-sans">
        <rect
          x={wallX}
          y={PLOT.top}
          width={PLOT.right - wallX}
          height={PLOT.bottom - PLOT.top}
          className="fill-cliff/10"
        />
        <line x1={PLOT.left} x2={PLOT.right} y1={PLOT.bottom} y2={PLOT.bottom} className="stroke-gray-400" />
        <path
          d={linePath(curve.map((point) => [x(point.magi), y(point.repayment)]))}
          fill="none"
          className="stroke-violet"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <line x1={wallX} x2={wallX} y1={PLOT.top} y2={PLOT.bottom} className="stroke-cliff" strokeWidth={3} />

        <text x={wallX - 6} y={PLOT.top + 8} textAnchor="end" className="fill-cliff-strong font-pixel" fontSize="9">
          Cliff {usd(diagnosis.cliff)}
        </text>
        <text x={PLOT.left} y={PLOT.top - 4} className="fill-gray-500 font-pixel" fontSize="9">
          Repay {usd(topRepayment)}
        </text>
        <text x={PLOT.left} y={HEIGHT - 8} className="fill-gray-500 font-pixel" fontSize="9">
          {usd(first)}
        </text>
        <text x={PLOT.right} y={HEIGHT - 8} textAnchor="end" className="fill-gray-500 font-pixel" fontSize="9">
          {usd(last)}
        </text>
        <text x={WIDTH / 2} y={HEIGHT - 8} textAnchor="middle" className="fill-gray-500 font-pixel" fontSize="9">
          Your income
        </text>

        {marks.map((mark) => (
          <circle
            key={mark.id}
            cx={x(mark.magi)}
            cy={y(mark.repayment)}
            r={6}
            strokeWidth={2.5}
            className={DOT_TONES[mark.tone]}
          />
        ))}
      </svg>
      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-700">
        {marks.map((mark) => (
          <span key={mark.id} className="inline-flex items-center gap-2">
            <span aria-hidden className={`size-3 rounded-full border-2 border-violet ${mark.tone === 'now' ? 'bg-violet' : 'bg-white'}`} />
            {mark.label}: {usd(mark.repayment)} repaid at {usd(mark.magi)}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
