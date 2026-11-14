/** Notify the layout after a plan request saves preferences; also used by clients with their own fetch helper. */
export const PLAN_CHANGED_EVENT = 'cliffguard:plan-changed';
export function notifyPlanChanged(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(PLAN_CHANGED_EVENT));
}
