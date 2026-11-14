'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LeverId } from '@/engine';
import { checkGig, fetchPlan, type PlanResponse } from './apiClient';
import type { LoadedHousehold } from './useHousehold';
import { createLatestGate } from './latest';
import { PLAN_CHANGED_EVENT } from './planEvents';

type Outcome = { ok: false } | { ok: true; response: PlanResponse; netKept: number | null };

export type PlanPreviewState = {
  /** The latest computed plan; null until the first one arrives. */
  response: PlanResponse | null;
  /** What the gig leaves you with after the plan; null with no saved gig or if that check failed. */
  netKept: number | null;
  keepMyCash: boolean;
  /** The order the user has set, which may be ahead of `response` while a request is in flight. */
  leverOrder: LeverId[];
  loading: boolean;
  failed: boolean;
  setKeepMyCash: (keepMyCash: boolean) => void;
  moveLever: (leverId: LeverId, direction: -1 | 1) => void;
  retry: () => void;
};

/**
 * The plan preview for the saved gig and preferences. Each toggle or reorder saves the preferences
 * through POST /api/plan; only the newest request's response is shown. The gig is the saved one:
 * changing it goes through the gig check, which persists it.
 */
export function usePlanPreview({ input, lastGig }: LoadedHousehold): PlanPreviewState {
  const gate = useRef(createLatestGate()).current;
  /** Our own requests announce themselves with the plan-changed event; those must not reload us. */
  const ownRequests = useRef(0);
  const current = useRef({ keepMyCash: input.preferences.keepMyCash, leverOrder: input.preferences.leverOrder });
  const [keepMyCash, setKeepMyCashState] = useState(input.preferences.keepMyCash);
  const [leverOrder, setLeverOrder] = useState<LeverId[]>(input.preferences.leverOrder);
  const [response, setResponse] = useState<PlanResponse | null>(null);
  const [netKept, setNetKept] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  /** Fetches the plan and gig net for these preferences; null when a newer request has superseded it. */
  const compute = useCallback(
    async (preferences: { keepMyCash: boolean; leverOrder: LeverId[] }): Promise<Outcome | null> => {
      const token = gate.begin();
      ownRequests.current += 1;
      try {
        const planResult = await fetchPlan({ gig: lastGig, ...preferences });
        if (!gate.isLatest(token)) return null;
        if (!planResult.ok) return { ok: false };
        // The gig check reads the preferences the plan request just saved.
        const gigResult = lastGig === null ? null : await checkGig(lastGig);
        if (!gate.isLatest(token)) return null;
        const withPlan = gigResult?.ok ? gigResult.data.options.find((option) => option.id === 'take_with_plan') : undefined;
        return { ok: true, response: planResult.data, netKept: withPlan?.netFromGig ?? null };
      } finally {
        ownRequests.current -= 1;
      }
    },
    [gate, lastGig],
  );

  const apply = useCallback((outcome: Outcome | null) => {
    if (outcome === null) return;
    setLoading(false);
    setFailed(!outcome.ok);
    if (!outcome.ok) return;
    setResponse(outcome.response);
    setLeverOrder(outcome.response.levers.map((row) => row.leverId));
    setNetKept(outcome.netKept);
  }, []);

  const load = useCallback(
    (preferences: { keepMyCash: boolean; leverOrder: LeverId[] }) => {
      setLoading(true);
      setFailed(false);
      void compute(preferences).then(apply);
    },
    [compute, apply],
  );

  useEffect(() => {
    // The state already says "loading", so the first load only fetches.
    void compute({ keepMyCash: input.preferences.keepMyCash, leverOrder: input.preferences.leverOrder }).then(apply);
  }, [compute, apply, input]);

  useEffect(() => {
    current.current = { keepMyCash, leverOrder };
  }, [keepMyCash, leverOrder]);

  // Something else changed the plan or the access (an unlock, a check-in): show it.
  useEffect(() => {
    const reload = () => {
      if (ownRequests.current === 0) load(current.current);
    };
    window.addEventListener(PLAN_CHANGED_EVENT, reload);
    return () => window.removeEventListener(PLAN_CHANGED_EVENT, reload);
  }, [load]);

  const setKeepMyCash = useCallback(
    (next: boolean) => {
      setKeepMyCashState(next);
      load({ keepMyCash: next, leverOrder });
    },
    [load, leverOrder],
  );

  const moveLever = useCallback(
    (leverId: LeverId, direction: -1 | 1) => {
      const from = leverOrder.indexOf(leverId);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= leverOrder.length) return;
      const next = [...leverOrder];
      [next[from], next[to]] = [next[to], next[from]];
      setLeverOrder(next);
      load({ keepMyCash, leverOrder: next });
    },
    [load, keepMyCash, leverOrder],
  );

  const retry = useCallback(() => load({ keepMyCash, leverOrder }), [load, keepMyCash, leverOrder]);

  return { response, netKept, keepMyCash, leverOrder, loading, failed, setKeepMyCash, moveLever, retry };
}
