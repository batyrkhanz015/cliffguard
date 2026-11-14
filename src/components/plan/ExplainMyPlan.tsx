'use client';

import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { ExplanationSchema } from '@/engine/types';
import { sendJson } from '@/lib/api';
import { PLAN_CHANGED_EVENT } from '@/lib/planEvents';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const ResponseSchema = ExplanationSchema.extend({ source: z.enum(['claude', 'template']) });
type State = { kind: 'idle' | 'loading' | 'stale' } | { kind: 'error'; message: string } | { kind: 'ready'; data: z.infer<typeof ResponseSchema> };

/** Parent keys this component to its current read revision, invalidating all in-flight replies. */
export function ExplainMyPlan() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const pending = useRef<AbortController | null>(null);
  useEffect(() => {
    const invalidate = () => {
      pending.current?.abort();
      setState({ kind: 'stale' });
    };
    // The parent may be waiting for a proof save before it can refresh. Hide old text now.
    window.addEventListener(PLAN_CHANGED_EVENT, invalidate);
    return () => {
      pending.current?.abort();
      window.removeEventListener(PLAN_CHANGED_EVENT, invalidate);
    };
  }, []);

  async function explain() {
    if (pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    setState({ kind: 'loading' });
    const result = await sendJson('POST', '/api/explain', {}, { signal: controller.signal });
    if (controller.signal.aborted) return;
    pending.current = null;
    if (!result.ok) {
      const message = result.status === 402 ? 'Your access has ended. Refresh full details to check access.'
        : result.status === 422 ? 'Your plan changed. Refresh full details, then try again.'
          : result.status === 429 ? `Too many requests. Try again${result.retryAfterSec ? ` in ${result.retryAfterSec} seconds` : ' later'}.`
            : 'Could not load your explanation. Please try again.';
      setState({ kind: 'error', message });
      return;
    }
    const parsed = ResponseSchema.safeParse(result.data);
    setState(parsed.success ? { kind: 'ready', data: parsed.data } : { kind: 'error', message: 'Could not read your explanation. Please try again.' });
  }

  return <Card>
    <h3 className="text-lg font-bold">Understand your plan</h3>
    <p className="mt-2 text-sm">A plain-English explanation of your current calculations and moves. Education, not tax advice.</p>
    {state.kind !== 'ready' && state.kind !== 'stale' && <Button className="mt-4" disabled={state.kind === 'loading'} onClick={() => { void explain(); }}>
      {state.kind === 'loading' ? 'Preparing your explanation…' : state.kind === 'error' ? 'Try explanation again' : 'Explain my plan'}
    </Button>}
    {state.kind === 'stale' && <p className="mt-3 text-sm" role="status">Your plan changed. Refreshing its details…</p>}
    {state.kind === 'loading' && <p className="mt-3 text-sm" role="status">Reading your current plan…</p>}
    {state.kind === 'error' && <p className="mt-3 text-sm" role="alert">{state.message}</p>}
    {state.kind === 'ready' && <div className="mt-5 space-y-4 break-words" aria-live="polite">
      <p className="type-eyebrow text-violet">{state.data.source === 'template' ? 'Calculation-based explanation' : 'AI explanation · numbers checked against your plan'}</p>
      <h4 className="font-bold">{state.data.headline}</h4>
      {state.data.paragraphs.map((paragraph, index) => <p key={index} className="text-sm">{paragraph}</p>)}
      {state.data.moveNotes.length > 0 && <ul className="list-disc space-y-2 pl-5 text-sm">
        {state.data.moveNotes.map((note, index) => <li key={`${note.leverId}-${index}`}>{note.note}</li>)}
      </ul>}
      {state.data.caveats.length > 0 && <div className="space-y-2 text-sm text-muted">
        <p className="font-semibold">Keep in mind</p>
        {state.data.caveats.map((caveat, index) => <p key={index}>{caveat}</p>)}
      </div>}
    </div>}
  </Card>;
}
