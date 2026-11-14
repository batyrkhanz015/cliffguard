'use client';

import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS } from '@/components/ui/Field';
import { EligibilityNoticeExtractionSchema, type EligibilityNoticeExtraction } from '@/lib/noticeExtraction';
import { NoticeRequests } from '@/lib/noticeRequests';
import { ExtractionConfirmCard } from './ExtractionConfirmCard';

const Reply = z.object({ extraction: EligibilityNoticeExtractionSchema, confirmed: z.literal(false) });
type UploadState = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; message: string } | { kind: 'confirm'; extraction: EligibilityNoticeExtraction };

function failureMessage(code: unknown, retry: string | null): string {
  if (code === 'NOT_RECOGNIZED') return "This doesn't look like a Marketplace eligibility notice. Enter the numbers below.";
  if (code === 'FILE_TOO_LARGE') return 'Choose one file of 5 MB or less. You can also enter the numbers below.';
  if (code === 'UNSUPPORTED_FILE_TYPE') return 'Choose a PDF, PNG, JPEG or WebP notice. You can also enter the numbers below.';
  if (code === 'RATE_LIMITED') {
    const seconds = Number(retry);
    return Number.isFinite(seconds) && seconds > 0 ? `Upload limit reached. Try in ${Math.ceil(seconds / 60)} min, or enter the numbers below.` : 'Upload limit reached. Try later or enter the numbers below.';
  }
  return "Couldn't read it. Enter the numbers below.";
}

export function UploadNotice({ onConfirm }: { onConfirm: (extraction: EligibilityNoticeExtraction) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>({ kind: 'idle' });
  const [requests] = useState(() => new NoticeRequests());
  const lastRequest = useRef<'file' | 'sample'>('file');
  const inputRef = useRef<HTMLInputElement>(null);
  const focusAfterCancel = useRef(false);
  useEffect(() => () => requests.cancel(), [requests]);
  useEffect(() => {
    if (state.kind === 'idle' && focusAfterCancel.current) {
      focusAfterCancel.current = false;
      inputRef.current?.focus();
    }
  }, [state.kind]);

  function cancel() {
    requests.cancel();
    focusAfterCancel.current = true;
    setState({ kind: 'idle' });
  }

  async function read(source: 'file' | 'sample') {
    requests.cancel();
    lastRequest.current = source;
    if (source === 'file' && !file) { setState({ kind: 'error', message: 'Choose a notice first, or use the sample notice.' }); return; }
    if (source === 'file' && file && (file.size > 5 * 1024 * 1024 || !['application/pdf', 'image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size === 0)) {
      setState({ kind: 'error', message: failureMessage(file.size > 5 * 1024 * 1024 ? 'FILE_TOO_LARGE' : 'UNSUPPORTED_FILE_TYPE', null) }); return;
    }
    const controller = requests.begin();
    setState({ kind: 'loading' });
    try {
      const form = new FormData();
      if (file) form.set('file', file);
      form.set('docType', 'eligibility_notice');
      const response = await fetch('/api/extract', { method: 'POST', signal: controller.signal,
        headers: source === 'sample' ? { 'content-type': 'application/json' } : undefined,
        body: source === 'sample' ? JSON.stringify({ sample: 'dani_notice' }) : form,
      });
      const raw: unknown = await response.json().catch(() => null);
      if (!requests.isCurrent(controller)) return;
      const parsed = Reply.safeParse(raw);
      if (response.ok && parsed.success) setState({ kind: 'confirm', extraction: parsed.data.extraction });
      else {
        const failure = z.object({ error: z.object({ code: z.string() }) }).safeParse(raw);
        setState({ kind: 'error', message: failureMessage(failure.success ? failure.data.error.code : null, response.headers.get('retry-after')) });
      }
    } catch {
      if (requests.isCurrent(controller)) setState({ kind: 'error', message: "Couldn't read it. Enter the numbers below." });
    } finally {
      requests.finish(controller);
    }
  }

  return (
    <section aria-label="Read an eligibility notice" className="space-y-4 rounded-md border border-hairline p-4">
      <p className="font-semibold">Upload your eligibility notice</p>
      <p className="text-sm text-gray-600">Optional. PDF, PNG, JPEG or WebP, up to 5 MB. Your notice is sent to Claude to read; CliffGuard does not store the file. Only confirmed values are used in your form; numbers are saved after you finish the check. You can always enter them manually.</p>
      <Field id="notice-file" label="Choose a notice">
        <input ref={inputRef} id="notice-file" type="file" accept="application/pdf,image/png,image/jpeg,image/webp" disabled={state.kind === 'loading'} className={INPUT_CLASS}
          onChange={(event) => { cancel(); setFile(event.target.files?.[0] ?? null); }} />
      </Field>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" disabled={state.kind === 'loading' || !file} onClick={() => void read('file')}>Read notice</Button>
        <Button variant="quiet" disabled={state.kind === 'loading'} onClick={() => void read('sample')}>Use sample notice</Button>
      </div>
      {state.kind === 'loading' && <div role="status" aria-live="polite"><p>Reading your notice… usually 10–20 s</p><Button variant="quiet" onClick={cancel}>Cancel</Button></div>}
      {state.kind === 'error' && <div role="alert" className="text-sm"><p>{state.message}</p><Button variant="quiet" onClick={() => void read(lastRequest.current)}>Retry</Button></div>}
      {state.kind === 'confirm' && <ExtractionConfirmCard extraction={state.extraction} onCancel={cancel} onConfirm={(notice) => { onConfirm(notice); cancel(); }} />}
    </section>
  );
}
