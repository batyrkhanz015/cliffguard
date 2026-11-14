import { describedBy, fieldIdFor } from './Field';

export type Choice<T extends string> = { value: T; label: string };

type ChoiceGroupProps<T extends string> = {
  /** Field path, e.g. "marketplace.planMetal". */
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  options: readonly Choice<T>[];
  value: T | '';
  onChange: (value: T) => void;
};

/** One-of-several choice shown as tappable tiles backed by native radio buttons. */
export function ChoiceGroup<T extends string>({ name, legend, hint, error, options, value, onChange }: ChoiceGroupProps<T>) {
  const id = fieldIdFor(name);
  return (
    <fieldset
      role="radiogroup"
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, { hint, error })}
    >
      <legend className="font-semibold">{legend}</legend>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-gray-600">
          {hint}
        </p>
      )}
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 has-checked:border-violet has-checked:bg-violet/5 has-focus-visible:outline-2 has-focus-visible:outline-violet-link"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="size-4 shrink-0 accent-violet"
            />
            <span className="text-sm font-medium sm:text-base">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-cliff-strong">
          {error}
        </p>
      )}
    </fieldset>
  );
}
