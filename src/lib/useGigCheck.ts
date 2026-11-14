'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { checkGig, type GigOffer } from './apiClient';
import { createLatestGate } from './latest';
import type { GigCheckView } from './planView';

type Outcome = { result: GigCheckView | null; error: string | null };

export type GigCheckState = {
  offer: GigOffer | null;
  result: GigCheckView | null;
  loading: boolean;
  error: string | null;
  /** Checks an offer; only the newest request's response is applied. */
  check: (offer: GigOffer) => void;
  retry: () => void;
};

const FAILURE = "We couldn't check this offer. Try again.";
const OUT_OF_RANGE = 'Enter an amount above $0 and up to $500,000.';

/** The gig check for the saved offer, if any, and for each new offer the user enters. */
export function useGigCheck(saved: GigOffer | null): GigCheckState {
  const gate = useRef(createLatestGate()).current;
  const [offer, setOffer] = useState<GigOffer | null>(saved);
  const [result, setResult] = useState<GigCheckView | null>(null);
  const [loading, setLoading] = useState(saved !== null);
  const [error, setError] = useState<string | null>(null);

  /** The state a response puts us in; null when a newer request has superseded it. */
  const compute = useCallback(
    async (next: GigOffer): Promise<Outcome | null> => {
      const token = gate.begin();
      const response = await checkGig(next);
      if (!gate.isLatest(token)) return null;
      if (response.ok) return { result: response.data, error: null };
      return { result: null, error: response.status === 400 ? OUT_OF_RANGE : FAILURE };
    },
    [gate],
  );

  const apply = useCallback((outcome: Outcome | null) => {
    if (outcome === null) return;
    setLoading(false);
    setError(outcome.error);
    if (outcome.result !== null) setResult(outcome.result);
  }, []);

  const check = useCallback(
    (next: GigOffer) => {
      setOffer(next);
      setLoading(true);
      setError(null);
      void compute(next).then(apply);
    },
    [compute, apply],
  );

  useEffect(() => {
    // The state already says "loading" for a saved offer, so this only fetches.
    if (saved !== null) void compute(saved).then(apply);
  }, [saved, compute, apply]);

  const retry = useCallback(() => {
    if (offer !== null) check(offer);
  }, [offer, check]);

  return { offer, result, loading, error, check, retry };
}
