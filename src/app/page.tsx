import Link from 'next/link';
import { loadHousehold } from '@/server/household';
import { getSid } from '@/server/session';
import { todayAsOf } from '@/server/clock';
import { checkinSchedule } from '@/server/checkin';
import { CliffIllustration } from '@/components/landing/CliffIllustration';
import { PixelSquares } from '@/components/landing/PixelSquares';
import { RuleChanges } from '@/components/landing/RuleChanges';
import { formatDate } from '@/engine/format';
import { buttonClasses } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const DECISIONS = [
  {
    title: 'Take the work?',
    body: 'What a new gig really leaves you, after tax and any credit you lose. Some gigs leave you poorer than saying no.',
  },
  {
    title: 'Stay under the line',
    body: 'Legal moves, ranked, each with a deadline. The ones that keep your cash come first.',
  },
  {
    title: 'Stay on track',
    body: 'A short check-in each month, until you file in April. Income lands. Your plan updates.',
  },
] as const;

const FOR = [
  'Freelancers, contractors and gig workers on a HealthCare.gov plan.',
  'Families whose income swings month to month.',
  'Anyone deciding on extra work before December 31.',
] as const;

const NOT_FOR = [
  "Steady salaries well under the line. You know your number.",
  "Incomes far over the line. We'll tell you, free, what to set aside.",
  'People with health insurance through work.',
] as const;

const PLANS = [
  {
    name: 'Free',
    price: null,
    title: 'See where you stand',
    body: "Your cliff, what you'd repay, and whether a gig is worth taking. No sign-up.",
    badge: null,
  },
  {
    name: 'Rescue',
    price: '$59 once',
    title: 'The exact plan for this year',
    body: 'Amounts, deadlines, how-to and proof checklist, plus a tax-preparer export.',
    badge: null,
  },
  {
    name: 'Year',
    price: '$79/yr',
    title: 'Stay on track all year',
    body: 'Everything in Rescue, plus monthly check-ins, cliff alerts, deadline calendar and the Jan 15 estimate.',
    badge: 'Best for variable income',
  },
] as const;

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className="mt-1.5 size-3 shrink-0">
      <rect width="12" height="12" className="fill-violet" />
      <path d="M3 6.2 5 8.2 9 3.8" fill="none" stroke="#fff" strokeWidth="1.6" />
    </svg>
  );
}

function Cross() {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className="mt-1.5 size-3 shrink-0">
      <rect width="12" height="12" className="fill-gray-300" />
      <path d="M3.5 6h5" stroke="#fff" strokeWidth="1.6" />
    </svg>
  );
}

/** The check-in banner for a returning visitor. The landing page still renders without it if the store fails. */
async function welcomeBackSchedule() {
  try {
    const household = await loadHousehold(await getSid());
    return household ? checkinSchedule(todayAsOf(), household.checkins.at(-1)?.asOf) : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const schedule = await welcomeBackSchedule();
  return (
    <main>
      {schedule && <aside className="bg-air px-4 py-4 text-center text-sm"><span className="font-semibold">Welcome back. {schedule.due ? `Your ${schedule.monthLabel} check-in is due.` : `Your next check-in is ${formatDate(schedule.nextDate)}.`}</span>{' '}<Link href="/checkin" className="inline-flex min-h-11 items-center font-semibold text-violet underline">Open your 2026 check-in</Link></aside>}
      <section className="relative overflow-hidden bg-night text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_78%_28%,rgb(91_66_220/0.38),transparent_72%)]"
        />
        <PixelSquares />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:pb-24 lg:pt-16">
          <div>
            <p className="type-eyebrow text-violet-link">For freelancers on HealthCare.gov</p>
            <h1 className="type-display mt-5 text-[2.35rem] sm:text-6xl lg:text-[5.25rem]">
              <span className="block">Take the gig.</span>
              <span className="block">Keep your health subsidy.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-300">
              No cap on paying it back in 2026. One dollar over the line and the whole credit is gone. See
              where you stand. Then take the work anyway.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/check" className={buttonClasses('glitter', 'dark')}>
                Check my numbers
                <span className="text-sm font-medium text-white">5 quick questions</span>
              </Link>
            </div>
          </div>
          <div>
            <CliffIllustration />
          </div>
        </div>
      </section>

      <section className="bg-air">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="type-eyebrow text-violet">01 / The decision</p>
          <h2 className="type-display mt-5 text-4xl sm:text-6xl">
            <span className="block">Free calculators</span>
            <span className="block">stop at the bill.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-gray-700">
            They tell you what you owe in April. By then, the moves that save the credit have expired. CliffGuard
            works on the choice in front of you now.
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {DECISIONS.map((item) => (
              <Card as="li" key={item.title}>
                <h3 className="font-display text-xl font-bold uppercase">{item.title}</h3>
                <p className="mt-3 text-gray-700">{item.body}</p>
              </Card>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-night text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="type-eyebrow text-violet-link">02 / What changed in 2026</p>
          <h2 className="type-display mt-5 text-4xl sm:text-6xl">
            <span className="block">Three rules.</span>
            <span className="block">One cliff.</span>
          </h2>
          <RuleChanges />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="type-eyebrow text-violet">03 / Who it&apos;s for</p>
          <h2 className="type-display mt-5 text-4xl sm:text-6xl">
            <span className="block">Lumpy income.</span>
            <span className="block">Marketplace plan.</span>
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card>
              <h3 className="font-display text-xl font-bold uppercase">Built for</h3>
              <ul className="mt-4 space-y-3 text-gray-700">
                {FOR.map((line) => (
                  <li key={line} className="flex gap-3">
                    <Check />
                    {line}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="font-display text-xl font-bold uppercase">Not for</h3>
              <ul className="mt-4 space-y-3 text-gray-700">
                {NOT_FOR.map((line) => (
                  <li key={line} className="flex gap-3">
                    <Cross />
                    {line}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-air">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="type-eyebrow text-violet">04 / What it costs</p>
          <h2 className="type-display mt-5 text-4xl sm:text-6xl">
            <span className="block">Free to look.</span>
            <span className="block">Paid to act.</span>
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => (
              <Card as="li" key={plan.name} tone="accent">
                <p className="type-eyebrow text-violet">{plan.name}</p>
                {plan.price && <p className="font-display mt-3 text-3xl font-bold">{plan.price}</p>}
                {plan.badge && (
                  <p className="mt-3 inline-block rounded-sm bg-violet px-2 py-1 text-xs font-semibold text-white">{plan.badge}</p>
                )}
                <h3 className="font-display mt-3 text-xl font-bold uppercase">{plan.title}</h3>
                <p className="mt-3 text-gray-700">{plan.body}</p>
              </Card>
            ))}
          </ul>
          <p className="mt-6 text-sm text-gray-500">
            Payments are in demo mode for judging: unlock is free, no card is collected.
          </p>
        </div>
      </section>
    </main>
  );
}
