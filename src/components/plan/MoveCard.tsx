import type { Liquidity } from '@/engine';
import { formatDate, usd } from '@/engine/format';
import { LockedAmount } from '@/components/plan/LockedAmount';
import { Card } from '@/components/ui/Card';
import type { LockedMove, UnlockedMove } from '@/lib/planView';

const LIQUIDITY_LABELS: Record<Liquidity, string> = {
  arrives_january: 'Arrives in January',
  planned_purchase: 'A purchase you planned',
  mostly_liquid: 'Mostly spendable',
  stays_invested: 'Stays invested',
  locked: 'Locked until retirement',
};

/** One step of the plan: what it is and when it ends. The amount is hidden until the plan is unlocked. */
export function MoveCard({ move }: { move: LockedMove | UnlockedMove }) {
  return (
    <Card as="li">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{move.name}</h3>
          <p className="mt-1 text-sm text-gray-600">Deadline {formatDate(move.deadline)}</p>
        </div>
        {move.locked ? (
          <LockedAmount id={move.name.replace(/\W+/g, '-')} />
        ) : (
          <p className="type-display text-2xl tabular text-kept">{usd(move.amount)}</p>
        )}
      </div>
      <p className="type-eyebrow mt-4 inline-block border border-hairline px-2 py-1 text-gray-700">
        {LIQUIDITY_LABELS[move.liquidity]}
      </p>
    </Card>
  );
}
