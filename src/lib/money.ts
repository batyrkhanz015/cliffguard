/** Reading and writing dollar amounts the way people type them: "$105,000", "105k", "7,294.50". */

/** Optional "$", digits with correct thousands grouping or none, optional decimals, optional "k". */
const MONEY_PATTERN = /^\$?\s*(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?\s*(k)?$/i;
const NEGATIVE_PREFIX = /^[-−]/;
const PARENTHESES = /^\((.*)\)$/;

const WHOLE_DOLLARS = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const WITH_CENTS = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const INPUT_WHOLE = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const INPUT_CENTS = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** A non-negative amount in dollars, rounded to cents, or null if the text isn't one. */
export function parseMoney(text: string): number | null {
  const match = MONEY_PATTERN.exec(text.trim());
  if (match === null) return null;
  const [, whole, fraction = '', thousands] = match;
  const value = Number(whole.replaceAll(',', '') + fraction) * (thousands === undefined ? 1 : 1000);
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
}

/** Like `parseMoney`, but also reads losses written as "-3,000", "−3,000" or "(3,000)". */
export function parseSignedMoney(text: string): number | null {
  const trimmed = text.trim();
  const inParentheses = PARENTHESES.exec(trimmed);
  const magnitudeText = inParentheses?.[1] ?? trimmed.replace(NEGATIVE_PREFIX, '');
  const magnitude = parseMoney(magnitudeText);
  if (magnitude === null) return null;
  const negative = inParentheses !== null || NEGATIVE_PREFIX.test(trimmed);
  return negative && magnitude !== 0 ? -magnitude : magnitude;
}

/** Inline message for text that isn't a valid amount; null when it's valid or blank. */
export function moneyTextError(text: string, opts: { signed?: boolean } = {}): string | null {
  if (text.trim() === '') return null;
  if (opts.signed) {
    return parseSignedMoney(text) === null ? 'Enter a dollar amount, like 2,000 or -2,000 for a loss.' : null;
  }
  if (parseMoney(text) !== null) return null;
  return parseSignedMoney(text) === null
    ? 'Enter a dollar amount, like 105,000 or 105k.'
    : 'Enter an amount of $0 or more.';
}

/** "$105,000", or "$778.50" with `cents`. */
export function formatMoney(amount: number, opts: { cents?: boolean } = {}): string {
  return (opts.cents ? WITH_CENTS : WHOLE_DOLLARS).format(amount);
}

/** The text an amount field shows after it's read: "105,000" or "105,000.50", no symbol. */
export function formatMoneyInput(amount: number): string {
  return (Number.isInteger(amount) ? INPUT_WHOLE : INPUT_CENTS).format(amount);
}
