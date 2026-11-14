import { upcomingDeadlines } from './deadlines';
import type { Diagnosis } from './diagnose';
import { formatDate, usd } from './format';
import { TY2026 } from './rules/ty2026';
import type { Alert, RuleSet } from './types';

/** Where the last check-in left the household. */
export type CheckIn = { magi: number; headroom: number; repayment: number; zone: Diagnosis['zone'] };

/** Assumptions (spec §A.8): a repayment alert at +$250, a deadline alert within 14 days. */
const REPAYMENT_UP_MIN = 250;
const DEADLINE_SOON_DAYS = 14;
const MS_PER_DAY = 86_400_000;

const daysBetween = (fromIsoDate: string, toIsoDate: string): number =>
  Math.round((Date.parse(toIsoDate) - Date.parse(fromIsoDate)) / MS_PER_DAY);

/**
 * What changed since the last check-in (spec §A.8). Static copy filled with engine numbers; with
 * no previous check-in only the alerts that need no comparison can fire.
 */
export function computeAlerts(prev: CheckIn | null, next: Diagnosis, asOf: string, rules: RuleSet = TY2026): Alert[] {
  const alerts: Alert[] = [];

  if (prev !== null && prev.zone !== 'over' && next.zone === 'over') {
    alerts.push({
      code: 'CROSSED_CLIFF',
      message: `Your projected income is now ${usd(-next.headroom)} over the ${usd(next.cliff)} line. You would repay ${usd(next.repayment)} at filing.`,
    });
  }
  if (prev !== null && prev.zone === 'over' && next.zone !== 'over') {
    alerts.push({
      code: 'BACK_UNDER_CLIFF',
      message: `You are back under the ${usd(next.cliff)} line, with ${usd(next.headroom)} to spare.`,
    });
  }
  if (prev !== null && prev.zone === 'clear' && next.zone === 'near') {
    alerts.push({
      code: 'APPROACHING_CLIFF',
      message: `You are within ${usd(next.headroom)} of the ${usd(next.cliff)} line.`,
    });
  }
  if (prev !== null && next.repayment - prev.repayment >= REPAYMENT_UP_MIN) {
    alerts.push({
      code: 'REPAYMENT_UP',
      message: `Your expected repayment rose from ${usd(prev.repayment)} to ${usd(next.repayment)}.`,
    });
  }
  if (next.reportChange.recommended) {
    alerts.push({
      code: 'REPORT_CHANGE',
      message: `Your projected income is ${usd(next.reportChange.incomeToReport)}, well away from your Marketplace estimate. Report the change now.`,
    });
  }
  const soon = upcomingDeadlines(asOf, rules).find(({ date }) => daysBetween(asOf, date) <= DEADLINE_SOON_DAYS);
  if (soon !== undefined) {
    alerts.push({ code: 'DEADLINE_SOON', message: `${formatDate(soon.date)}: ${soon.label}.` });
  }
  return alerts;
}
