'use client';

import { useMemo } from 'react';
import type { Diagnosis, HouseholdInput } from '@/engine';
import { usd } from '@/engine/format';
import { XAxis, YAxis } from '@/components/chart/Axes';
import { ChartTooltip } from '@/components/chart/ChartTooltip';
import { estimateTextWidth, placeLabel, type Placement, type Rect } from '@/components/chart/labels';
import { CHART, type Plot } from '@/components/chart/palette';
import { compactUsd, linePath, linearScale, niceStep, niceTicks } from '@/components/chart/scale';
import { useChartSize } from '@/components/chart/useChartSize';
import { useCrosshair } from '@/components/chart/useCrosshair';
import { cliffCurve } from '@/lib/cliffCurve';

/** A dot on the curve: where the household stands, or would stand, and what it repays there. */
export type ChartMark = { id: string; label: string; magi: number; repayment: number; tone: 'now' | 'scenario' };

type CliffChartProps = { input: HouseholdInput; diagnosis: Diagnosis; marks: readonly ChartMark[] };

const MARGIN = { top: 20, right: 20, bottom: 52 } as const;
const LABEL_HEIGHT = 16;
const DOT_RADIUS = 5;
const MARK_COLORS = { now: CHART.doNothing, scenario: CHART.scenario } as const;

/** What you repay in April, against your income. It falls off a wall at the cliff. */
export function CliffChart({ input, diagnosis, marks }: CliffChartProps) {
  const { ref, width, height, compact } = useChartSize();
  const curve = useMemo(
    () => cliffCurve(input, diagnosis, [diagnosis.income.magi, ...marks.map((mark) => mark.magi)]),
    [input, diagnosis, marks],
  );
  const first = curve[0].magi;
  const last = curve[curve.length - 1].magi;
  const topRepayment = Math.max(...curve.map((point) => point.repayment), 1);

  const yTicks = niceTicks(0, topRepayment, compact ? 4 : 5);
  const yStep = yTicks.length > 1 ? yTicks[1] - yTicks[0] : 1;
  const xStep = niceStep(last - first, compact ? 3 : 5);
  const xTicks = niceTicks(first, last, compact ? 3 : 5).filter((tick) => tick >= first && tick <= last);

  const plot: Plot = { left: compact ? 44 : 52, right: width - MARGIN.right, top: MARGIN.top, bottom: height - MARGIN.bottom };
  const x = linearScale([first, last], [plot.left, plot.right]);
  const y = linearScale([0, yTicks[yTicks.length - 1]], [plot.bottom, plot.top]);
  const wallX = x(diagnosis.cliff);

  const points = curve.map((point): [number, number] => [x(point.magi), y(point.repayment)]);
  const area = `${linePath(points)} L${plot.right} ${plot.bottom} L${plot.left} ${plot.bottom} Z`;
  const crosshair = useCrosshair(points.map(([px]) => px));
  const hovered = crosshair.index === null ? null : curve[crosshair.index];

  const { cliffLabel, placements } = placeAnnotations({ marks, diagnosis, plot, x, y, wallX, points, compact });
  const afterCliff = curve.find((point) => point.magi === diagnosis.cliff + 1);
  const summary = `Repayment against income, from ${usd(first)} to ${usd(last)}. It reaches ${usd(topRepayment)} at the ${usd(diagnosis.cliff)} cliff.`;

  return (
    <figure>
      <div ref={ref} className="relative">
        <svg width={width} height={height} role="img" aria-label={summary} className="block font-sans">
          <YAxis ticks={yTicks} y={y} plot={plot} format={(tick) => compactUsd(tick, yStep)} />
          <XAxis ticks={xTicks} x={x} plot={plot} format={(tick) => compactUsd(tick, xStep)} title="Your 2026 income" />

          <rect x={wallX} y={plot.top} width={plot.right - wallX} height={plot.bottom - plot.top} fill={CHART.cliff} opacity={0.07} />
          <path d={area} fill={CHART.doNothing} opacity={0.1} />
          <path d={linePath(points)} fill="none" stroke={CHART.doNothing} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <line x1={wallX} x2={wallX} y1={plot.top} y2={plot.bottom} stroke={CHART.cliff} />

          <rect x={cliffLabel.swatchX} y={cliffLabel.y + 4} width={8} height={8} fill={CHART.cliff} />
          <text x={cliffLabel.textX} y={cliffLabel.y + 8} dominantBaseline="middle" fill={CHART.ink} fontSize={12} fontWeight={500}>
            {cliffLabel.text}
          </text>

          <Leader marks={marks} x={x} y={y} />
          {hovered !== null && (
            <g>
              <line x1={x(hovered.magi)} x2={x(hovered.magi)} y1={plot.top} y2={plot.bottom} stroke={CHART.baseline} />
              <circle cx={x(hovered.magi)} cy={y(hovered.repayment)} r={4} fill={CHART.doNothing} stroke={CHART.surface} strokeWidth={2} />
            </g>
          )}
          {marks.map((mark, i) => (
            <g key={mark.id}>
              <circle
                cx={x(mark.magi)}
                cy={y(mark.repayment)}
                r={DOT_RADIUS}
                fill={MARK_COLORS[mark.tone]}
                stroke={CHART.surface}
                strokeWidth={2}
              />
              <text
                x={placements[i].anchor === 'start' ? placements[i].rect.x : placements[i].rect.x + placements[i].rect.width}
                y={placements[i].rect.y + LABEL_HEIGHT / 2}
                textAnchor={placements[i].anchor}
                dominantBaseline="middle"
                fill={CHART.ink}
                fontSize={12}
                fontWeight={500}
                stroke={CHART.surface}
                strokeWidth={3}
                paintOrder="stroke"
                className="tabular-nums"
              >
                {markText(mark, compact)}
              </text>
            </g>
          ))}

          <rect
            x={plot.left}
            y={plot.top}
            width={plot.right - plot.left}
            height={plot.bottom - plot.top}
            fill="transparent"
            {...crosshair.handlers}
          />
        </svg>
        {hovered !== null && (
          <ChartTooltip
            x={x(hovered.magi)}
            top={plot.top + 4}
            chartWidth={width}
            title={`Income ${usd(hovered.magi)}`}
            rows={[{ label: "You'd repay", value: usd(hovered.repayment), color: CHART.doNothing }]}
          />
        )}
      </div>
      <figcaption className="sr-only">
        <table>
          <caption>Key points on the repayment curve</caption>
          <tbody>
            {marks.map((mark) => (
              <tr key={mark.id}>
                <th>{mark.label}</th>
                <td>{usd(mark.magi)} income</td>
                <td>{usd(mark.repayment)} repaid</td>
              </tr>
            ))}
            <tr>
              <th>At the cliff</th>
              <td>{usd(diagnosis.cliff)} income</td>
              <td>{usd(curve.find((point) => point.magi === diagnosis.cliff)?.repayment ?? 0)} repaid</td>
            </tr>
            <tr>
              <th>Just over the cliff</th>
              <td>{usd(diagnosis.cliff + 1)} income</td>
              <td>{usd(afterCliff?.repayment ?? 0)} repaid</td>
            </tr>
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}

/** On a phone the word "repay" goes, to keep labels clear of each other and of the edges. */
const markText = (mark: ChartMark, compact: boolean): string =>
  `${mark.label} · ${compact ? '' : 'repay '}${usd(mark.repayment)}`;

type Scales = { x: (value: number) => number; y: (value: number) => number };

/** A thin line from the first mark to each later one. */
function Leader({ marks, x, y }: { marks: readonly ChartMark[] } & Scales) {
  const [origin, ...rest] = marks;
  return (
    <g>
      {rest.map((mark) => (
        <line key={mark.id} x1={x(origin.magi)} y1={y(origin.repayment)} x2={x(mark.magi)} y2={y(mark.repayment)} stroke={CHART.baseline} />
      ))}
    </g>
  );
}

type Annotations = {
  cliffLabel: { text: string; swatchX: number; textX: number; y: number };
  placements: Placement[];
};

/** Places the cliff label, then each mark's label clear of it, of earlier labels and of the curve. */
function placeAnnotations(args: {
  marks: readonly ChartMark[];
  diagnosis: Diagnosis;
  plot: Plot;
  wallX: number;
  points: ReadonlyArray<readonly [number, number]>;
  compact: boolean;
} & Scales): Annotations {
  const { marks, diagnosis, plot, wallX, points, compact, x, y } = args;
  const text = `Cliff · ${usd(diagnosis.cliff)}`;
  const labelWidth = estimateTextWidth(text) + 14;
  const onLeft = wallX - 8 - labelWidth >= plot.left;
  const left = onLeft ? wallX - 8 - labelWidth : wallX + 8;
  const cliffRect: Rect = { x: left, y: plot.top + 2, width: labelWidth, height: LABEL_HEIGHT };

  const bounds: Rect = { x: plot.left, y: plot.top, width: plot.right - plot.left, height: plot.bottom - plot.top };
  const obstacles: Rect[] = [cliffRect];
  const placements = marks.map((mark) => {
    const size = { width: estimateTextWidth(markText(mark, compact)), height: LABEL_HEIGHT };
    const placement = placeLabel([x(mark.magi), y(mark.repayment)], size, {
      candidates: mark.tone === 'now' ? ['above-left', 'below-left', 'above-right', 'below-right'] : ['above-left', 'below-left', 'left', 'below-right', 'above-right'],
      bounds,
      obstacles,
      avoid: points,
      gap: 12,
    });
    obstacles.push(placement.rect);
    return placement;
  });
  return { cliffLabel: { text, swatchX: left, textX: left + 14, y: cliffRect.y }, placements };
}
