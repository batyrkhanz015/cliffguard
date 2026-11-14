import { Card } from '@/components/ui/Card';

type Source = { label: string; href: string };
type RuleChange = { title: string; body: string; sources: readonly Source[]; isCliff?: boolean };

const CHANGES: readonly RuleChange[] = [
  {
    title: 'No cap on paying it back',
    body: 'Earn more than you estimated and you repay all the extra advance credit at tax time. Through 2025, the repayment was capped.',
    sources: [
      {
        label: 'IRS',
        href: 'https://www.irs.gov/tax-professionals/eitc-central/repayment-caps-eliminated-for-excess-advance-payments-of-the-premium-tax-credit',
      },
    ],
  },
  {
    title: 'The cliff is back',
    body: 'Above 400% of the federal poverty line, there is no credit at all. One dollar over costs the whole year.',
    sources: [
      { label: 'IRS 2026 Form 1040-ES', href: 'https://www.irs.gov/pub/irs-pdf/f1040es.pdf' },
      { label: 'KFF', href: 'https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/' },
    ],
    isCliff: true,
  },
  {
    title: 'Bronze plans now work with an HSA',
    body: 'Bronze and catastrophic plans count as HSA-eligible. HSA money lowers the income the credit is based on, and 2026 contributions are open until April 15, 2027.',
    sources: [{ label: 'IRS Notice 2026-5', href: 'https://www.irs.gov/pub/irs-drop/n-26-05.pdf' }],
  },
];

export function RuleChanges() {
  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-3">
      {CHANGES.map((change) => (
        <Card as="li" surface="dark" key={change.title} className="flex flex-col">
          <h3 className="flex items-center gap-3 font-display text-xl font-bold uppercase leading-tight">
            {change.isCliff && <span aria-hidden className="h-6 w-1.5 shrink-0 bg-cliff" />}
            {change.title}
          </h3>
          <p className="mt-3 flex-1 text-gray-300">{change.body}</p>
          <p className="mt-5 text-sm text-gray-400">
            Source:{' '}
            {change.sources.map((source, i) => (
              <span key={source.href}>
                {i > 0 && ', '}
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline decoration-violet-link underline-offset-4 hover:decoration-white"
                >
                  {source.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </span>
            ))}
          </p>
        </Card>
      ))}
    </ul>
  );
}
