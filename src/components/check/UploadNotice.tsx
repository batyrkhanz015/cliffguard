'use client';

import { useEffect, useRef, useState, type DragEvent } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { EligibilityNoticeExtractionSchema, type EligibilityNoticeExtraction, type NoticeSource } from '@/lib/noticeExtraction';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from '@/lib/uploadLimit';
import { NoticeRequests } from '@/lib/noticeRequests';
import { demoNotice } from '@/samples/demoNotice';
import { ExtractionConfirmCard } from './ExtractionConfirmCard';

const Reply = z.object({ extraction: EligibilityNoticeExtractionSchema, confirmed: z.literal(false) });
type UploadState = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; message: string; canRetry: boolean } | { kind: 'confirm'; extraction: EligibilityNoticeExtraction; source: NoticeSource };

function failureMessage(code: unknown, retry: string | null): string {
  if (code === 'NOT_RECOGNIZED') return "This doesn't look like a Marketplace eligibility notice. Enter the numbers below.";
  if (code === 'FILE_TOO_LARGE') return `Choose one file of ${MAX_UPLOAD_MB} MB or less. You can also enter the numbers below.`;
  if (code === 'UNSUPPORTED_FILE_TYPE') return 'Choose a PDF, PNG, JPEG or WebP notice. You can also enter the numbers below.';
  if (code === 'CLAUDE_UNAVAILABLE') return 'Notice reading is unavailable. Try the demo notice or enter the numbers below.';
  if (code === 'RATE_LIMITED') {
    const seconds = Number(retry);
    return Number.isFinite(seconds) && seconds > 0 ? `Upload limit reached. Try in ${Math.ceil(seconds / 60)} min, or enter the numbers below.` : 'Upload limit reached. Try later or enter the numbers below.';
  }
  return "Couldn't read it. Enter the numbers below.";
}

function fileError(file: File): string | null {
  if (file.size > MAX_UPLOAD_BYTES) return failureMessage('FILE_TOO_LARGE', null);
  if (file.size === 0 || !['application/pdf', 'image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    return failureMessage('UNSUPPORTED_FILE_TYPE', null);
  }
  return null;
}

export function UploadNotice({ onConfirm }: { onConfirm: (extraction: EligibilityNoticeExtraction, source: NoticeSource) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>({ kind: 'idle' });
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const [requests] = useState(() => new NoticeRequests());
  const lastRequest = useRef<'file' | 'sample'>('file');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLButtonElement>(null);
  const focusAfterCancel = useRef(false);
  useEffect(() => () => requests.cancel(), [requests]);
  useEffect(() => {
    if (state.kind === 'idle' && focusAfterCancel.current) {
      focusAfterCancel.current = false;
      dropAreaRef.current?.focus();
    }
  }, [state.kind]);

  function cancel() {
    requests.cancel();
    focusAfterCancel.current = true;
    setState({ kind: 'idle' });
  }

  function showDemo() {
    requests.cancel();
    focusAfterCancel.current = false;
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
    setState({ kind: 'confirm', extraction: demoNotice(), source: 'demo' });
  }

  function chooseFiles(files: FileList | null): boolean {
    requests.cancel();
    lastRequest.current = 'file';
    focusAfterCancel.current = false;
    const selected = files?.[0] ?? null;
    const error = files && files.length > 1
      ? 'Choose one notice at a time. Drop a single PDF, PNG, JPEG or WebP file.'
      : selected ? fileError(selected) : null;
    if (error) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      setState({ kind: 'error', message: error, canRetry: false });
      return false;
    }
    setFile(selected);
    setState({ kind: 'idle' });
    return selected !== null;
  }

  function dragEnter(event: DragEvent<HTMLButtonElement>) {
    if (!event.dataTransfer.types.includes('Files')) return;
    event.preventDefault();
    if (state.kind === 'loading') return;
    dragDepth.current += 1;
    setDragging(true);
  }

  function dragLeave(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  }

  function drop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (state.kind === 'loading' || event.dataTransfer.files.length === 0) return;
    const files = event.dataTransfer.files;
    if (chooseFiles(files) && inputRef.current) inputRef.current.files = files;
  }

  async function read(source: 'file' | 'sample') {
    requests.cancel();
    lastRequest.current = source;
    if (source === 'file' && !file) { setState({ kind: 'error', message: 'Choose a notice first, or use the sample notice.', canRetry: false }); return; }
    const error = source === 'file' && file ? fileError(file) : null;
    if (error) {
      setState({ kind: 'error', message: error, canRetry: false }); return;
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
      if (response.ok && parsed.success) setState({ kind: 'confirm', extraction: parsed.data.extraction, source: 'upload' });
      else {
        const failure = z.object({ error: z.object({ code: z.string() }) }).safeParse(raw);
        setState({ kind: 'error', message: failureMessage(failure.success ? failure.data.error.code : null, response.headers.get('retry-after')), canRetry: true });
      }
    } catch {
      if (requests.isCurrent(controller)) setState({ kind: 'error', message: "Couldn't read it. Enter the numbers below.", canRetry: true });
    } finally {
      requests.finish(controller);
    }
  }

  return (
    <section aria-label="Read an eligibility notice" className="space-y-4 rounded-md border border-hairline p-4">
      <p className="font-semibold">Upload your eligibility notice</p>
      <p className="text-sm text-gray-600">Optional. PDF, PNG, JPEG or WebP, up to {MAX_UPLOAD_MB} MB. Your notice is sent to Claude to read; CliffGuard does not store the file. Only confirmed values are used in your form; numbers are saved after you finish the check. You can always enter them manually.</p>
      <input ref={inputRef} type="file" accept="application/pdf,image/png,image/jpeg,image/webp" hidden disabled={state.kind === 'loading'}
        aria-label="Eligibility notice file"
        onChange={(event) => { chooseFiles(event.target.files); }} />
      <button
        ref={dropAreaRef}
        id="notice-file"
        type="button"
        aria-label="Upload an eligibility notice"
        aria-describedby="notice-drop-hint"
        aria-disabled={state.kind === 'loading'}
        onClick={() => { if (state.kind !== 'loading') inputRef.current?.click(); }}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDragOver={(event) => {
          if (!event.dataTransfer.types.includes('Files')) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = state.kind === 'loading' ? 'none' : 'copy';
        }}
        onDrop={drop}
        className={`block w-full rounded-md border-2 border-dashed p-6 text-center transition-colors focus-visible:border-violet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet ${dragging ? 'border-violet bg-violet/10' : 'border-gray-300 bg-white'} ${state.kind === 'loading' ? 'cursor-wait opacity-60' : 'cursor-pointer hover:border-violet hover:bg-violet/5'}`}
      >
        <span id="notice-drop-hint" className="block font-semibold text-gray-700">
          {dragging ? 'Drop your notice here' : 'Drag and drop your notice here, or click to choose a file'}
        </span>
        <span role="status" className="mt-2 block break-words text-sm text-gray-600">
          {file ? `Selected: ${file.name}` : `PDF, PNG, JPEG or WebP, up to ${MAX_UPLOAD_MB} MB`}
        </span>
      </button>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" disabled={state.kind === 'loading' || !file} onClick={() => void read('file')}>Read notice</Button>
        <Button variant="quiet" disabled={state.kind === 'loading' || (state.kind === 'confirm' && state.source === 'demo')} onClick={showDemo}>Try demo notice</Button>
        <Button variant="quiet" disabled={state.kind === 'loading'} onClick={() => void read('sample')}>Read sample with AI</Button>
      </div>
      <p className="text-sm text-gray-600">Try demo notice works without AI and uses fictional sample values. It does not read your selected file.</p>
      {state.kind === 'loading' && <div role="status" aria-live="polite"><p>Reading your notice… usually 10–20 s</p><Button variant="quiet" onClick={cancel}>Cancel</Button></div>}
      {state.kind === 'error' && <div role="alert" className="text-sm"><p>{state.message}</p>{state.canRetry && <Button variant="quiet" onClick={() => void read(lastRequest.current)}>Retry</Button>}</div>}
      {state.kind === 'confirm' && <ExtractionConfirmCard key={state.source} extraction={state.extraction} source={state.source} onCancel={cancel} onConfirm={(notice) => { onConfirm(notice, state.source); cancel(); }} />}
    </section>
  );
}
