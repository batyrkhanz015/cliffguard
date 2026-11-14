import { householdIncome, type Diagnosis, type HouseholdInput } from '@/engine';
import { usd } from '@/engine/format';
import { fplLabel, formatMoney } from '@/lib/money';

type Line = readonly [label: string, value: string];

function LineTable({ title, lines }: { title: string; lines: readonly Line[] }) {
  return (
    <div>
      <p className="type-eyebrow text-violet">{title}</p>
      <dl className="mt-3 divide-y divide-hairline text-sm">
        {lines.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-2">
            <dt className="text-gray-700">{label}</dt>
            <dd className="text-right font-semibold tabular">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function form8962Lines(input: HouseholdInput, d: Diagnosis): Line[] {
  const { slcsp } = d;
  return [
    ['Family size', String(input.householdSize)],
    ['Household income', usd(householdIncome(d.income.magi))],
    ['Federal poverty line', usd(d.fpl)],
    ['Household income as % of poverty line', fplLabel(d.fplPercent)],
    ['Applicable figure', d.applicableFigure === null ? 'None, over the cliff' : `${(d.applicableFigure * 100).toFixed(2)}%`],
    ['Annual contribution amount', usd(d.annualContribution)],
    [
      `Annual benchmark premium (${slcsp.source === 'manual' ? 'entered by you' : 'worked out from your credit'})`,
      usd(slcsp.annual),
    ],
    ['Premium tax credit allowed', usd(d.ptcAllowed)],
    ['Advance credit paid to your insurer', usd(d.aptcReceived)],
    ['Excess advance credit to repay', usd(d.repayment)],
    ['Repayment limitation', 'None for 2026'],
  ];
}

function magiLines(input: HouseholdInput, d: Diagnosis): Line[] {
  const { income } = d;
  const named = input.adults.map((adult) => [`${adult.label}'s self-employment profit`, formatMoney(income.seProfitByAdult[adult.id])] as const);
  const counted = input.adults.reduce((sum, { id }) => sum + income.seProfitByAdult[id], 0) - income.halfSeTax + income.wages + income.capGainsAllowed;
  return [
    ...named,
    ['Half of self-employment tax', formatMoney(-income.halfSeTax)],
    ['Wages', formatMoney(income.wages)],
    ['Capital gains counted', formatMoney(income.capGainsAllowed)],
    ['Interest, other income and deductions', formatMoney(income.magi - counted)],
    ['Your MAGI', formatMoney(income.magi)],
  ];
}

/** The Form 8962 preview and the MAGI breakdown behind the headline. */
export function HowWeGotThis({ input, diagnosis }: { input: HouseholdInput; diagnosis: Diagnosis }) {
  return (
    <details className="group rounded-md border border-hairline bg-white">
      <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 p-4 font-semibold text-violet">
        How we got this
        <span aria-hidden className="text-xl transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="grid gap-8 border-t border-hairline p-4 sm:grid-cols-2">
        <LineTable title="Form 8962 preview" lines={form8962Lines(input, diagnosis)} />
        <LineTable title="Your income, line by line" lines={magiLines(input, diagnosis)} />
      </div>
    </details>
  );
}
