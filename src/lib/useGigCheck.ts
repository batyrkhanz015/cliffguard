'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { checkGig, type GigOffer } from './apiClient';
import { gigOutcome, type GigOutcome } from './gigOutcome';
import { createLatestGate } from './latest';
import type { GigCheckView } from './planView';

export type GigCheckState = {
  offer: GigOffer | null;
  result: GigCheckView | null;
  loading: boolean;
  error: string | null;
  /** Checks an offer; only the newest request's response is applied. A failure keeps the previous result. */
  check: (offer: GigOffer) => void;
  retry: () => void;
};

/** The gig check for the saved offer, if any, and for each new offer the user enters. */
export function useGigCheck(saved: GigOffer | null): GigCheckState {
  const gate = useRef(createLatestGate()).current;
  const resultRef = useRef<GigCheckView | null>(null);
  const [offer, setOffer] = useState<GigOffer | null>(saved);
  const [result, setResult] = useState<GigCheckView | null>(null);
  const [loading, setLoading] = useState(saved !== null);
  const [error, setError] = useState<string | null>(null);

  /** The state a response puts us in; null when a newer request has superseded it. */
  const compute = useCallback(
    async (next: GigOffer): Promise<GigOutcome | null> => {
      const token = gate.begin();
      const response = await checkGig(next);
      return gate.isLatest(token) ? gigOutcome(resultRef.current, response) : null;
    },
    [gate],
  );

  const apply = useCallback((outcome: GigOutcome | null) => {
    if (outcome === null) return;
    resultRef.current = outcome.result;
    setLoading(false);
    setError(outcome.error);
    setResult(outcome.result);
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
