'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { sendJson } from '@/lib/api';

type SampleState = 'idle' | 'loading' | 'failed';

/**
 * Stores Dani's sample inputs in the session (the server computes everything), then opens
 * the result.
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
      <Button
        onClick={trySample}
        loading={state === 'loading'}
        loadingLabel="Computing Dani's year…"
        className="w-full whitespace-nowrap sm:w-auto"
      >
        Try Dani&apos;s family
      </Button>
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
