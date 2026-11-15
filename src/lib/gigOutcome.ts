import type { Loaded } from './apiClient';
import type { GigCheckView } from './planView';

export type GigOutcome = { result: GigCheckView | null; error: string | null };

const FAILURE = "We couldn't check this offer. Try again.";
const OUT_OF_RANGE = 'Enter an amount above $0 and up to $500,000.';
const RATE_LIMIT_STATUS = 429;

function failureMessage(status: number, retryAfterSec: number | null): string {
  if (status === 400) return OUT_OF_RANGE;
  if (status === RATE_LIMIT_STATUS && retryAfterSec !== null) return `Too many updates, try again in ${retryAfterSec} s.`;
  return FAILURE;
}

/** The state a gig-check response leads to. A failure keeps the previous result on screen. */
export function gigOutcome(previous: GigCheckView | null, response: Loaded<GigCheckView>): GigOutcome {
  if (response.ok) return { result: response.data, error: null };
  return { result: previous, error: failureMessage(response.status, response.retryAfterSec) };
}
