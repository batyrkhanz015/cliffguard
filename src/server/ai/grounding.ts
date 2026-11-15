import 'server-only';

/** Currency, grouped numbers, decimals, percentages and date parts share one numeric scanner. */
function numbers(text: string): number[] {
  return [...text.matchAll(/\d+(?:,\d{3})*(?:\.\d+)?/g)].map((match) => Number(match[0].replaceAll(',', '')));
}

/** Figures from this size up must match an allowed value exactly; smaller ones are counts, months and rates. */
const EXACT_FROM = 13;
const SMALL_TOLERANCE = 1;

/** Cents precision, so 22.000000000000004 and 22 are the same figure. */
const canonical = (value: number): number => Number(value.toFixed(2));

export function allowedNumbers(...sources: unknown[]): Set<number> {
  const allowed = new Set(Array.from({ length: 12 }, (_, index) => index + 1));
  const add = (value: number) => {
    if (!Number.isFinite(value)) return;
    const magnitude = Math.abs(value);
    allowed.add(canonical(magnitude));
    allowed.add(Math.round(magnitude));
    // Rates are fractions the engine prints as percentages (0.22 as 22%).
    if (magnitude <= 1) allowed.add(canonical(magnitude * 100));
  };
  const visit = (value: unknown): void => {
    if (typeof value === 'number') add(value);
    else if (typeof value === 'string') numbers(value).forEach((number) => allowed.add(canonical(number)));
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value !== null && typeof value === 'object') Object.values(value).forEach(visit);
  };
  sources.forEach(visit);
  return allowed;
}

function isGrounded(number: number, allowed: Set<number>): boolean {
  if (allowed.has(canonical(number))) return true;
  return number < EXACT_FROM && [...allowed].some((value) => Math.abs(value - number) <= SMALL_TOLERANCE);
}

export function ungroundedNumbers(text: string, allowed: Set<number>): number[] {
  return [...new Set(numbers(text).filter((number) => !isGrounded(number, allowed)))];
}
