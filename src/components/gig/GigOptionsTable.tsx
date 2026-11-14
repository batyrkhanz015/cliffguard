import type { GigCheckResult, GigOptionId } from '@/engine';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatMoney } from '@/lib/money';
import { RoughEstimateNote } from './RoughEstimateNote';

const OPTION_LABELS: Record<GigOptionId, string> = {
  decline: 'Say no',
  take_do_nothing: 'Take it, do nothing',
  take_with_plan: 'Take it, with a plan',
  bill_in_january: 'Take it, bill in January',
};

type GigOptionsTableProps = {
  /** Null until an offer has been checked. */
  result: GigCheckResult | null;
  /** True while a check is in flight; the old result stays dimmed underneath. */
  loading: boolean;
  /** A failed check; shown with a retry. */
  error: string | null;
  onRetry: () => void;
  onSeePlan: () => void;
};

function netOf(result: GigCheckResult, id: GigOptionId): number | null {
  return result.options.find((option) => option.id === id)?.netFromGig ?? null;
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-600">{label}</dt>
      <dd className="font-semibold tabular">{value}</dd>
    </div>
  );
}

/** Four ways to answer an offer, side by side: what you keep, the credit you keep and what you repay. */
export function GigOptionsTable({ result, loading, error, onRetry, onSeePlan }: GigOptionsTableProps) {
  if (error !== null) {
    return (
      <div role="alert" className="rounded-md border border-cliff bg-cliff-soft p-4">
        <p className="font-semibold text-cliff-strong">{error}</p>
        <Button variant="secondary" onClick={onRetry} className="mt-3">
          Try again
        </Button>
      </div>
    );
  }
  if (result === null) {
    return loading ? (
      <div aria-busy className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    ) : (
      <p className="text-gray-700">Enter an offer to see if it&apos;s worth it.</p>
    );
  }

  const doNothing = netOf(result, 'take_do_nothing');
  const withPlan = netOf(result, 'take_with_plan');
  return (
    <div aria-busy={loading || undefined} className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
      <h3 className="type-display text-2xl sm:text-3xl">
        {doNothing !== null && withPlan !== null && (
          <>
            <span className="block">
              Doing nothing: <span className={doNothing < 0 ? 'text-cliff' : ''}>{formatMoney(doNothing)}</span>
            </span>
            <span className="block">
              With a plan: <span className="text-kept">{formatMoney(withPlan)}</span>
            </span>
          </>
        )}
      </h3>
      <RoughEstimateNote className="mt-2" />
      <ul className="mt-5 space-y-3">
        {result.options.map((option) => (
          <li
            key={option.id}
            className={`rounded-md border p-4 ${option.id === 'take_with_plan' ? 'border-violet bg-violet/5' : 'border-hairline'}`}
          >
            <h4 className="font-semibold">{OPTION_LABELS[option.id]}</h4>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <Cell label="You keep from the gig" value={formatMoney(option.netFromGig)} />
              <Cell label="Credit you keep" value={formatMoney(option.ptcKept)} />
              <Cell label="You repay in April" value={formatMoney(option.repayment)} />
            </dl>
            {option.notes.map((note) => (
              <p key={note} className="mt-3 text-sm text-gray-700">
                {note}
              </p>
            ))}
          </li>
        ))}
      </ul>
      <Button onClick={onSeePlan} className="mt-6 w-full sm:w-auto">
        See the rescue plan
      </Button>
    </div>
  );
}
