/** How long the December moves stay open. */
export function DaysLeftChip({ daysToYearEnd }: { daysToYearEnd: number }) {
  const label =
    daysToYearEnd === 0
      ? '2026 is over: only IRA, HSA and SEP moves are still open'
      : `${daysToYearEnd} ${daysToYearEnd === 1 ? 'day' : 'days'} left to act in 2026`;
  return (
    <p className="type-eyebrow inline-flex items-center gap-2 border border-violet bg-white px-3 py-2 text-violet">
      <span aria-hidden className="size-2 bg-violet" />
      {label}
    </p>
  );
}
