'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendJson } from '@/lib/api';

type DeleteState = 'idle' | 'deleting' | 'failed';

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

  return (
    <footer className="bg-night text-gray-400">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm sm:px-6">
        <p>
          Education, not tax advice. Rules as of Nov 2026.{' '}
          <button
            type="button"
            onClick={deleteMyData}
            disabled={state === 'deleting'}
            aria-busy={state === 'deleting' || undefined}
            className="text-white underline decoration-violet-link underline-offset-4 hover:decoration-white disabled:opacity-60"
          >
            Delete my data
          </button>
          .
        </p>
        <p role="status" className="mt-2 min-h-5 text-cliff">
          {state === 'deleting' && <span className="text-gray-400">Deleting your data…</span>}
          {state === 'failed' && "Couldn't delete your data. Try again."}
        </p>
      </div>
    </footer>
  );
}
