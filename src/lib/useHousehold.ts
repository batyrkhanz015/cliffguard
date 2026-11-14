'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { Diagnosis, HouseholdInput } from '@/engine';
import { NEEDS_BENCHMARK, fetchHousehold, type GigOffer } from './apiClient';

export type LoadedHousehold = { input: HouseholdInput; lastGig: GigOffer | null; diagnosis: Diagnosis };

export type HouseholdState =
  | { status: 'loading' }
  | { status: 'ready'; household: LoadedHousehold }
  | { status: 'redirecting' }
  | { status: 'error'; retry: () => void };

/**
 * The session's household and diagnosis. Sends the visitor to the landing page when there is none
 * yet, and to the check form's Marketplace step when the benchmark premium is still needed.
 */
export function useHousehold(): HouseholdState {
  const router = useRouter();
  const [state, setState] = useState<HouseholdState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchHousehold().then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        if (NEEDS_BENCHMARK.has(result.code)) {
          setState({ status: 'redirecting' });
          router.replace('/check?step=2');
        } else {
          setState({ status: 'error', retry });
        }
        return;
      }
      const { household, diagnosis } = result.data;
      if (household === null || diagnosis === null) {
        setState({ status: 'redirecting' });
        router.replace('/');
        return;
      }
      setState({ status: 'ready', household: { input: household.input, lastGig: household.lastGig, diagnosis } });
    });
    return () => {
      cancelled = true;
    };
  }, [attempt, router, retry]);

  return state;
}
