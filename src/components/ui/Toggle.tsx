type ToggleProps = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible state words beside the switch. */
  onText?: string;
  offText?: string;
};

/** An on/off switch with its question on the left and the answer shown beside it. */
export function Toggle({ id, label, description, checked, onChange, onText = 'Yes', offText = 'No' }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <span id={`${id}-label`} className="block font-semibold">
          {label}
        </span>
        {description && (
          <p id={`${id}-description`} className="mt-1 text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-description` : undefined}
        onClick={() => onChange(!checked)}
        className="flex min-h-11 shrink-0 items-center gap-2 rounded-md px-1"
      >
        <span aria-hidden className="w-7 text-right text-sm font-semibold">
          {checked ? onText : offText}
        </span>
        <span
          aria-hidden
          className={`flex h-7 w-12 items-center rounded-sm p-0.5 transition-colors ${checked ? 'bg-violet' : 'bg-gray-300'}`}
        >
          <span
            className={`size-6 rounded-sm bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </span>
      </button>
    </div>
  );
}
