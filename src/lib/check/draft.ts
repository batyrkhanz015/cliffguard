import type { HouseholdInput, UsStateCode } from '@/engine/types';
import { formatMoneyInput } from '@/lib/money';

/**
 * The check form's state: amounts stay as the text people typed until `validateDraft`
 * reads them into a `HouseholdInput`. Field paths match `HouseholdInput` paths, so schema
 * issues land on the right field.
 */

export type FilingChoice = HouseholdInput['filingStatus'] | 'mfs';
export type PlanMetal = HouseholdInput['marketplace']['planMetal'];
export type Coverage = HouseholdInput['marketplace']['coverage'];
export type AdultIndex = 0 | 1;
export type StepNumber = 1 | 2 | 3 | 4 | 5;
export type FieldErrors = Partial<Record<string, string>>;

export type AdultDraft = {
  label: string;
  seYtd: string;
  seRest: string;
  wagesYtd: string;
  wagesRest: string;
  covered: boolean;
  iraSoFar: string;
  sepSoFar: string;
};

export type CheckDraft = {
  state: UsStateCode | '';
  filingStatus: FilingChoice | '';
  householdSize: number;
  /** The second adult is used only when filing jointly. */
  adults: [AdultDraft, AdultDraft];
  incomeEstimate: string;
  aptcMonthly: string;
  monthsWithAptc: number;
  premiumMonthly: string;
  tookFullCredit: boolean;
  householdUnchanged: boolean;
  /** Set when the server can't derive the benchmark, so the manual field shows. */
  manualBenchmark: boolean;
  benchmarkAnnual: string;
  planMetal: PlanMetal | '';
  coverage: Coverage | '';
  taxableInterest: string;
  taxExemptInterest: string;
  dividends: string;
  capitalGainsNet: string;
  otherIncome: string;
  otherMagiAddbacks: string;
  otherAboveTheLine: string;
  hsaSoFar: string;
  unbilledInvoices: string;
  plannedPurchases: string;
  plannedStockSaleGains: string;
};

export type StepProps = {
  draft: CheckDraft;
  errors: FieldErrors;
  onChange: (patch: Partial<CheckDraft>) => void;
  onAdultChange: (index: AdultIndex, patch: Partial<AdultDraft>) => void;
};

export const DEFAULT_ADULT_LABELS = ['You', 'Spouse'] as const;

export const FIELD = {
  state: 'state',
  filingStatus: 'filingStatus',
  householdSize: 'householdSize',
  incomeEstimate: 'marketplace.incomeEstimate',
  aptcMonthly: 'marketplace.aptcMonthly',
  monthsWithAptc: 'marketplace.monthsWithAptc',
  premiumMonthly: 'marketplace.premiumMonthly',
  tookFullCredit: 'marketplace.tookFullCredit',
  householdUnchanged: 'marketplace.householdUnchanged',
  benchmark: 'marketplace.slcspAnnualOverride',
  planMetal: 'marketplace.planMetal',
  coverage: 'marketplace.coverage',
  taxableInterest: 'investments.taxableInterest',
  taxExemptInterest: 'investments.taxExemptInterest',
  dividends: 'investments.dividends',
  capitalGainsNet: 'investments.capitalGainsNet',
  otherIncome: 'investments.otherIncome',
  otherMagiAddbacks: 'investments.otherMagiAddbacks',
  otherAboveTheLine: 'adjustments.otherAboveTheLine',
  hsaSoFar: 'adjustments.hsaContributedSoFar',
  unbilledInvoices: 'levers.unbilledInvoicesMovable',
  plannedPurchases: 'levers.plannedPurchases',
  plannedStockSaleGains: 'levers.plannedStockSaleGains',
} as const;

const ADULT_FIELD: Record<keyof AdultDraft, string> = {
  label: 'label',
  seYtd: 'selfEmploymentProfit.ytd',
  seRest: 'selfEmploymentProfit.expectedRest',
  wagesYtd: 'wages.ytd',
  wagesRest: 'wages.expectedRest',
  covered: 'coveredByWorkplacePlan',
  iraSoFar: 'contributedSoFar.traditionalIra',
  sepSoFar: 'contributedSoFar.sepIra',
};

export function adultField(index: number, key: keyof AdultDraft): string {
  return `adults.${index}.${ADULT_FIELD[key]}`;
}

export function isJoint(draft: Pick<CheckDraft, 'filingStatus'>): boolean {
  return draft.filingStatus === 'mfj';
}

/** Joint filers have both spouses in the tax household. */
export function minHouseholdSize(filingStatus: CheckDraft['filingStatus']): number {
  return filingStatus === 'mfj' ? 2 : 1;
}

/** The benchmark can't be derived when a guard fails, so the user enters it. */
export function benchmarkFieldShown(draft: CheckDraft): boolean {
  return !draft.tookFullCredit || !draft.householdUnchanged || draft.manualBenchmark;
}

const EMPTY_ADULT: AdultDraft = {
  label: '',
  seYtd: '',
  seRest: '',
  wagesYtd: '',
  wagesRest: '',
  covered: false,
  iraSoFar: '',
  sepSoFar: '',
};

/** First visit: nothing filled in; placeholders carry the examples. */
export const EMPTY_DRAFT: CheckDraft = {
  state: '',
  filingStatus: '',
  householdSize: 1,
  adults: [EMPTY_ADULT, EMPTY_ADULT],
  incomeEstimate: '',
  aptcMonthly: '',
  monthsWithAptc: 12,
  premiumMonthly: '',
  tookFullCredit: true,
  householdUnchanged: true,
  manualBenchmark: false,
  benchmarkAnnual: '',
  planMetal: '',
  coverage: '',
  taxableInterest: '',
  taxExemptInterest: '',
  dividends: '',
  capitalGainsNet: '',
  otherIncome: '',
  otherMagiAddbacks: '',
  otherAboveTheLine: '',
  hsaSoFar: '',
  unbilledInvoices: '',
  plannedPurchases: '',
  plannedStockSaleGains: '',
};

/** Optional amounts show blank for zero; required ones keep a typed "0". */
function text(amount: number | null, keepZero = false): string {
  if (amount === null || (amount === 0 && !keepZero)) return '';
  return formatMoneyInput(amount);
}

function adultDraft(adult: HouseholdInput['adults'][number]): AdultDraft {
  return {
    label: adult.label,
    seYtd: text(adult.selfEmploymentProfit.ytd),
    seRest: text(adult.selfEmploymentProfit.expectedRest),
    wagesYtd: text(adult.wages.ytd),
    wagesRest: text(adult.wages.expectedRest),
    covered: adult.coveredByWorkplacePlan,
    iraSoFar: text(adult.contributedSoFar.traditionalIra),
    sepSoFar: text(adult.contributedSoFar.sepIra),
  };
}

/** Fills the form from an existing input, e.g. Dani's sample. */
export function draftFromInput(input: HouseholdInput): CheckDraft {
  const [first, second] = input.adults;
  const { marketplace: m, investments: inv } = input;
  return {
    state: input.state,
    filingStatus: input.filingStatus,
    householdSize: input.householdSize,
    adults: [adultDraft(first), second === undefined ? EMPTY_ADULT : adultDraft(second)],
    incomeEstimate: text(m.incomeEstimate, true),
    aptcMonthly: text(m.aptcMonthly, true),
    monthsWithAptc: m.monthsWithAptc,
    premiumMonthly: text(m.premiumMonthly),
    tookFullCredit: m.tookFullCredit,
    householdUnchanged: m.householdUnchanged,
    manualBenchmark: m.slcspAnnualOverride !== null,
    benchmarkAnnual: text(m.slcspAnnualOverride),
    planMetal: m.planMetal,
    coverage: m.coverage,
    taxableInterest: text(inv.taxableInterest),
    taxExemptInterest: text(inv.taxExemptInterest),
    dividends: text(inv.dividends),
    capitalGainsNet: text(inv.capitalGainsNet),
    otherIncome: text(inv.otherIncome),
    otherMagiAddbacks: text(inv.otherMagiAddbacks),
    otherAboveTheLine: text(input.adjustments.otherAboveTheLine),
    hsaSoFar: text(input.adjustments.hsaContributedSoFar),
    unbilledInvoices: text(input.levers.unbilledInvoicesMovable),
    plannedPurchases: text(input.levers.plannedPurchases),
    plannedStockSaleGains: text(input.levers.plannedStockSaleGains),
  };
}
