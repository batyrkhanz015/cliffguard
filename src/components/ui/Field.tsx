import type { ReactNode } from 'react';

/** DOM id for a field name such as "marketplace.incomeEstimate". */
export function fieldIdFor(name: string): string {
  return `field-${name.replaceAll('.', '-')}`;
}

/** Ids of the hint and error, for `aria-describedby`. */
export function describedBy(id: string, parts: { hint?: string; error?: string }): string | undefined {
  const ids = [parts.hint && `${id}-hint`, parts.error && `${id}-error`].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export const INPUT_CLASS =
  'block min-h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-base text-gray-950 placeholder:text-gray-400 focus:border-violet focus:outline-2 focus:outline-offset-0 focus:outline-violet/30 aria-[invalid=true]:border-cliff-strong';

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** For controls without a single labelable element, like a stepper. */
  group?: boolean;
  children: ReactNode;
};

/** Label, hint, control and inline error in a fixed order. */
export function Field({ id, label, hint, error, optional = false, group = false, children }: FieldProps) {
  const labelText = (
    <>
      {label}
      {optional && <span className="font-normal text-gray-500"> (optional)</span>}
    </>
  );
  return (
    <div
      role={group ? 'group' : undefined}
      aria-labelledby={group ? `${id}-label` : undefined}
      aria-describedby={group ? describedBy(id, { hint, error }) : undefined}
    >
      {group ? (
        <span id={`${id}-label`} className="block font-semibold">
          {labelText}
        </span>
      ) : (
        <label htmlFor={id} className="block font-semibold">
          {labelText}
        </label>
      )}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-gray-600">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-cliff-strong">
          {error}
        </p>
      )}
    </div>
  );
}
