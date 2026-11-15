import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatMoney } from '@/lib/money';
import { US_STATE_NAMES } from '@/lib/usStates';
import { DANI, DANI_GIG } from '@/samples/dani';

const FACTS = [
  ['Household', `${DANI.householdSize} people, ${US_STATE_NAMES[DANI.state]}`],
  ['Told HealthCare.gov', formatMoney(DANI.marketplace.incomeEstimate)],
  ['Credit each month', formatMoney(DANI.marketplace.aptcMonthly, { cents: true })],
  ['December offer', formatMoney(DANI_GIG.amount)],
] as const;

/** Shown over the sample household only: names the sample inputs and points to the user's own. */
export function SampleBanner() {
  return (
    <Card as="aside" tone="accent" compact>
      <p className="type-eyebrow text-violet">Sample</p>
      <p className="mt-2 font-semibold">You&apos;re looking at a sample: {DANI.adults[0].label}&apos;s family.</p>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {FACTS.map(([term, value]) => (
          <div key={term}>
            <dt className="text-xs text-gray-700">{term}</dt>
            <dd className="tabular text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <Link href="/check" className={`${buttonClasses('secondary')} mt-4`}>
        Use my numbers
      </Link>
    </Card>
  );
}
