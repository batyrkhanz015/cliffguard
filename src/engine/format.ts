/** Display helpers for static engine copy. */

/** 1697.4 → "$1,697". */
export function usd(amount: number): string {
  return `$${Math.round(Math.abs(amount)).toLocaleString('en-US')}`;
}

/** "2026-12-31" → "Dec 31, 2026". */
export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** "1 move brings" / "3 moves bring". */
export const movesBring = (count: number): string => (count === 1 ? '1 move brings' : `${count} moves bring`);
