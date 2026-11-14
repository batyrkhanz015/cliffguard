type ToastProps = {
  message: string;
  action?: { label: string; onClick: () => void };
  onDismiss: () => void;
};

/** A message pinned above the bottom of the screen, with an optional retry action. */
export function Toast({ message, action, onDismiss }: ToastProps) {
  return (
    <div
      role="alert"
      className="fixed inset-x-4 bottom-24 z-30 mx-auto flex max-w-md items-center gap-3 rounded-md border border-violet/60 bg-night py-2 pl-4 pr-2 text-white shadow-lg sm:bottom-6"
    >
      <span aria-hidden className="size-2.5 shrink-0 bg-cliff" />
      <p className="flex-1 text-sm">{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="min-h-11 rounded-md px-3 text-sm font-semibold text-white underline decoration-violet-link underline-offset-4"
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="flex size-11 items-center justify-center rounded-md text-xl text-gray-400 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
