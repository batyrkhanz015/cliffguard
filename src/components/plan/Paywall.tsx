'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PlanView } from '@/lib/planView';
import { requestDemoUnlock } from '@/lib/demoUnlock';
import type { PlanCoordinator } from '@/lib/planCoordinator';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function Paywall({ plan, demoEnabled, onUnlocked, coordinator, upgrade = false }: {
  plan: PlanView; demoEnabled: boolean; onUnlocked: () => Promise<void>; coordinator: PlanCoordinator; upgrade?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<'year' | 'rescue' | null>(null);
  const [error, setError] = useState('');
  const savings = Math.max(0, plan.repaymentBefore - plan.repaymentAfter);
  const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

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
      <p className="type-eyebrow text-violet">Demo access · no payment</p>
      <h2 className="mt-3 text-2xl font-bold">{upgrade ? 'Upgrade your demo to Year' : 'Unlock your exact plan'}</h2>
      <p className="mt-3 text-sm leading-relaxed">See exact amounts, how-to steps, deadlines, a saved proof checklist and an export for your tax preparer.</p>
      <p className="mt-3 font-semibold">{savings > 0 ? `Your current plan reduces projected repayment by ${dollars.format(savings)}.` : 'Your current plan has no projected repayment reduction. Review your options and deadlines.'}</p>
      <div className="mt-5 rounded border border-violet bg-violet/5 p-4 text-sm">
        <strong>Demo mode: no card, no charge, no subscription.</strong> These buttons grant demo access only. Listed prices describe planned products; checkout is unavailable.
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded border border-violet p-4">
          <p className="text-xs font-bold uppercase text-violet">Best for variable income</p>
          <h3 className="mt-2 text-lg font-bold">CliffGuard Year</h3>
          <p className="mt-1 text-sm">Planned price: $79/year. Demo access lasts 365 days.</p>
          <Button className="mt-4 w-full" disabled={!demoEnabled || busy !== null} loading={busy === 'year'} loadingLabel="Unlocking demo…" onClick={() => { void unlock('year'); }}>Unlock Year demo — free</Button>
        </div>
        {!upgrade && <div className="rounded border border-hairline p-4">
          <h3 className="text-lg font-bold">CliffGuard Rescue</h3>
          <p className="mt-1 text-sm">Planned price: $59 once. Demo access through October 15, 2027.</p>
          <Button variant="secondary" className="mt-4 w-full" disabled={!demoEnabled || busy !== null} loading={busy === 'rescue'} loadingLabel="Unlocking demo…" onClick={() => { void unlock('rescue'); }}>Unlock Rescue demo — free</Button>
        </div>}
      </div>
      {!demoEnabled && <p className="mt-4 text-sm" role="status">Demo unlock is unavailable right now. No payment was taken.</p>}
      {error && <p role="alert" className="mt-4 text-sm text-cliff-strong">{error}</p>}
    </Card>
  );
}
