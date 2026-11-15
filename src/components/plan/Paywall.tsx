'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PlanView } from '@/lib/planView';
import { formatMoney } from '@/lib/money';
import { requestDemoUnlock } from '@/lib/demoUnlock';
import type { PlanCoordinator } from '@/lib/planCoordinator';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PlanAccessDetails } from './PlanAccessDetails';

const OPTIONS = [
  {
    product: 'year',
    name: 'CliffGuard Year',
    price: 79,
    term: '/year',
    description: 'A rescue plan, plus monitoring as your income changes.',
    access: '365 days of demo access',
    features: [
      'Everything in Rescue',
      'Income check-ins and history',
      'Cliff and repayment alerts',
      'Calendar reminders',
      '2027 income estimate helper',
    ],
  },
  {
    product: 'rescue',
    name: 'CliffGuard Rescue',
    price: 59,
    term: 'once',
    description: 'The steps and records for your 2026 rescue plan.',
    access: 'Demo access through October 15, 2027',
    features: [
      'Exact move amounts and deadlines',
      'Step-by-step instructions',
      'Saved proof checklist',
      'Tax-preparer export',
      'Plan explanation',
    ],
  },
] as const;

export function Paywall({ plan, demoEnabled, onUnlocked, coordinator, upgrade = false }: {
  plan: PlanView; demoEnabled: boolean; onUnlocked: () => Promise<void>; coordinator: PlanCoordinator; upgrade?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<'year' | 'rescue' | null>(null);
  const [error, setError] = useState('');
  const savings = Math.max(0, plan.repaymentBefore - plan.repaymentAfter);

  async function unlock(product: 'year' | 'rescue') {
    setBusy(product);
    setError('');
    try {
      const result = await requestDemoUnlock(coordinator, product, onUnlocked);
      if (result === null) {
        setError('Your plan is updating. Wait for it to finish, then try unlocking again.');
      } else if (result.ok) {
        router.refresh();
      } else {
        setError(result.code === 'RATE_LIMITED'
          ? `Unlock limit reached. Try again in ${result.retryAfterSec ?? 60} seconds.`
          : result.code === 'NOT_FOUND' ? 'Enter your numbers or load Dani’s family first.'
            : 'Demo unlock is unavailable right now. No payment was taken. Try again.');
      }
    } catch {
      setError('Demo unlock could not finish. No payment was taken. Try again.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card as="section">
      <p className="type-eyebrow text-violet">{upgrade ? 'Keep your plan current' : 'Put your plan into action'}</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
        {upgrade ? 'Add a year of check-ins and reminders.' : 'Choose the access that fits your year.'}
      </h2>
      <p className="mt-3 max-w-2xl text-gray-600">
        {upgrade
          ? 'Build on your Rescue access with updates and alerts as income lands.'
          : 'Rescue gives you the actions to take. Year adds ongoing check-ins, alerts and reminders.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md bg-night p-4 text-white sm:p-5">
        <div>
          <p className="text-sm text-gray-300">Projected repayment reduction with your current plan</p>
          <p className="tabular mt-1 font-display text-3xl font-extrabold text-kept">{formatMoney(savings)}</p>
        </div>
        <p className="max-w-xs text-sm text-gray-300">
          {savings > 0
            ? 'Calculated from your numbers. Unlock the steps and records behind the projection.'
            : 'Your current plan has no repayment reduction. Review its verdict and your options before acting.'}
        </p>
      </div>

      <p className="mt-5 text-sm text-gray-600">
        <strong className="text-gray-950">Free demo today.</strong> No card, no charge, no subscription. Prices below describe planned products.
      </p>
      <div className={`mt-4 grid gap-4 ${upgrade ? '' : 'md:grid-cols-2'}`}>
        {OPTIONS.filter((option) => !upgrade || option.product === 'year').map((option) => (
          <article key={option.product} aria-labelledby={`access-${option.product}`} className={`flex min-w-0 flex-col rounded-md border p-5 sm:p-6 ${option.product === 'year' ? 'border-violet bg-violet/5' : 'border-hairline bg-white'}`}>
            <div className="min-h-7">
              {option.product === 'year' && <span className="inline-block rounded bg-violet px-2.5 py-1 text-xs font-bold text-white">Best for changing income</span>}
            </div>
            <h3 id={`access-${option.product}`} className="mt-3 text-xl font-bold">{option.name}</h3>
            <p className="mt-2 min-h-12 text-sm leading-relaxed text-gray-600">{option.description}</p>
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Planned price</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-1.5">
                <span className="tabular font-display text-5xl font-extrabold">{formatMoney(option.price)}</span>{' '}
                <span className="font-medium text-gray-600">{option.term}</span>
              </p>
            </div>
            <ul className="my-6 space-y-3 border-t border-hairline pt-5 text-sm">
              {option.features.map((feature) => <li key={feature} className="flex items-start gap-2.5">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0 text-violet" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 10 4 4 8-8" /></svg>
                <span>{feature}</span>
              </li>)}
            </ul>
            <div className="mt-auto">
              <Button variant={option.product === 'year' ? 'primary' : 'secondary'} className="w-full px-3" disabled={!demoEnabled || busy !== null} loading={busy === option.product} loadingLabel="Unlocking demo…" onClick={() => { void unlock(option.product); }}>
                Unlock {option.product === 'year' ? 'Year' : 'Rescue'} demo — free
              </Button>
              <p className="mt-2 text-center text-xs font-medium text-gray-600">No card · No charge</p>
              <p className="mt-3 text-center text-xs text-gray-500">{option.access}</p>
            </div>
          </article>
        ))}
      </div>
      {!demoEnabled && <p className="mt-4 text-sm" role="status">Demo unlock is unavailable right now. No payment was taken.</p>}
      {error && <p role="alert" className="mt-4 text-sm text-cliff-strong">{error}</p>}
      <PlanAccessDetails upgrade={upgrade} />
    </Card>
  );
}
