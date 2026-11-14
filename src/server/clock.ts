import 'server-only';

const NEW_YORK_DATE = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * The engine's `asOf`: today's date in New York (where the HealthCare.gov and IRS deadlines
 * fall), as an ISO `YYYY-MM-DD`. The only place the server reads the clock for the engine.
 */
export function todayAsOf(now: Date = new Date()): string {
  const parts = Object.fromEntries(NEW_YORK_DATE.formatToParts(now).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
