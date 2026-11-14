import { TY2026 } from './rules/ty2026';
import type { Deadline, LeverId, RuleSet } from './types';

type DateKey = keyof RuleSet['dates'];

/** Dated steps and the levers that end on each; `LEVER_TERMS` in `levers.ts` must agree (tested). */
const STEPS: ReadonlyArray<{ key: DateKey; label: string; levers: LeverId[] }> = [
  { key: 'enrollForJan1', label: 'Last day to pick or change a plan for January 1 coverage', levers: [] },
  {
    key: 'yearEnd',
    label: 'Last day to move income into 2027, buy for the business or delay a stock sale',
    levers: ['invoiceTiming', 'businessPurchases', 'delayStockSale'],
  },
  { key: 'oeEnd', label: 'Open enrollment ends: update your 2027 income estimate', levers: [] },
  { key: 'q4Estimated', label: 'Fourth-quarter estimated tax payment due', levers: [] },
  { key: 'form1095aBy', label: 'Your Form 1095-A should arrive', levers: [] },
  {
    key: 'contributionDeadline',
    label: 'Last day to fund a 2026 HSA, IRA or SEP-IRA, and to file',
    levers: ['hsa', 'traditionalIra', 'sepIra'],
  },
  { key: 'sepExtended', label: 'SEP-IRA deadline if you filed an extension', levers: [] },
];

/** The dated steps on or after `asOf`, soonest first (spec §A.8). Feeds the UI chips and the calendar file. */
export function upcomingDeadlines(asOf: string, rules: RuleSet = TY2026): Deadline[] {
  return STEPS.map(({ key, label, levers }) => ({ date: rules.dates[key], label, levers }))
    .filter(({ date }) => date >= asOf)
    .sort((x, y) => x.date.localeCompare(y.date));
}
