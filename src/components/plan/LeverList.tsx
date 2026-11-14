import type { LeverId } from '@/engine';

/** One lever in the user's order. A disabled lever carries the reason it can't be used. */
export type LeverRow = { leverId: LeverId; name: string; disabledReason: string | null };

type LeverListProps = {
  /** In the order the plan tries them. */
  rows: readonly LeverRow[];
  onMove: (leverId: LeverId, direction: -1 | 1) => void;
};

const ARROW_BUTTON =
  'flex size-11 items-center justify-center rounded-md border border-gray-300 text-lg text-violet hover:border-violet disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:border-gray-300';

/** The order the plan tries the levers in, with up and down buttons to change it. */
export function LeverList({ rows, onMove }: LeverListProps) {
  return (
    <ol className="space-y-2">
      {rows.map((row, index) => {
        const usable = row.disabledReason === null;
        return (
          <li
            key={row.leverId}
            className={`flex items-center gap-3 rounded-md border p-3 ${usable ? 'border-hairline bg-white' : 'border-hairline bg-air text-gray-500'}`}
          >
            <span aria-hidden className="type-eyebrow w-6 text-violet">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`font-semibold ${usable ? '' : 'text-gray-600'}`}>{row.name}</p>
              {row.disabledReason !== null && <p className="mt-1 text-sm">{row.disabledReason}</p>}
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label={`Move ${row.name} up`}
                disabled={index === 0}
                onClick={() => onMove(row.leverId, -1)}
                className={ARROW_BUTTON}
              >
                <span aria-hidden>↑</span>
              </button>
              <button
                type="button"
                aria-label={`Move ${row.name} down`}
                disabled={index === rows.length - 1}
                onClick={() => onMove(row.leverId, 1)}
                className={ARROW_BUTTON}
              >
                <span aria-hidden>↓</span>
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
