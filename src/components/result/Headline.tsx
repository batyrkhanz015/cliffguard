import type { Diagnosis } from '@/engine';
import { usd } from '@/engine/format';
import { Card } from '@/components/ui/Card';
import { fplLabel } from '@/lib/money';

type StatProps = { label: string; value: string; tone?: 'default' | 'loss' | 'kept' };

const TONES = { default: 'text-white', loss: 'text-cliff', kept: 'text-kept' } as const;

function Stat({ label, value, tone = 'default' }: StatProps) {
  return (
    <div>
      <dt className="type-eyebrow text-gray-400">{label}</dt>
      <dd className={`type-display mt-2 text-3xl tabular sm:text-4xl ${TONES[tone]}`}>{value}</dd>
    </div>
  );
}

function headlineFor(d: Diagnosis): string[] {
  switch (d.zone) {
    case 'over':
      return ['You are', `${usd(-d.headroom)} over`, 'the cliff'];
    case 'below_100':
      return ['Your income is', 'below the', 'poverty line'];
    case 'near':
    case 'clear':
      return ['You are', `${usd(d.headroom)} under`, 'the cliff'];
  }
}

/** The year at a glance: MAGI, where it sits against the cliff and what you'd repay in April. */
export function Headline({ diagnosis }: { diagnosis: Diagnosis }) {
  const lines = headlineFor(diagnosis);
  const over = diagnosis.zone === 'over';
  return (
    <Card surface="dark" className="sm:p-8">
      <p className="type-eyebrow text-violet-link">Your 2026 year</p>
      <h1 className="type-display mt-3 text-4xl sm:text-6xl">
        {lines.map((line, i) => (
          <span key={line} className={`block ${i === 1 ? (over ? 'text-cliff' : 'text-kept') : ''}`}>
            {line}
          </span>
        ))}
      </h1>
      <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
        <Stat label="Your MAGI" value={usd(diagnosis.income.magi)} />
        <Stat label="% of poverty line" value={fplLabel(diagnosis.fplPercent)} />
        <Stat label="The cliff" value={usd(diagnosis.cliff)} />
        <Stat
          label={over ? 'Over by' : 'Room left'}
          value={usd(diagnosis.headroom)}
          tone={over ? 'loss' : 'kept'}
        />
      </dl>
      <div className="mt-8 border-t border-violet/40 pt-6">
        <p className="type-eyebrow text-gray-400">If nothing changes, you repay in April</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className={`type-display text-5xl tabular ${diagnosis.repayment > 0 ? 'text-cliff' : 'text-kept'}`}>
            {usd(diagnosis.repayment)}
          </span>
          <span className="type-eyebrow bg-violet px-2 py-1 text-white">No cap from 2026</span>
        </div>
      </div>
    </Card>
  );
}
