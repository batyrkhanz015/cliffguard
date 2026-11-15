'use client';

import type { GigCheckResult } from '@/engine';
import { usd } from '@/engine/format';
import { XAxis, YAxis } from '@/components/chart/Axes';
import { ChartTooltip } from '@/components/chart/ChartTooltip';
import { estimateTextWidth, placeLabel, type Rect } from '@/components/chart/labels';
import { CHART, type Plot } from '@/components/chart/palette';
import { compactUsd, linePath, linearScale, niceStep, niceTicks, signedUsd } from '@/components/chart/scale';
import { useChartSize } from '@/components/chart/useChartSize';
import { useCrosshair } from '@/components/chart/useCrosshair';

type Curve = GigCheckResult['curve'];
type GigPlotProps = { curve: Curve; lossZone: GigCheckResult['lossZone']; marked: number; summary: string };

const MARGIN = { top: 40, right: 20, bottom: 52 } as const;
const ZONE_DETAIL = 'Taking it leaves you worse off';
const PILL_HEIGHT = 22;
const LABEL_HEIGHT = 16;

/** The value of a series at `gig`, read between the two nearest curve points. */
function valueAt(curve: Curve, gig: number, pick: (point: Curve[number]) => number): number {
  const after = curve.findIndex((point) => point.gig >= gig);
  if (after <= 0) return pick(curve[Math.max(after, 0)]);
  const [a, b] = [curve[after - 1], curve[after]];
  return pick(a) + ((gig - a.gig) / (b.gig - a.gig)) * (pick(b) - pick(a));
}

/** What you keep from a gig of any size, with and without a plan, with the loss zone and the offer marked. */
export function GigPlot({ curve, lossZone, marked, summary }: GigPlotProps) {
  const { ref, width, height, compact } = useChartSize();
  const maxGig = curve[curve.length - 1].gig;
  const nets = curve.flatMap((point) => [point.netDoNothing, point.netWithPlan, 0]);
  const yTicks = niceTicks(Math.min(...nets), Math.max(...nets), compact ? 4 : 5);
  const yStep = yTicks.length > 1 ? yTicks[1] - yTicks[0] : 1;
  const xStep = niceStep(maxGig, compact ? 3 : 6);
  const xTicks = niceTicks(0, maxGig, compact ? 3 : 6);

  const plot: Plot = { left: compact ? 48 : 56, right: width - MARGIN.right, top: MARGIN.top, bottom: height - MARGIN.bottom };
  const x = linearScale([0, maxGig], [plot.left, plot.right]);
  const y = linearScale([yTicks[0], yTicks[yTicks.length - 1]], [plot.bottom, plot.top]);

  const nothingPoints = curve.map((p): [number, number] => [x(p.gig), y(p.netDoNothing)]);
  const planPoints = curve.map((p): [number, number] => [x(p.gig), y(p.netWithPlan)]);
  const crosshair = useCrosshair(curve.map((point) => x(point.gig)));
  const hovered = crosshair.index === null ? null : curve[crosshair.index];

  const offerX = x(marked);
  const pillText = `Your offer · ${usd(marked)}`;
  const pillWidth = estimateTextWidth(pillText) + 20;
  const pill: Rect = {
    x: Math.min(Math.max(offerX - pillWidth / 2, plot.left), plot.right - pillWidth),
    y: plot.top - PILL_HEIGHT - 6,
    width: pillWidth,
    height: PILL_HEIGHT,
  };

  const zone = lossZone === null ? null : { left: x(lossZone.from), right: x(lossZone.to) };
  const zoneLabel: Rect | null =
    zone === null ? null : { x: zone.left + 6, y: plot.top + 6, width: Math.min(estimateTextWidth(ZONE_DETAIL) + 14, plot.right - zone.left - 6), height: 34 };
  const showZoneDetail = zoneLabel !== null && estimateTextWidth(ZONE_DETAIL) + 14 <= plot.right - (zoneLabel.x - 6) - 6;

  const offerDots = [
    { id: 'plan', value: valueAt(curve, marked, (p) => p.netWithPlan), color: CHART.plan },
    { id: 'nothing', value: valueAt(curve, marked, (p) => p.netDoNothing), color: CHART.doNothing },
  ].map((dot) => ({ ...dot, cy: y(dot.value) }));
  const bounds: Rect = { x: plot.left, y: plot.top, width: plot.right - plot.left, height: plot.bottom - plot.top };
  const obstacles: Rect[] = zoneLabel === null ? [] : [zoneLabel];
  const dotLabels = offerDots.map((dot) => {
    const text = signedUsd(dot.value);
    const placed = placeLabel([offerX, dot.cy], { width: estimateTextWidth(text), height: LABEL_HEIGHT }, {
      candidates: dot.id === 'plan' ? ['above-right', 'above-left', 'below-right', 'below-left'] : ['below-right', 'below-left', 'above-right', 'above-left'],
      bounds,
      obstacles,
      avoid: [...nothingPoints, ...planPoints],
      gap: 9,
    });
    obstacles.push(placed.rect);
    return { text, ...placed };
  });

  return (
    <div ref={ref} className="relative">
      <svg width={width} height={height} role="img" aria-label={summary} className="block font-sans">
        <YAxis ticks={yTicks} y={y} plot={plot} format={(tick) => compactUsd(tick, yStep)} />
        <XAxis ticks={xTicks} x={x} plot={plot} format={(tick) => compactUsd(tick, xStep)} title="Size of the gig" />

        {zone !== null && zoneLabel !== null && (
          <g>
            <rect x={zone.left} y={plot.top} width={Math.max(zone.right - zone.left, 2)} height={plot.bottom - plot.top} fill={CHART.cliff} opacity={0.08} />
            <rect x={zoneLabel.x} y={zoneLabel.y + 4} width={8} height={8} fill={CHART.cliff} />
            <text x={zoneLabel.x + 14} y={zoneLabel.y + 8} dominantBaseline="middle" fill={CHART.ink} fontSize={12} fontWeight={500} stroke={CHART.surface} strokeWidth={3} paintOrder="stroke">
              Loss zone
            </text>
            {showZoneDetail && (
              <text x={zoneLabel.x + 14} y={zoneLabel.y + 26} dominantBaseline="middle" fill={CHART.ink} fontSize={12} stroke={CHART.surface} strokeWidth={3} paintOrder="stroke">
                {ZONE_DETAIL}
              </text>
            )}
          </g>
        )}

        <path d={linePath(nothingPoints)} fill="none" stroke={CHART.doNothing} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <path d={linePath(planPoints)} fill="none" stroke={CHART.plan} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {hovered !== null && <line x1={x(hovered.gig)} x2={x(hovered.gig)} y1={plot.top} y2={plot.bottom} stroke={CHART.baseline} />}

        <line x1={offerX} x2={offerX} y1={pill.y + PILL_HEIGHT} y2={plot.bottom} stroke={CHART.scenario} />
        <rect x={pill.x} y={pill.y} width={pill.width} height={pill.height} rx={11} fill={CHART.scenario} />
        <text x={pill.x + pill.width / 2} y={pill.y + PILL_HEIGHT / 2} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={12} fontWeight={500}>
          {pillText}
        </text>
        {offerDots.map((dot, i) => (
          <g key={dot.id}>
            <circle cx={offerX} cy={dot.cy} r={5} fill={dot.color} stroke={CHART.surface} strokeWidth={2} />
            <text
              x={dotLabels[i].anchor === 'start' ? dotLabels[i].rect.x : dotLabels[i].rect.x + dotLabels[i].rect.width}
              y={dotLabels[i].rect.y + LABEL_HEIGHT / 2}
              textAnchor={dotLabels[i].anchor}
              dominantBaseline="middle"
              fill={CHART.ink}
              fontSize={12}
              fontWeight={500}
              stroke={CHART.surface}
              strokeWidth={3}
              paintOrder="stroke"
              className="tabular-nums"
            >
              {dotLabels[i].text}
            </text>
          </g>
        ))}

        <rect x={plot.left} y={plot.top} width={plot.right - plot.left} height={plot.bottom - plot.top} fill="transparent" {...crosshair.handlers} />
      </svg>
      {hovered !== null && (
        <ChartTooltip
          x={x(hovered.gig)}
          top={plot.top + 4}
          chartWidth={width}
          title={`Gig of ${usd(hovered.gig)}`}
          rows={[
            { label: 'With a plan', value: signedUsd(hovered.netWithPlan), color: CHART.plan },
            { label: 'Doing nothing', value: signedUsd(hovered.netDoNothing), color: CHART.doNothing },
          ]}
        />
      )}
    </div>
  );
}
