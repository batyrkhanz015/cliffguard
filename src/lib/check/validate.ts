import type { z } from 'zod';
import { DEFAULT_LEVER_ORDER, HouseholdInputSchema, type HouseholdInput } from '@/engine/types';
import { formatMoney, moneyTextError, parseMoney, parseSignedMoney } from '@/lib/money';
import {
  DEFAULT_ADULT_LABELS,
  FIELD,
  adultField,
  benchmarkFieldShown,
  isJoint,
  type CheckDraft,
  type FieldErrors,
  type StepNumber,
} from './draft';

export const MFS_UNSUPPORTED =
  "CliffGuard can't check separate returns. Married couples who file separately usually can't get the premium tax credit.";

export type DraftValidation = { ok: true; input: HouseholdInput } | { ok: false; errors: FieldErrors };

function messageFor(issue: z.core.$ZodIssue): string {
  if (issue.message === 'FILING_STATUS_UNSUPPORTED') return MFS_UNSUPPORTED;
  if (issue.code === 'too_big' && issue.origin === 'number') return `Enter ${formatMoney(Number(issue.maximum))} or less.`;
  if (issue.code === 'too_big' && issue.origin === 'string') return `Use ${issue.maximum} characters or fewer.`;
  return issue.message;
}

/**
 * Reads the draft into a `HouseholdInput` and checks it with `HouseholdInputSchema`, the
 * same schema the server uses. Blank optional amounts count as zero.
 */
export function validateDraft(draft: CheckDraft): DraftValidation {
  const errors: FieldErrors = {};

  /** The typed amount, or null when blank. Records an error for missing or unreadable text. */
  function amount(path: string, typed: string, opts: { required?: string; signed?: boolean } = {}): number | null {
    if (typed.trim() === '') {
      if (opts.required !== undefined) errors[path] = opts.required;
      return null;
    }
    const value = opts.signed ? parseSignedMoney(typed) : parseMoney(typed);
    if (value === null) errors[path] = moneyTextError(typed, { signed: opts.signed }) ?? 'Enter a dollar amount.';
    return value;
  }
  const optional = (path: string, typed: string) => amount(path, typed) ?? 0;

  if (draft.state === '') errors[FIELD.state] = 'Choose your state.';
  if (draft.filingStatus === '') errors[FIELD.filingStatus] = 'Choose how you file your taxes.';
  if (draft.planMetal === '') errors[FIELD.planMetal] = "Choose your plan's metal level, or Not sure.";
  if (draft.coverage === '') errors[FIELD.coverage] = 'Choose who the plan covers.';

  const adults = draft.adults.slice(0, isJoint(draft) ? 2 : 1).map((adult, i) => ({
    id: i === 0 ? 'a' : 'b',
    label: adult.label.trim() || DEFAULT_ADULT_LABELS[i],
    selfEmploymentProfit: {
      ytd: optional(adultField(i, 'seYtd'), adult.seYtd),
      expectedRest: optional(adultField(i, 'seRest'), adult.seRest),
    },
    wages: {
      ytd: optional(adultField(i, 'wagesYtd'), adult.wagesYtd),
      expectedRest: optional(adultField(i, 'wagesRest'), adult.wagesRest),
    },
    coveredByWorkplacePlan: adult.covered,
    contributedSoFar: {
      traditionalIra: optional(adultField(i, 'iraSoFar'), adult.iraSoFar),
      sepIra: optional(adultField(i, 'sepSoFar'), adult.sepSoFar),
    },
  }));

  const candidate = {
    coverageYear: 2026,
    state: draft.state,
    filingStatus: draft.filingStatus,
    householdSize: draft.householdSize,
    adults,
    marketplace: {
      incomeEstimate: amount(FIELD.incomeEstimate, draft.incomeEstimate, {
        required: 'Enter the income you estimated, even a rough number.',
      }) ?? 0,
      aptcMonthly: amount(FIELD.aptcMonthly, draft.aptcMonthly, {
        required: "Enter your monthly credit. Use 0 if you don't get one.",
      }) ?? 0,
      monthsWithAptc: draft.monthsWithAptc,
      tookFullCredit: draft.tookFullCredit,
      householdUnchanged: draft.householdUnchanged,
      slcspAnnualOverride: benchmarkFieldShown(draft)
        ? amount(FIELD.benchmark, draft.benchmarkAnnual, {
            required: "Enter your benchmark plan's yearly cost. We can't work it out for you here.",
          })
        : null,
      premiumMonthly: amount(FIELD.premiumMonthly, draft.premiumMonthly),
      planMetal: draft.planMetal,
      coverage: draft.coverage,
    },
    investments: {
      taxableInterest: optional(FIELD.taxableInterest, draft.taxableInterest),
      taxExemptInterest: optional(FIELD.taxExemptInterest, draft.taxExemptInterest),
      dividends: optional(FIELD.dividends, draft.dividends),
      capitalGainsNet: amount(FIELD.capitalGainsNet, draft.capitalGainsNet, { signed: true }) ?? 0,
      otherIncome: optional(FIELD.otherIncome, draft.otherIncome),
      otherMagiAddbacks: optional(FIELD.otherMagiAddbacks, draft.otherMagiAddbacks),
    },
    adjustments: {
      hsaContributedSoFar: optional(FIELD.hsaSoFar, draft.hsaSoFar),
      otherAboveTheLine: optional(FIELD.otherAboveTheLine, draft.otherAboveTheLine),
    },
    levers: {
      unbilledInvoicesMovable: optional(FIELD.unbilledInvoices, draft.unbilledInvoices),
      plannedPurchases: optional(FIELD.plannedPurchases, draft.plannedPurchases),
      plannedStockSaleGains: optional(FIELD.plannedStockSaleGains, draft.plannedStockSaleGains),
    },
    preferences: { keepMyCash: true, leverOrder: [...DEFAULT_LEVER_ORDER] },
  };

  const parsed = HouseholdInputSchema.safeParse(candidate);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors[issue.path.map(String).join('.')] ??= messageFor(issue);
    }
  }
  if (!parsed.success || Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, input: parsed.data };
}

const STEP_4_ADULT = /^adults\.\d\.(label|selfEmploymentProfit|wages)\b/;
const STEP_5_ADULT = /^adults\.\d\.(contributedSoFar|coveredByWorkplacePlan)\b/;

/** Which of the five steps asks for a field. */
export function stepForField(path: string): StepNumber {
  if (STEP_5_ADULT.test(path) || path.startsWith('levers.') || path === FIELD.hsaSoFar) return 5;
  if (STEP_4_ADULT.test(path) || path.startsWith('investments.') || path.startsWith('adjustments.')) return 4;
  if (path === FIELD.planMetal || path === FIELD.coverage) return 3;
  if (path.startsWith('marketplace.')) return 2;
  return 1;
}

export function errorsForStep(errors: FieldErrors, step: StepNumber): FieldErrors {
  return Object.fromEntries(Object.entries(errors).filter(([path]) => stepForField(path) === step));
}

export function firstStepWithError(errors: FieldErrors): StepNumber | null {
  return Object.keys(errors)
    .map(stepForField)
    .reduce<StepNumber | null>((first, step) => (first === null || step < first ? step : first), null);
}
