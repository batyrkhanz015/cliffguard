'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PLAN_CHANGED_EVENT } from '@/lib/planEvents';
import { sendJson } from '@/lib/api';
import { moveKey, revisionKey } from '@/lib/keys';
import { createPlanCoordinator } from '@/lib/planCoordinator';
import type { PlanAccessData } from '@/server/planAccess';
import { Button, buttonClasses } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Paywall } from './Paywall';
import { UnlockedMove } from './UnlockedMove';
import { PlanProgress } from './PlanProgress';
import { ExplainMyPlan } from './ExplainMyPlan';

type State = { kind: 'loading' } | { kind: 'ready'; data: PlanAccessData; revision: number } | { kind: 'error'; missing: boolean };

/** Sibling of T7's page: its page and controls remain owned by T7. Never shown on /plan/export. */
export function PlanAccess() {
  const pathname = usePathname();
  const visible = pathname === '/plan';
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [coordinator] = useState(createPlanCoordinator);
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    const current = ++sequence.current;
    await coordinator.refresh(async () => {
      if (current !== sequence.current) return;
      setState({ kind: 'loading' });
      try {
        const response = await fetch('/api/plan/access', { cache: 'no-store' });
        if (!response.ok) {
          if (current === sequence.current) setState({ kind: 'error', missing: response.status === 404 });
          return;
        }
        const data = await response.json() as PlanAccessData;
        if (current === sequence.current) setState({ kind: 'ready', data, revision: current });
      } catch {
        if (current === sequence.current) setState({ kind: 'error', missing: false });
      }
    });
  }, [coordinator]);

  async function loadSample() {
    setState({ kind: 'loading' });
    const result = await sendJson('POST', '/api/household/sample', { persona: 'dani' });
    if (result.ok) await refresh();
    else setState({ kind: 'error', missing: false });
  }

  useEffect(() => {
    if (!visible) return;
    const update = () => { void refresh(); };
    update();
    window.addEventListener(PLAN_CHANGED_EVENT, update);
    window.addEventListener('focus', update);
    return () => {
      sequence.current += 1;
      window.removeEventListener(PLAN_CHANGED_EVENT, update);
      window.removeEventListener('focus', update);
    };
  }, [visible, refresh]);

  if (!visible) return null;
  return (
    <section aria-label="Exact plan access" className="mx-auto w-full max-w-4xl space-y-5 px-4 py-8 sm:px-6">
      {state.kind === 'loading' && <Card><p role="status" aria-live="polite">Loading your latest plan…</p></Card>}
      {state.kind === 'error' && <Card>
        <p role="alert">{state.missing ? 'Start with Dani’s family or enter your numbers to build a plan.' : 'Could not load your plan. Please try again.'}</p>
        {state.missing ? <Link href="/check" className={`${buttonClasses()} mt-4`}>Enter my numbers</Link>
          : <Button className="mt-4" onClick={() => { void refresh(); }}>Try again</Button>}
        {state.missing && <Button variant="secondary" className="mt-4 sm:ml-3" onClick={() => { void loadSample(); }}>Try Dani’s family</Button>}
      </Card>}
      {state.kind === 'ready' && (!state.data.entitled
        ? <Paywall plan={state.data.plan} demoEnabled={state.data.demoEnabled} onUnlocked={refresh} coordinator={coordinator} />
        : <>
          <Card>
            <p className="type-eyebrow text-violet">{state.data.access?.mode === 'demo' ? 'Demo unlocked · no payment taken' : 'Plan unlocked'}</p>
            <h2 className="mt-3 text-2xl font-bold">Your exact rescue plan</h2>
            <p className="mt-2 text-sm">{state.data.access?.product === 'year' ? 'CliffGuard Year' : 'CliffGuard Rescue'} access through {state.data.access?.validUntil}. Discuss these projected moves with your preparer before acting.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="/plan/export" className={buttonClasses()}>Tax-preparer export</a>
              <Button variant="secondary" onClick={() => { void refresh(); }}>Refresh full details</Button>
            </div>
          </Card>
          {state.data.plan.moves.length === 0 && <Card>
            <h3 className="text-lg font-bold">{state.data.plan.verdict === 'under_line' ? 'You’re under the line. No rescue needed.' : 'No actionable moves in this plan.'}</h3>
            <p className="mt-2 text-sm">{state.data.plan.verdict === 'under_line' ? 'Keep monitoring your projected income and Marketplace estimate as work comes in.' : 'Review the preview’s eligibility reasons and cash preference. Your preparer can help assess other options.'}</p>
          </Card>}
          <Card>
            <h3 className="text-lg font-bold">{state.data.access?.product === 'year' ? 'Keep your 2026 projection current' : 'Year preview: monthly check-ins and reminders'}</h3>
            <p className="mt-2 text-sm">{state.data.access?.product === 'year' ? 'Log income as it lands, see computed alerts and prepare your January 15 estimate.' : 'Upgrade to Year for income check-ins, cliff alerts, calendar reminders and the January 15 estimate helper.'}</p>
            <div className="mt-4 flex flex-wrap gap-3"><Link href="/checkin" className={buttonClasses('secondary')}>{state.data.access?.product === 'year' ? 'Start check-in' : 'Preview Year check-ins'}</Link>{state.data.access?.product === 'year' && <a href="/api/calendar.ics" className={buttonClasses('secondary')}>Add deadlines to calendar (.ics)</a>}</div>
          </Card>
          <ExplainMyPlan key={revisionKey('explain', state.revision)} />
          <PlanProgress key={revisionKey('progress', state.revision)} initial={state.data.progress} coordinator={coordinator}>
            {state.data.plan.moves.map((move) => !move.locked && <UnlockedMove key={moveKey(move)} move={move} />)}
          </PlanProgress>
          {state.data.access?.mode === 'demo' && state.data.access.product === 'rescue' && <Paywall plan={state.data.plan} demoEnabled={state.data.demoEnabled} onUnlocked={refresh} coordinator={coordinator} upgrade />}
        </>)}
    </section>
  );
}
