import { FLAG_CAVEATS, type FlagCode } from '@/engine';

/** What to keep in mind about these numbers; hidden when nothing applies. */
export function FlagsAccordion({ flags }: { flags: readonly FlagCode[] }) {
  if (flags.length === 0) return null;
  return (
    <details className="group rounded-md border border-hairline bg-white">
      <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 p-4 font-semibold text-violet">
        Good to know ({flags.length})
        <span aria-hidden className="text-xl transition-transform group-open:rotate-45">+</span>
      </summary>
      <ul className="space-y-3 border-t border-hairline p-4 text-sm text-gray-700">
        {flags.map((flag) => (
          <li key={flag} className="flex gap-3">
            <span aria-hidden className="mt-1.5 size-2 shrink-0 bg-violet" />
            {FLAG_CAVEATS[flag]}
          </li>
        ))}
      </ul>
    </details>
  );
}
