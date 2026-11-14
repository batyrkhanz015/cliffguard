import { z } from 'zod';
import { CheckinBodySchema, type CheckinBody } from './checkinRequest';

const RETRY_KEY = 'cliffguard:pending-checkin:v2';
const LEGACY_RETRY_KEY = 'cliffguard:pending-checkin:v1';
const RETRY_CLEARED_EVENT = 'cliffguard:checkin-retry-cleared';
export const HOUSEHOLD_CHANGED_EVENT = 'cliffguard:household-changed';
const StoredRetrySchema = z.strictObject({ householdScope: z.string().min(1), body: CheckinBodySchema });
const PublicHouseholdSchema = z.object({ household: z.object({ householdScope: z.string().min(1) }) });

/** Erase financial inputs first, then invalidate any mounted form's in-memory retry. */
export function clearPendingCheckin(invalidateMounted = true): void {
  try { sessionStorage.removeItem(RETRY_KEY); sessionStorage.removeItem(LEGACY_RETRY_KEY); } catch { /* Storage can be disabled. */ }
  if (invalidateMounted && typeof window !== 'undefined') window.dispatchEvent(new Event(RETRY_CLEARED_EVENT));
}

export function readPendingCheckin(scope: string): CheckinBody | null {
  try {
    // Unscoped v1 data cannot safely be attributed to the current household.
    sessionStorage.removeItem(LEGACY_RETRY_KEY);
    const text = sessionStorage.getItem(RETRY_KEY);
    if (!text) return null;
    const stored = StoredRetrySchema.safeParse(JSON.parse(text));
    if (stored.success && stored.data.householdScope === scope) return stored.data.body;
    sessionStorage.removeItem(RETRY_KEY);
  } catch { /* Invalid or unavailable browser storage must never become a submitted body. */ }
  return null;
}

export function savePendingCheckin(scope: string, body: CheckinBody): void {
  try {
    sessionStorage.removeItem(LEGACY_RETRY_KEY);
    sessionStorage.setItem(RETRY_KEY, JSON.stringify({ householdScope: scope, body }));
  } catch { /* The mounted form retains its original body when storage is unavailable. */ }
}

/** Reconcile successful reads without treating updatedAt as a household identity. */
export function reconcilePendingCheckin(scope: string | null): void {
  if (scope === null) { clearPendingCheckin(); return; }
  try {
    const legacy = sessionStorage.getItem(LEGACY_RETRY_KEY);
    const text = sessionStorage.getItem(RETRY_KEY);
    if (legacy) { clearPendingCheckin(); return; }
    if (!text) return;
    const stored = StoredRetrySchema.safeParse(JSON.parse(text));
    if (!stored.success || stored.data.householdScope !== scope) clearPendingCheckin();
  } catch { clearPendingCheckin(); }
}

/** Called at the shared successful household-write boundary, including Footer's deletion. */
export function householdWriteSucceeded(method: string, payload: unknown): void {
  const parsed = PublicHouseholdSchema.safeParse(payload);
  const scope = method === 'DELETE' ? null : parsed.success ? parsed.data.household.householdScope : undefined;
  if (scope === undefined) return;
  reconcilePendingCheckin(scope);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(HOUSEHOLD_CHANGED_EVENT, { detail: { scope } }));
}

/** Also clears mounted retries when browser storage is unavailable or was already erased. */
export function subscribeCheckinInvalidation(scope: string, invalidate: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const changed = (event: Event) => {
    const detail: unknown = event instanceof CustomEvent ? event.detail : undefined;
    const changedScope = z.object({ scope: z.string().nullable() }).safeParse(detail);
    if (changedScope.success && changedScope.data.scope !== scope) invalidate();
  };
  window.addEventListener(RETRY_CLEARED_EVENT, invalidate);
  window.addEventListener(HOUSEHOLD_CHANGED_EVENT, changed);
  return () => {
    window.removeEventListener(RETRY_CLEARED_EVENT, invalidate);
    window.removeEventListener(HOUSEHOLD_CHANGED_EVENT, changed);
  };
}
