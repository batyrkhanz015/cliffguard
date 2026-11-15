import type { PlanVerdict } from '@/engine';
import { usd } from '@/engine/format';
import { Button } from '@/components/ui/Button';
import type { PlanView } from '@/lib/planView';

const LABELS: Record<PlanVerdict, { text: string; tone: string }> = {
  under_line: { text: 'Under the line', tone: 'bg-kept text-night' },
  worth_it: { text: 'Worth the moves', tone: 'bg-kept text-night' },
  costly: { text: 'Costly to stay under', tone: 'bg-violet text-white' },
  needs_retirement_moves: { text: 'Needs retirement moves', tone: 'bg-violet text-white' },
  not_worth_fighting: { text: 'Not worth fighting', tone: 'bg-cliff text-white' },
};

type VerdictBadgeProps = {
  plan: PlanView;
  /** Extra owed at filing for $1,000 more income (from the diagnosis). */
  per1000: number;
  onAllowRetirement: () => void;
};

/** The plan's verdict, and what it means in plain words for the states that change the next step. */
export function VerdictBadge({ plan, per1000, onAllowRetirement }: VerdictBadgeProps) {
  const { text, tone } = LABELS[plan.verdict];
  return (
    <div>
      <p className={`type-eyebrow inline-block px-3 py-2 ${tone}`}>{text}</p>

      {plan.verdict === 'under_line' && (
        <div className="mt-4 space-y-3">
          <p className="text-lg font-semibold">
            You&apos;re under the line. No rescue needed. Each $1,000 more costs you about {usd(per1000)} of credit.
          </p>
          <p className="text-gray-700">
            Income moves around. A monthly check-in tells you before it drifts toward the line.
          </p>
        </div>
      )}

      {plan.verdict === 'not_worth_fighting' && plan.setAside !== null && (
        <div className="mt-4 rounded-md border border-cliff bg-cliff-soft p-4">
          <p className="type-eyebrow text-cliff-strong">Set aside for April</p>
          <p className="type-display mt-1 text-4xl tabular text-cliff-strong">{usd(plan.setAside)}</p>
          <p className="mt-2 text-gray-800">
            No legal move gets you under the line. Put this aside now so April holds no surprise.
          </p>
        </div>
      )}

      {plan.verdict === 'needs_retirement_moves' && (
        <div className="mt-4 space-y-3">
          <p className="text-lg font-semibold">
            Moves that keep your cash can&apos;t get you under the line. Retirement contributions can.
          </p>
          <Button onClick={onAllowRetirement}>Allow retirement moves?</Button>
        </div>
      )}
    </div>
  );
}
