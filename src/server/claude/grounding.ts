import 'server-only';

/** Currency, grouped numbers, decimals, percentages and date parts share one numeric scanner. */
function numbers(text: string): number[] {
  return [...text.matchAll(/\d+(?:,\d{3})*(?:\.\d+)?/g)].map((match) => Number(match[0].replaceAll(',', '')));
}

export function allowedNumbers(...sources: unknown[]): Set<number> {
  const allowed = new Set(Array.from({ length: 12 }, (_, index) => index + 1));
  const add = (value: number) => {
    if (!Number.isFinite(value)) return;
    const magnitude = Math.abs(value);
    allowed.add(magnitude);
    allowed.add(Math.round(magnitude));
    allowed.add(magnitude * 100);
  };
  const visit = (value: unknown): void => {
    if (typeof value === 'number') add(value);
    else if (typeof value === 'string') numbers(value).forEach((number) => allowed.add(number));
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value !== null && typeof value === 'object') Object.values(value).forEach(visit);
  };
  sources.forEach(visit);
  return allowed;
}

export function ungroundedNumbers(text: string, allowed: Set<number>): number[] {
  return [...new Set(numbers(text).filter((number) => ![...allowed].some((value) => Math.abs(value - number) <= 1)))];
}
