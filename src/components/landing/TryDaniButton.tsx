'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { sendJson } from '@/lib/api';

type SampleState = 'idle' | 'loading' | 'failed';

/**
 * Stores Dani's sample inputs in the session (the server computes everything), then opens
 * the result. Fixed to the bottom of the screen on phones.
 */
export function TryDaniButton() {
  const router = useRouter();
  const [state, setState] = useState<SampleState>('idle');

  async function trySample() {
    setState('loading');
    const result = await sendJson('POST', '/api/household/sample', { persona: 'dani' });
    if (result.ok) {
      router.push('/result');
      return;
    }
    setState('failed');
  }

  return (
    <>
      <div
        data-mobile-cta
        className="fixed inset-x-0 bottom-0 z-20 border-t border-violet/50 bg-night px-4 py-3 sm:static sm:border-0 sm:bg-transparent sm:p-0"
      >
        <Button
          surface="dark"
          onClick={trySample}
          loading={state === 'loading'}
          loadingLabel="Computing Dani's year…"
          className="w-full sm:w-auto"
        >
          Try Dani&apos;s family
        </Button>
      </div>
      {state === 'failed' && (
        <Toast
          message="Couldn't load the sample, try again"
          action={{ label: 'Retry', onClick: trySample }}
          onDismiss={() => setState('idle')}
        />
      )}
    </>
  );
}
