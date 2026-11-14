import { usd } from '@/engine/format';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatMoney } from '@/lib/money';
import type { PlanSummary } from '@/lib/planView';

type TotalsProps = {
  plan: PlanSummary;
  /** What the gig leaves you with after the plan, when a gig is being checked. */
  netKept: number | null;
  /** True while the plan is being recomputed; the figures shimmer. */
  loading: boolean;
};

function Figure({ label, value, loading, tone = '' }: { label: string; value: string; loading: boolean; tone?: string }) {
  return (
    <div>
      <dt className="type-eyebrow text-gray-400">{label}</dt>
      <dd className={`type-display mt-2 text-3xl tabular ${tone}`}>
        {loading ? <Skeleton className="h-8 w-28 bg-white/20" /> : value}
      </dd>
    </div>
  );
}

/** What the plan does to the April bill. These stay visible when the exact amounts are locked. */
export function Totals({ plan, netKept, loading }: TotalsProps) {
  const { totals } = plan;
  return (
    <Card surface="dark" className="sm:p-8">
      <p className="type-eyebrow text-violet-link">What the plan does</p>
      <dl aria-busy={loading || undefined} className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6">
        <Figure label="You repay now" value={usd(plan.repaymentBefore)} loading={loading} tone="text-cliff" />
        <Figure label="You repay after" value={usd(plan.repaymentAfter)} loading={loading} tone="text-kept" />
        {netKept !== null && (
          <Figure label="Net you keep from the gig" value={formatMoney(netKept)} loading={loading} tone="text-kept" />
        )}
        <Figure label="Cash you commit" value={usd(totals.cashCommitted)} loading={loading} />
        <Figure label="Locked in retirement" value={usd(totals.lockedInRetirement)} loading={loading} />
        <Figure label="Moved to next year" value={usd(totals.deferredToNextYear)} loading={loading} />
      </dl>
    </Card>
  );
}
