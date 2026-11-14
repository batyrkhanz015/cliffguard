import type { Liquidity } from '@/engine';
import { formatDate, usd } from '@/engine/format';
import { Card } from '@/components/ui/Card';
import type { LockedMove, UnlockedMove } from '@/lib/planView';

const LIQUIDITY_LABELS: Record<Liquidity, string> = {
  arrives_january: 'Arrives in January',
  planned_purchase: 'A purchase you planned',
  mostly_liquid: 'Mostly spendable',
  stays_invested: 'Stays invested',
  locked: 'Locked until retirement',
};

function LockIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="7" width="10" height="7" rx="1" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

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
          <p
            className="type-display inline-flex items-center gap-2 text-2xl tabular text-gray-500"
            aria-label="Amount locked"
          >
            <LockIcon />
            <span aria-hidden>$•,•••</span>
          </p>
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
