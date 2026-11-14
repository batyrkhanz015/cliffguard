'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { sendJson } from '@/lib/api';
import type { EstimateView } from '@/lib/checkinView';
import { formatMoney, parseMoney } from '@/lib/money';
export function Jan15Card() {
  const [text, setText] = useState(''); const [result, setResult] = useState<EstimateView | null>(null);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => { controller.current?.abort(); }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (controller.current) return;
    const expected2027 = parseMoney(text);
    if (expected2027 === null || expected2027 > 1_000_000_000) { setError('Enter expected 2027 income between $0 and $1 billion.'); return; }
    const pending = new AbortController(); controller.current = pending; setBusy(true); setError(''); setResult(null);
    const response = await sendJson('POST', '/api/checkin/estimate', { expected2027 }, { signal: pending.signal });
    if (pending.signal.aborted) return;
    controller.current = null; setBusy(false);
    if (response.ok) setResult(response.data as EstimateView);
    else setError(response.status === 402 ? 'Year access has ended. Open your plan to renew access.' : 'Could not calculate the estimate. Try again.');
  }
  return <Card>
    <h2 className="text-xl font-bold">January 15: your 2027 Marketplace estimate</h2>
    <p className="mt-2 text-sm text-gray-600">Federal open enrollment ends January 15, 2027. Enter your expected 2027 income before any income deferred by your saved 2026 plan. We add that deferral once. State deadlines may differ.</p>
    <form onSubmit={event => { void submit(event); }} className="mt-4 space-y-4"><fieldset disabled={busy} className="space-y-4"><MoneyInput name="expected2027" label="Expected 2027 income before plan deferrals" value={text} onChange={value => { setText(value); setResult(null); }} /><Button type="submit">{busy ? 'Calculating…' : 'Calculate honest estimate'}</Button></fieldset></form>
    {error && <p role="alert" className="mt-3 text-sm text-cliff-strong">{error}</p>}
    {result && <div className="mt-4 space-y-2" role="status"><p>Plan deferrals included: <strong>{formatMoney(result.deferredToNextYear)}</strong>.</p><p>Lowest honest estimate: <strong>{formatMoney(Math.ceil(result.floor * 100) / 100, { cents: true })}</strong>.</p><p>2027 cliff: {formatMoney(result.cliff2027)}. Headroom: {formatMoney(result.headroom2027)}.</p><p className="text-sm">Use at least this floor; update it if you expect more income. This does not submit anything to the Marketplace.</p>{result.warning && <p className="text-sm font-semibold text-cliff-strong">{result.warning}</p>}</div>}
  </Card>;
}
