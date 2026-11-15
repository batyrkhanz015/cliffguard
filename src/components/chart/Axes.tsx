import { CHART, type Plot } from './palette';
import type { Scale } from './scale';

type YAxisProps = { ticks: readonly number[]; y: Scale; plot: Plot; format: (tick: number) => string };

/** Light horizontal gridlines with tick labels at their left, and a darker line at zero. */
export function YAxis({ ticks, y, plot, format }: YAxisProps) {
  return (
    <g>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={plot.left} x2={plot.right} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? CHART.baseline : CHART.grid} />
          <text
            x={plot.left - 8}
            y={y(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            fill={CHART.tick}
            fontSize={12}
            className="tabular-nums"
          >
            {format(tick)}
          </text>
        </g>
      ))}
    </g>
  );
}

type XAxisProps = { ticks: readonly number[]; x: Scale; plot: Plot; format: (tick: number) => string; title: string };

/** Tick labels under the plot, with a small sentence-case title beneath them. */
export function XAxis({ ticks, x, plot, format, title }: XAxisProps) {
  return (
    <g>
      {ticks.map((tick) => (
        <text key={tick} x={x(tick)} y={plot.bottom + 18} textAnchor="middle" fill={CHART.tick} fontSize={12} className="tabular-nums">
          {format(tick)}
        </text>
      ))}
      <text x={(plot.left + plot.right) / 2} y={plot.bottom + 40} textAnchor="middle" fill={CHART.tick} fontSize={12}>
        {title}
      </text>
    </g>
  );
}
