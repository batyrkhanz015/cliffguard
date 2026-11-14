'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LeverId } from '@/engine';
import { checkGig, fetchPlan, type PlanResponse } from './apiClient';
import { createCoalescingWriter } from './coalescingWriter';
import { createLatestGate } from './latest';
import { ACCESS_CHANGED_EVENT, PLAN_CHANGED_EVENT, notifyPlanChanged } from './planEvents';
import type { LoadedHousehold } from './useHousehold';

type Outcome = { ok: false } | { ok: true; response: PlanResponse; netKept: number | null };
type Preferences = { keepMyCash: boolean; leverOrder: LeverId[] };
/** A save waiting its turn; `token` says which request the screen is waiting for. */
type Save = { preferences: Preferences; token: number; announce: boolean };

export type PlanPreviewState = {
  /** The latest computed plan; null until the first one arrives. */
  response: PlanResponse | null;
  /** What the gig leaves you with after the plan; null with no saved gig or if that check failed. */
  netKept: number | null;
  keepMyCash: boolean;
  /** The order the user has set, which may be ahead of `response` while a save is in flight. */
  leverOrder: LeverId[];
  loading: boolean;
  failed: boolean;
  setKeepMyCash: (keepMyCash: boolean) => void;
  moveLever: (leverId: LeverId, direction: -1 | 1) => void;
  retry: () => void;
};

/**
 * The plan preview for the saved gig and preferences. Each toggle or reorder saves the preferences
 * through POST /api/plan, one write at a time (the server cannot order overlapping writes), and
 * only the newest request's response is shown. The gig is the saved one: changing it goes through
 * the gig check, which persists it. Each save the user makes announces itself once, after the plan
 * and the gig check are both done; reloads for outside changes save nothing new and stay quiet.
 */
export function usePlanPreview({ input, lastGig }: LoadedHousehold): PlanPreviewState {
  const [gate] = useState(createLatestGate);
  /** Saves in flight: an outside change that arrives meanwhile is shown once they settle. */
  const ownRequests = useRef(0);
  /** True while we dispatch our own plan-changed event, which must not reload us. */
  const announcing = useRef(false);
  /** Something else changed the plan or access while a save was in flight. */
  const dirty = useRef(false);
  const current = useRef<Preferences>(input.preferences);
  const [keepMyCash, setKeepMyCashState] = useState(input.preferences.keepMyCash);
  const [leverOrder, setLeverOrder] = useState<LeverId[]>(input.preferences.leverOrder);
  const [response, setResponse] = useState<PlanResponse | null>(null);
  const [netKept, setNetKept] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  /** Saves the preferences and fetches the plan and gig net; null when a newer request has superseded it. */
  const compute = useCallback(
    async ({ preferences, token, announce }: Save): Promise<Outcome | null> => {
      ownRequests.current += 1;
      try {
        const planResult = await fetchPlan({ gig: lastGig, ...preferences }, { notify: false });
        if (!gate.isLatest(token)) return null;
        if (!planResult.ok) return { ok: false };
        // The gig check reads the preferences the plan request just saved, and re-saves the same gig.
        const gigResult = lastGig === null ? null : await checkGig(lastGig, { notify: false });
        if (!gate.isLatest(token)) return null;
        if (announce) {
          announcing.current = true;
          notifyPlanChanged();
          announcing.current = false;
        }
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

  const [writer] = useState(() => createCoalescingWriter<Save>());

  useEffect(() => {
    writer.setWrite(async (save) => {
      const outcome = await compute(save);
      if (gate.isLatest(save.token)) apply(outcome);
    });
  }, [writer, compute, apply, gate]);

  const load = useCallback(
    (preferences: Preferences, announce = true) => {
      setLoading(true);
      setFailed(false);
      writer.submit({ preferences, token: gate.begin(), announce });
    },
    [writer, gate],
  );

  useEffect(() => {
    // The state already says "loading", so the first load only submits.
    writer.submit({ preferences: input.preferences, token: gate.begin(), announce: false });
  }, [writer, gate, input]);

  useEffect(() => {
    current.current = { keepMyCash, leverOrder };
  }, [keepMyCash, leverOrder]);

  // Something else changed the plan or the access (an unlock, a check-in): show it.
  useEffect(() => {
    const reload = () => {
      if (announcing.current) return;
      if (ownRequests.current === 0) load(current.current, false);
      else dirty.current = true;
    };
    window.addEventListener(PLAN_CHANGED_EVENT, reload);
    window.addEventListener(ACCESS_CHANGED_EVENT, reload);
    return () => {
      window.removeEventListener(PLAN_CHANGED_EVENT, reload);
      window.removeEventListener(ACCESS_CHANGED_EVENT, reload);
    };
  }, [load]);

  // An outside change that arrived while a save was in flight is shown once the saves settle.
  useEffect(() => {
    if (loading || !dirty.current) return;
    dirty.current = false;
    load(current.current, false);
  }, [loading, load]);

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
