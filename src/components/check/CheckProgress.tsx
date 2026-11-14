import type { StepNumber } from '@/lib/check/draft';

export const STEP_LABELS: Record<StepNumber, string> = {
  1: 'Where and who',
  2: 'Marketplace',
  3: 'Plan',
  4: '2026 income',
  5: 'Your options',
};

const STEPS = [1, 2, 3, 4, 5] as const;

export function CheckProgress({ step }: { step: StepNumber }) {
  return (
    <div className="mt-6">
      <p className="type-eyebrow text-violet">
        Step {String(step).padStart(2, '0')} / 05: {STEP_LABELS[step]}
      </p>
      <ol aria-hidden className="mt-3 grid grid-cols-5 gap-1.5">
        {STEPS.map((n) => (
          <li key={n}>
            <span className={`block h-1.5 rounded-sm ${n <= step ? 'bg-violet' : 'bg-gray-300'}`} />
            <span className={`mt-2 hidden text-xs sm:block ${n === step ? 'font-semibold text-gray-950' : 'text-gray-500'}`}>
              {STEP_LABELS[n]}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
