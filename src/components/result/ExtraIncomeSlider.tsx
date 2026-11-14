import type { Diagnosis } from '@/engine';
import { usd } from '@/engine/format';
import { EXTRA_INCOME_MAX, EXTRA_INCOME_STEP } from '@/lib/extraIncome';

type ExtraIncomeSliderProps = {
  extra: number;
  onChange: (extra: number) => void;
  /** The year with `extra` added, computed by the pure engine in the browser. */
  scenario: Diagnosis;
};

/** "What if I earn more?" Drag to see the repayment move, and jump at the cliff. */
export function ExtraIncomeSlider({ extra, onChange, scenario }: ExtraIncomeSliderProps) {
  const over = scenario.overCliff;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="extra-income" className="font-semibold">
          Extra income this year
        </label>
        <output htmlFor="extra-income" className="type-display text-3xl tabular text-violet">
          +{usd(extra)}
        </output>
      </div>
      <input
        id="extra-income"
        type="range"
        min={0}
        max={EXTRA_INCOME_MAX}
        step={EXTRA_INCOME_STEP}
        value={extra}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={`${usd(extra)} extra, ${usd(scenario.repayment)} repaid in April`}
        className="mt-3 h-11 w-full accent-violet"
      />
      <div className="flex justify-between text-sm text-gray-600" aria-hidden>
        <span>{usd(0)}</span>
        <span>{usd(EXTRA_INCOME_MAX)}</span>
      </div>
      <p
        role="status"
        className={`mt-3 text-lg font-semibold ${over ? 'text-cliff-strong' : 'text-gray-950'}`}
      >
        {extra === 0
          ? `Today you repay ${usd(scenario.repayment)}.`
          : over
            ? `Over the cliff: you repay ${usd(scenario.repayment)}, the whole credit.`
            : `You repay ${usd(scenario.repayment)}, with ${usd(scenario.headroom)} of room left.`}
      </p>
    </div>
  );
}
