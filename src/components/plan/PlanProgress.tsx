'use client';

import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import type { LeverId } from '@/engine';
import { sendJson } from '@/lib/api';
import type { HouseholdRecord } from '@/server/household';

type ProgressMap = HouseholdRecord['planProgress'];
type Progress = NonNullable<ProgressMap[LeverId]>;
type ProgressContext = {
  progress: ProgressMap;
  saving: boolean;
  status: Partial<Record<LeverId, string>>;
  save: (leverId: LeverId, next: Progress) => Promise<void>;
};
const Context = createContext<ProgressContext | null>(null);

/** One synchronous lock for the entire panel: T6 progress writes the full household record. */
export function PlanProgress({ initial, children }: { initial: ProgressMap; children: ReactNode }) {
  const [progress, setProgress] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<ProgressContext['status']>({});
  const lock = useRef(false);

  async function save(leverId: LeverId, next: Progress) {
    if (lock.current) return;
    lock.current = true;
    setSaving(true);
    setStatus((current) => ({ ...current, [leverId]: 'Saving…' }));
    try {
      const result = await sendJson('PATCH', '/api/plan/progress', { leverId, done: next.done, proofsChecked: next.proofsChecked });
      if (result.ok) {
        setProgress((current) => ({ ...current, [leverId]: next }));
        setStatus((current) => ({ ...current, [leverId]: 'Saved' }));
      } else {
        const message = result.code === 'NOT_ENTITLED' ? 'Access has expired. Unlock the plan again.' : 'Could not save. Your previous checkmarks are kept. Try again.';
        setStatus((current) => ({ ...current, [leverId]: message }));
      }
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }

  return <Context value={{ progress, saving, status, save }}>{children}</Context>;
}

export function usePlanProgress(): ProgressContext {
  const context = useContext(Context);
  if (!context) throw new Error('ProofChecklist needs PlanProgress');
  return context;
}
