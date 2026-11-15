'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { moveKey } from '@/lib/keys';
import { usePlanPreview } from '@/lib/usePlanPreview';
import type { LoadedHousehold } from '@/lib/useHousehold';
import { KeepMyCashToggle } from './KeepMyCashToggle';
import { LeverList } from './LeverList';
import { MoveCard } from './MoveCard';
import { SampleBanner } from '@/components/result/SampleBanner';
import { Totals } from './Totals';
import { VerdictBadge } from './VerdictBadge';

/**
 * The plan preview (S4): verdict, Keep my cash, lever order and totals. The exact moves, the
 * paywall and the unlock come from `PlanAccess`, which the plan layout renders below this.
 */
export function PlanPreview({ household }: { household: LoadedHousehold }) {
  const preview = usePlanPreview(household);
  const { response, loading, failed } = preview;

  if (response === null) {
    return failed ? (
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <Card>
          <div role="alert">
            <h1 className="type-display text-3xl">We couldn&apos;t build your plan</h1>
            <p className="mt-3 text-gray-700">Your numbers are safe. Try again.</p>
            <Button onClick={preview.retry} className="mt-5">
              Try again
            </Button>
          </div>
        </Card>
      </main>
    ) : (
      <PlanSkeleton />
    );
  }

  const { plan, entitled, levers } = response;
  const rows = preview.leverOrder.flatMap((leverId) => levers.filter((row) => row.leverId === leverId));
  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <Link href="/result" className="inline-flex min-h-11 items-center text-sm font-semibold text-violet underline underline-offset-4">
          Back to your result
        </Link>
        <h1 className="type-display mt-3 text-4xl sm:text-6xl">Your rescue plan</h1>
      </div>

      {household.isSample && <SampleBanner />}

      <VerdictBadge
        plan={plan}
        per1000={household.diagnosis.per1000}
        onAllowRetirement={() => preview.setKeepMyCash(false)}
      />

      {failed && (
        <div role="alert" className="rounded-md border border-cliff bg-cliff-soft p-4">
          <p className="font-semibold text-cliff-strong">We couldn&apos;t update the plan. What you see may be out of date.</p>
          <Button variant="secondary" onClick={preview.retry} className="mt-3">
            Try again
          </Button>
        </div>
      )}

      <Totals plan={plan} netKept={preview.netKept} loading={loading} />

      <Card>
        <h2 className="type-display text-2xl sm:text-3xl">Your levers</h2>
        <div className="mt-5 space-y-6">
          <KeepMyCashToggle checked={preview.keepMyCash} onChange={preview.setKeepMyCash} />
          <LeverList rows={rows} onMove={preview.moveLever} />
        </div>
      </Card>

      {!entitled && plan.moves.length > 0 && (
        <section aria-busy={loading || undefined}>
          <h2 className="type-display text-2xl sm:text-3xl">The moves</h2>
          <ul className={`mt-4 space-y-3 transition-opacity ${loading ? 'opacity-60' : ''}`}>
            {plan.moves.map((move) => (
              <MoveCard key={moveKey(move)} move={move} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function PlanSkeleton() {
  return (
    <main aria-busy aria-label="Loading your plan" className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <Skeleton className="h-16 w-3/4" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-64 w-full" />
    </main>
  );
}
