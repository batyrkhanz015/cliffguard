'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { LeverId } from '@/engine';
import { sendJson } from '@/lib/api';
import type { PlanCoordinator } from '@/lib/planCoordinator';
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

/** The coordinator belongs to PlanAccess and survives this provider's refresh-driven remounts. */
export function PlanProgress({ initial, children, coordinator }: {
  initial: ProgressMap; children: ReactNode; coordinator: PlanCoordinator;
}) {
  const [progress, setProgress] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<ProgressContext['status']>({});

  async function save(leverId: LeverId, next: Progress) {
    await coordinator.mutate(async () => {
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
        setSaving(false);
      }
    });
  }

  return <Context value={{ progress, saving, status, save }}>{children}</Context>;
}

export function usePlanProgress(): ProgressContext {
  const context = useContext(Context);
  if (!context) throw new Error('ProofChecklist needs PlanProgress');
  return context;
}
