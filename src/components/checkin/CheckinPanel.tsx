'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, buttonClasses } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { CheckinData, CheckinResult } from '@/lib/checkinView';
import { notifyPlanChanged } from '@/lib/planEvents';
import { HOUSEHOLD_CHANGED_EVENT, reconcilePendingCheckin } from '@/lib/checkinRetry';
import { CheckinForm } from './CheckinForm';
import { DeltaCard } from './DeltaCard';
import { History } from './History';
import { Jan15Card } from './Jan15Card';
type State = { kind: 'loading' | 'error' } | { kind: 'loaded'; data: CheckinData; revision: number };
export function CheckinPanel() {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [result, setResult] = useState<CheckinResult | null>(null);
  const sequence = useRef(0); const controller = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    controller.current?.abort(); const request = new AbortController(); controller.current = request;
    const revision = ++sequence.current;
    try {
      const response = await fetch('/api/checkin', { cache: 'no-store', signal: request.signal });
      if (!response.ok) throw new Error('Could not load');
      const data = await response.json() as CheckinData;
      if (!request.signal.aborted) { reconcilePendingCheckin(data.kind === 'empty' ? null : data.householdScope); setState({ kind: 'loaded', data, revision }); }
    } catch { if (!request.signal.aborted) setState({ kind: 'error' }); }
  }, []);
  useEffect(() => {
    const changed = () => { setResult(null); setState({ kind: 'loading' }); void refresh(); };
    void refresh(); window.addEventListener(HOUSEHOLD_CHANGED_EVENT, changed);
    return () => { controller.current?.abort(); window.removeEventListener(HOUSEHOLD_CHANGED_EVENT, changed); };
  }, [refresh]);
  return <div className="space-y-5">
    {state.kind === 'loading' && <Card><p role="status">Loading your check-in…</p></Card>}
    {state.kind === 'error' && <Card><p role="alert">Could not load your saved numbers.</p><Button className="mt-4" onClick={() => { setState({ kind: 'loading' }); void refresh(); }}>Try again</Button></Card>}
    {state.kind === 'loaded' && state.data.kind === 'empty' && <Card><h2 className="text-xl font-bold">Start with your 2026 numbers</h2><p className="mt-2">Save a household before your first check-in.</p><Link className={`${buttonClasses()} mt-4`} href="/check">Enter my numbers</Link><Link className="ml-4 inline-block font-semibold text-violet underline" href="/unlock">Try Dani’s family</Link></Card>}
    {state.kind === 'loaded' && state.data.kind === 'locked' && <Card><h2 className="text-xl font-bold">Monthly check-ins are included with Year</h2><p className="mt-2">Track your projected MAGI, headroom and repayment, get cliff alerts, download deadline reminders and build your January 15 estimate. Active Year access unlocks your numbers here.</p><Link className={`${buttonClasses()} mt-4`} href="/unlock">Open plan · upgrade or renew Year</Link></Card>}
    {state.kind === 'loaded' && state.data.kind === 'ready' && <>
      {result && <DeltaCard result={result} />}
      <CheckinForm key={state.revision} data={state.data} onSaved={saved => { setResult(saved); notifyPlanChanged(); setState({ kind: 'loading' }); void refresh(); }} />
      <Card><p>{state.data.schedule.due ? `Your ${state.data.schedule.monthLabel} check-in is due.` : 'Your check-in is saved for this month.'} Next check-in: {state.data.schedule.nextDate}.</p><a className={`${buttonClasses('secondary')} mt-4`} href="/api/calendar.ics">Download deadlines and monthly reminders (.ics)</a><p className="mt-2 text-sm text-gray-600">Import the file into Calendar. Includes 2026-plan deadlines and 12 monthly check-ins with 7-day and 1-day reminders.</p></Card>
      <History history={state.data.history} />
      <Jan15Card key={`estimate-${state.revision}`} />
    </>}
  </div>;
}
