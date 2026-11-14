'use client';

import { useId } from 'react';
import type { LeverId } from '@/engine';
import { usePlanProgress } from './PlanProgress';

export function ProofChecklist({ leverId, proofs }: {
  leverId: LeverId; proofs: string[];
}) {
  const id = useId();
  const context = usePlanProgress();
  const progress = context.progress[leverId] ?? { done: false, proofsChecked: [] };

  return (
    <fieldset disabled={context.saving} className="mt-5 space-y-2 border-t border-hairline pt-4">
      <legend className="px-1 font-semibold">Proof to keep</legend>
      {proofs.map((proof, index) => (
        <label key={proof} htmlFor={`${id}-${index}`} className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm">
          <input id={`${id}-${index}`} type="checkbox" className="mt-0.5 size-5 shrink-0 accent-violet"
            checked={progress.proofsChecked.includes(index)}
            onChange={(event) => { void context.save(leverId, { ...progress, proofsChecked: event.target.checked
              ? [...progress.proofsChecked, index]
              : progress.proofsChecked.filter((value) => value !== index) }); }} />
          {proof}
        </label>
      ))}
      <label className="flex min-h-11 cursor-pointer items-center gap-3 font-semibold">
        <input type="checkbox" className="size-5 accent-violet" checked={progress.done}
          onChange={(event) => { void context.save(leverId, { ...progress, done: event.target.checked }); }} />
        Mark this move complete
      </label>
      <p role="status" className="min-h-5 text-sm text-gray-600">{context.status[leverId]}</p>
    </fieldset>
  );
}
