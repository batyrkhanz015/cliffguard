/** Notify the layout after a plan request saves preferences; also used by clients with their own fetch helper. */
export const PLAN_CHANGED_EVENT = 'cliffguard:plan-changed';
/**
 * Notify the plan preview that the household's access changed (a demo unlock). Separate from the
 * plan-changed event so the access panel, which refreshes itself on unlock, is not told twice.
 */
export const ACCESS_CHANGED_EVENT = 'cliffguard:access-changed';
export function notifyAccessChanged(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(ACCESS_CHANGED_EVENT));
}
export function notifyPlanChanged(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(PLAN_CHANGED_EVENT));
}
