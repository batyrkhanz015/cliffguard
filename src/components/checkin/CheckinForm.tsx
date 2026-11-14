'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { sendJson } from '@/lib/api';
import type { CheckinReady, CheckinResult } from '@/lib/checkinView';
import { parseMoney, parseSignedMoney } from '@/lib/money';
import type { CheckinBody } from '@/lib/checkinRequest';
import { readPendingCheckin, savePendingCheckin, settleCheckinAttempt, subscribeCheckinInvalidation } from '@/lib/checkinRetry';

/** An uncertain retry keeps its original amounts and ID, including across page reloads. */
export function CheckinForm({ data, onSaved }: { data: CheckinReady; onSaved: (result: CheckinResult) => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [expected, setExpected] = useState<Record<string, string>>({});
  const [recovered] = useState(() => readPendingCheckin(data.householdScope));
  const [error, setError] = useState(recovered ? 'A previous check-in may have saved. Retry its original submission before entering more income.' : '');
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(recovered !== null);
  const pending = useRef<CheckinBody | null>(recovered); const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    const unsubscribe = subscribeCheckinInvalidation(data.householdScope, () => {
      controller.current?.abort(); controller.current = null; pending.current = null;
      setValues({}); setExpected({}); setUncertain(false); setBusy(false); setError('');
    });
    return () => { unsubscribe(); controller.current?.abort(); };
  }, [data.householdScope]);
  function number(key: string, signed = false) { return (signed ? parseSignedMoney : parseMoney)(values[key] ?? '0'); }
  function remaining(key: string, old: number) { return expected[key] ?? String(Math.max(0, old - (number(key) ?? 0))); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (controller.current) return;
    let body = pending.current;
    if (!body) {
      const received: CheckinBody['received'] = { seByAdult: {}, wagesByAdult: {}, capitalGains: 0, interestOrDividends: 0 };
      const rest: NonNullable<CheckinBody['expectedRestAfter']> = { seByAdult: {}, wagesByAdult: {} };
      for (const adult of data.adults) {
        for (const [type, old, receivedMap, expectedMap] of [['se', adult.seExpected, received.seByAdult, rest.seByAdult], ['wages', adult.wagesExpected, received.wagesByAdult, rest.wagesByAdult]] as const) {
          const key = `${adult.id}-${type}`; const amount = number(key); const after = parseMoney(remaining(key, old));
          if (amount === null || after === null || amount > 1_000_000_000 || after > 1_000_000_000) { setError('Enter each amount between $0 and $1 billion.'); return; }
          receivedMap[adult.id] = amount; expectedMap[adult.id] = after;
        }
      }
      const capitalGains = number('gains', true); const interestOrDividends = number('interest');
      if (capitalGains === null || interestOrDividends === null || Math.abs(capitalGains) > 1_000_000_000 || interestOrDividends > 1_000_000_000) { setError('Enter valid investment amounts within $1 billion.'); return; }
      received.capitalGains = capitalGains; received.interestOrDividends = interestOrDividends;
      body = { requestId: crypto.randomUUID(), baselineVersion: data.baselineVersion, received, expectedRestAfter: rest };
      pending.current = body;
      savePendingCheckin(data.householdScope, body);
    }
    const request = new AbortController(); controller.current = request; setBusy(true); setError('');
    const response = await sendJson('POST', '/api/checkin', body, { signal: request.signal });
    if (request.signal.aborted) return;
    controller.current = null; setBusy(false);
    const stillUncertain = settleCheckinAttempt(response, uncertain);
    setUncertain(stillUncertain);
    if (!stillUncertain) pending.current = null;
    if (response.ok) { onSaved(response.data as CheckinResult); return; }
    if (stillUncertain) {
      setError(response.status === 402 ? 'Your earlier check-in may have saved. Renew Year access from your plan, then retry this original submission.' : response.status === 429 ? 'Daily check-in limit reached. Your earlier check-in may have saved. Retry this original submission after the limit resets.' : 'We could not confirm the save. Retry this same submission; received income will be counted once.');
    } else {
      setError(response.status === 402 ? 'Year access is required. Open your plan to upgrade or renew.' : response.status === 429 ? 'Daily check-in limit reached. Try again later.' : response.status === 404 ? 'No saved household. Enter your numbers first.' : 'Your numbers could not be saved. Check the amounts, or refresh the page if your saved baseline changed.');
    }
  }
  return <Card>
    <h2 className="text-xl font-bold">Since {data.since}, what came in?</h2>
    <p className="mt-2 text-sm text-gray-600">Update coverage year 2026 only. {data.asOf > '2026-12-31' ? 'After year-end, enter corrections or previously uncounted 2026 income. Do not add 2027 receipts here.' : 'Enter income received since your last saved figures.'}</p>
    {data.history.length === 0 && <p className="mt-3 font-semibold">This is your baseline. Your first update compares with your saved 2026 projection.</p>}
    <p className="mt-3 text-sm text-gray-600">Expected rest defaults to your old expected amount minus newly received income, floored at $0. Edit it if your forecast changed. Keep it unchanged only for extra income beyond that forecast.</p>
    <form onSubmit={event => { void submit(event); }} className="mt-5 space-y-5">
      <fieldset disabled={busy || uncertain} className="space-y-5">
        {data.adults.map(adult => <fieldset key={adult.id} className="space-y-4 rounded-lg border border-gray-200 p-4"><legend className="px-1 font-bold">{adult.label}</legend>
          {([['se', 'Self-employment profit (after business expenses)', adult.seExpected], ['wages', 'Gross wages', adult.wagesExpected]] as const).map(([key, label, old]) => <div key={key} className="grid gap-4 sm:grid-cols-2">
            <MoneyInput name={`${adult.id}-${key}-received`} label={`${label} received in 2026`} value={values[`${adult.id}-${key}`] ?? '0'} onChange={value => setValues(current => ({ ...current, [`${adult.id}-${key}`]: value }))} />
            <MoneyInput name={`${adult.id}-${key}-expected`} label="Still expected for the rest of 2026" value={remaining(`${adult.id}-${key}`, old)} onChange={value => setExpected(current => ({ ...current, [`${adult.id}-${key}`]: value }))} />
          </div>)}
        </fieldset>)}
        <p className="text-sm text-gray-600">Investments below are additions to your annual forecast. Enter only new or previously uncounted taxable amounts; do not re-enter receipts already included.</p>
        <MoneyInput name="new-capital-gains" label="New / previously uncounted 2026 capital gains or losses" hint="Enter net taxable gain or loss, not total sale proceeds. Use a minus sign for losses." signed value={values.gains ?? '0'} onChange={value => setValues(current => ({ ...current, gains: value }))} />
        <MoneyInput name="new-interest" label="New / previously uncounted 2026 taxable interest or dividends" value={values.interest ?? '0'} onChange={value => setValues(current => ({ ...current, interest: value }))} />
      </fieldset>
      {error && <p role="alert" className="text-sm font-semibold text-cliff-strong">{error}</p>}
      <Button type="submit" disabled={busy}>{busy ? 'Updating your projection…' : uncertain ? 'Retry original check-in' : 'Update 2026 projection'}</Button>
    </form>
  </Card>;
}
