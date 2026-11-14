'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendJson } from '@/lib/api';

type DeleteState = 'idle' | 'confirming' | 'deleting' | 'failed';

const LINK_BUTTON =
  'inline-flex min-h-11 items-center text-white underline decoration-violet-link underline-offset-4 hover:decoration-white disabled:opacity-60';
const CONFIRM_BUTTON = 'inline-flex min-h-11 items-center rounded-md px-4 font-semibold disabled:opacity-60';

export function Footer() {
  const router = useRouter();
  const [state, setState] = useState<DeleteState>('idle');

  async function deleteMyData() {
    setState('deleting');
    const result = await sendJson('DELETE', '/api/household');
    if (!result.ok) {
      setState('failed');
      return;
    }
    setState('idle');
    router.push('/');
    router.refresh();
  }

  const asking = state === 'confirming' || state === 'deleting';

  return (
    <footer className="bg-night text-gray-400">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm sm:px-6">
        <p>
          Education, not tax advice. Rules as of Nov 2026.{' '}
          <button
            type="button"
            onClick={() => setState('confirming')}
            disabled={asking}
            className={LINK_BUTTON}
          >
            Delete my data
          </button>
          .
        </p>
        {asking && (
          <div role="group" aria-label="Confirm deleting your data" className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-white">Delete everything? This can&apos;t be undone.</p>
            <button
              type="button"
              onClick={deleteMyData}
              disabled={state === 'deleting'}
              aria-busy={state === 'deleting' || undefined}
              className={`${CONFIRM_BUTTON} bg-cliff text-white`}
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setState('idle')}
              disabled={state === 'deleting'}
              className={`${CONFIRM_BUTTON} border border-gray-600 text-white`}
            >
              Cancel
            </button>
          </div>
        )}
        <p role="status" className="min-h-5 text-cliff">
          {state === 'deleting' && <span className="text-gray-400">Deleting your data…</span>}
          {state === 'failed' && "Couldn't delete your data. Try again."}
        </p>
      </div>
    </footer>
  );
}
