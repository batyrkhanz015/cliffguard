import { Field } from './Field';

type StepperProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

const STEP_BUTTON =
  'flex size-12 items-center justify-center rounded-md border border-gray-300 bg-white text-xl font-semibold text-violet hover:border-violet disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:border-gray-300';

/** A whole-number control with minus and plus buttons, for counts like household size. */
export function Stepper({ id, label, hint, error, value, min, max, onChange }: StepperProps) {
  const noun = label.toLowerCase();
  return (
    <Field id={id} label={label} hint={hint} error={error} group>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={STEP_BUTTON}
          aria-label={`Decrease ${noun}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </button>
        <output id={id} aria-live="polite" className="tabular w-10 text-center text-2xl font-bold">
          {value}
        </output>
        <button
          type="button"
          className={STEP_BUTTON}
          aria-label={`Increase ${noun}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </Field>
  );
}
