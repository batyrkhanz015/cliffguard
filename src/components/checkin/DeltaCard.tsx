import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { formatMoney } from '@/lib/money';
import type { CheckinResult } from '@/lib/checkinView';
export function DeltaCard({ result }: { result: CheckinResult }) {
  const before = result.checkin.baseline;
  const unchanged = before !== undefined && Math.abs(result.checkin.result.magi - before.magi) < 1;
  return (
    <Card>
      <h2 className="text-xl font-bold">Your updated 2026 projection</h2>
      {result.replayed && <p className="mt-2 text-sm">This check-in was already saved. Your income was added once.</p>}
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        {(
          [
            ['MAGI', before?.magi, result.checkin.result.magi],
            ['Headroom', before?.headroom, result.checkin.result.headroom],
            ['Repayment', before?.repayment, result.checkin.result.repayment],
          ] as const
        ).map(([label, previous, current]) => (
          <div key={label}>
            <dt className="text-sm text-gray-600">{label}</dt>
            <dd className="mt-1 font-semibold tabular">
              {previous !== undefined && (
                <>
                  <span>{formatMoney(previous)}</span>
                  <span aria-label="changes to"> → </span>
                </>
              )}
              {formatMoney(current)}
            </dd>
          </div>
        ))}
      </dl>
      {unchanged && (
        <p className="mt-4 rounded-md bg-air p-3 text-sm">
          No change: this income was already in your forecast. If it was extra income, raise &ldquo;Still expected for
          the rest of the year&rdquo; and update.
        </p>
      )}
      {result.alerts.length > 0 && (
        <ul className="mt-4 space-y-2">
          {result.alerts.map((alert) => (
            <li className="rounded-md bg-air p-3 text-sm" key={alert.code}>
              {alert.message}
            </li>
          ))}
        </ul>
      )}
      <Link className="mt-4 inline-flex min-h-11 items-center font-semibold text-violet underline" href="/plan">
        Review your updated plan
      </Link>
    </Card>
  );
}
