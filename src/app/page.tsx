import Link from 'next/link';
import { CliffIllustration } from '@/components/landing/CliffIllustration';
import { PixelSquares } from '@/components/landing/PixelSquares';
import { RuleChanges } from '@/components/landing/RuleChanges';
import { TryDaniButton } from '@/components/landing/TryDaniButton';
import { buttonClasses } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatMoney } from '@/lib/money';
import { US_STATE_NAMES } from '@/lib/usStates';
import { DANI, DANI_GIG } from '@/samples/dani';

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

/** Sample inputs only; every result is computed by the engine after the click. */
function DaniSample() {
  const [dani, partner] = DANI.adults;
  const facts = [
    ['Household', `${DANI.householdSize} people, ${US_STATE_NAMES[DANI.state]}`],
    ['Told HealthCare.gov', formatMoney(DANI.marketplace.incomeEstimate)],
    ['Credit each month', formatMoney(DANI.marketplace.aptcMonthly, { cents: true })],
    ['New December offer', formatMoney(DANI_GIG.amount)],
  ] as const;
  return (
    <Card surface="dark" className="mt-8 max-w-xl">
      <p className="type-eyebrow text-violet-link">The sample</p>
      <p className="mt-2 font-display text-2xl font-extrabold uppercase">{dani.label}&apos;s family</p>
      <p className="mt-1 text-gray-300">
        {dani.label} freelances in design. {partner && `${partner.label} works part time.`} Two kids.
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
        {facts.map(([term, value]) => (
          <div key={term}>
            <dt className="text-sm text-gray-400">{term}</dt>
            <dd className="tabular mt-0.5 text-lg font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-sm text-gray-400">Sample inputs. Every result is computed live.</p>
    </Card>
  );
}

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

export default function Home() {
  return (
    <main>
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
              <TryDaniButton />
              <Link href="/check" className={buttonClasses('secondary', 'dark')}>
                Check my numbers (5 questions)
              </Link>
              <Link href="/check?step=2" className={buttonClasses('quiet', 'dark')}>
                Upload my notice
              </Link>
            </div>
          </div>
          <div>
            <CliffIllustration />
            <DaniSample />
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
    </main>
  );
}
