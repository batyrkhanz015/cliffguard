'use client';

const UNLOCK_PANEL_ID = 'plan-access';
const TOOLTIP_ID_PREFIX = 'locked-amount-tip-';

function LockIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="7" width="10" height="7" rx="1" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

function scrollToUnlockPanel() {
  document.getElementById(UNLOCK_PANEL_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** A hidden amount that explains how to reveal it on hover, focus or tap, and jumps to the unlock cards on click. */
export function LockedAmount({ id }: { id: string }) {
  const tooltipId = `${TOOLTIP_ID_PREFIX}${id}`;
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={scrollToUnlockPanel}
        aria-describedby={tooltipId}
        aria-label="Amount locked"
        className="type-display inline-flex cursor-pointer items-center gap-2 text-2xl tabular text-gray-500"
      >
        <LockIcon />
        <span aria-hidden>$•,•••</span>
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute right-0 bottom-full z-10 mb-2 w-60 max-w-[calc(100vw-2rem)] rounded-md bg-night px-3 py-2 text-left text-[13px] leading-snug font-normal text-white opacity-0 shadow-lg transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
      >
        Available with a CliffGuard plan (Rescue or Year). Unlock to see the exact amount.
      </span>
    </span>
  );
}
