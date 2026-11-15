import { z } from 'zod';

/** Engine contract: input schemas (spec §A.1), shared types and the rule-set shape (spec §A.2). */

export const US_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC',
  'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
] as const;
export const UsStateCodeSchema = z.enum(US_STATE_CODES);
export type UsStateCode = z.infer<typeof UsStateCodeSchema>;

export const AdultIdSchema = z.enum(['a', 'b']);
export type AdultId = z.infer<typeof AdultIdSchema>;

export const LeverIdSchema = z.enum([
  'invoiceTiming', 'businessPurchases', 'hsa', 'delayStockSale', 'traditionalIra', 'sepIra',
]);
export type LeverId = z.infer<typeof LeverIdSchema>;

/** Levers that keep the money spendable; the only ones used when "Keep my cash" is on. */
export const LIQUID_LEVERS: readonly LeverId[] = ['invoiceTiming', 'businessPurchases', 'hsa', 'delayStockSale'];
export const DEFAULT_LEVER_ORDER: readonly LeverId[] = [...LIQUID_LEVERS, 'traditionalIra', 'sepIra'];

export type FilingStatus = 'single' | 'mfj' | 'hoh';
const SUPPORTED_FILING_STATUSES = ['single', 'mfj', 'hoh'] as const satisfies readonly FilingStatus[];

/** USD, finite, ≥ 0. */
const Money = z.number().min(0);

/** projected = ytd + expectedRest */
const AmountSchema = z.object({ ytd: Money, expectedRest: Money });

export const AdultInputSchema = z.object({
  id: AdultIdSchema,
  label: z.string().trim().min(1).max(24),
  selfEmploymentProfit: AmountSchema,
  wages: AmountSchema,
  coveredByWorkplacePlan: z.boolean(),
  contributedSoFar: z.object({ traditionalIra: Money, sepIra: Money }),
});
export type AdultInput = z.infer<typeof AdultInputSchema>;

export const HouseholdInputSchema = z
  .object({
    coverageYear: z.literal(2026),
    state: UsStateCodeSchema,
    filingStatus: z.enum(SUPPORTED_FILING_STATUSES, {
      error: (issue) => (issue.input === 'mfs' ? 'FILING_STATUS_UNSUPPORTED' : undefined),
    }),
    householdSize: z.number().int().min(1).max(10),
    adults: z.union([z.tuple([AdultInputSchema]), z.tuple([AdultInputSchema, AdultInputSchema])]),
    marketplace: z.object({
      incomeEstimate: Money,
      aptcMonthly: Money.max(10_000),
      monthsWithAptc: z.number().int().min(1).max(12).default(12),
      tookFullCredit: z.boolean(),
      householdUnchanged: z.boolean(),
      slcspAnnualOverride: Money.nullable(),
      premiumMonthly: Money.nullable(),
      planMetal: z.enum(['bronze', 'catastrophic', 'silver', 'gold', 'platinum', 'unknown']),
      coverage: z.enum(['self', 'family']),
    }),
    investments: z.object({
      taxableInterest: Money,
      taxExemptInterest: Money,
      dividends: Money,
      capitalGainsNet: z.number(),
      otherIncome: Money,
      otherMagiAddbacks: Money,
    }),
    adjustments: z.object({ hsaContributedSoFar: Money, otherAboveTheLine: Money }),
    levers: z.object({
      unbilledInvoicesMovable: Money,
      plannedPurchases: Money,
      plannedStockSaleGains: Money,
    }),
    preferences: z.object({ keepMyCash: z.boolean(), leverOrder: z.array(LeverIdSchema) }),
  })
  .superRefine((input, ctx) => {
    const [first, second] = input.adults;
    if (first.id !== 'a' || (second !== undefined && second.id !== 'b')) {
      ctx.addIssue({ code: 'custom', path: ['adults'], message: 'Adults must be ordered a, then b' });
    }
    if (second !== undefined && input.filingStatus !== 'mfj') {
      ctx.addIssue({ code: 'custom', path: ['adults'], message: 'A second adult requires filing jointly' });
    }
    if (input.householdSize < input.adults.length) {
      ctx.addIssue({ code: 'custom', path: ['householdSize'], message: 'Household is smaller than its adults' });
    }
    if (new Set(input.preferences.leverOrder).size !== input.preferences.leverOrder.length) {
      ctx.addIssue({ code: 'custom', path: ['preferences', 'leverOrder'], message: 'Lever order repeats a lever' });
    }
  });
export type HouseholdInput = z.infer<typeof HouseholdInputSchema>;

export const ScenarioSchema = z.object({
  /** 1099 income, added to the SE adult. */
  gig: z.object({ amount: Money, canBillInJanuary: z.boolean() }).nullable(),
  /** What-if deltas; may be negative. */
  extra: z
    .object({
      selfEmployment: z.number().optional(),
      wages: z.number().optional(),
      capitalGains: z.number().optional(),
      interestOrDividends: z.number().optional(),
    })
    .optional(),
  asOf: z.iso.date(),
});
export type Scenario = z.infer<typeof ScenarioSchema>;

/** Dollars moved by each lever; `traditionalIra` is per adult. */
export type LeverAmounts = {
  invoiceTiming: number;
  businessPurchases: number;
  hsa: number;
  delayStockSale: number;
  traditionalIra: Record<AdultId, number>;
  sepIra: number;
};
/** Shared default; frozen so no caller can change it for everyone. Spread it to build amounts. */
export const ZERO_LEVERS: LeverAmounts = Object.freeze({
  invoiceTiming: 0,
  businessPurchases: 0,
  hsa: 0,
  delayStockSale: 0,
  traditionalIra: Object.freeze({ a: 0, b: 0 }),
  sepIra: 0,
});

/** Diagnosis flags (spec §A.10 plus the G2 plan changes). Each has static UI copy. */
export type FlagCode =
  | 'NO_APTC'
  | 'PARTIAL_YEAR'
  | 'CAPITAL_LOSS_LIMITED'
  | 'BELOW_100_FPL'
  | 'SBM_STATE'
  | 'SEHI_DEDUCTION_EXCLUDED'
  | 'AGE_CATCHUP_EXCLUDED'
  | 'ROUGH_TAX_ESTIMATE'
  | 'CATASTROPHIC_NO_PTC'
  | 'IRA_SEP_COMBO_EXCLUDED'
  | 'NEAR_CLIFF_STEP';

/** Where the money goes; `locked` is retirement money, never used when "Keep my cash" is on. */
export type Liquidity = 'arrives_january' | 'planned_purchase' | 'mostly_liquid' | 'stays_invested' | 'locked';

/** One step of a rescue plan (spec §A.6). The text fields are static copy from `levers.ts`. */
export type Move = {
  leverId: LeverId;
  /** Set for the traditional IRA (per adult) and the SEP-IRA (the SE adult). */
  adultId?: AdultId;
  /** A multiple of $10. */
  amount: number;
  magiReduction: number;
  /** ISO date. */
  deadline: string;
  liquidity: Liquidity;
  howTo: string[];
  returnLocation: string;
  proof: string[];
  warnings: string[];
};

export type PlanVerdict = 'under_line' | 'worth_it' | 'costly' | 'needs_retirement_moves' | 'not_worth_fighting';

/** The optimizer's result (spec §A.6), plus the plan flags (G2: IRA_SEP_COMBO_EXCLUDED). */
export type PlanResult = {
  verdict: PlanVerdict;
  /** The cliff minus the safety buffer. */
  target: number;
  magiBefore: number;
  magiAfter: number;
  ptcBefore: number;
  ptcAfter: number;
  repaymentBefore: number;
  repaymentAfter: number;
  /** Empty unless the plan gets under the target. */
  moves: Move[];
  totals: { cashCommitted: number; lockedInRetirement: number; deferredToNextYear: number; incomeTaxSaved: number };
  /** MAGI reduction if every allowed lever is used to capacity. */
  maxReductionAvailable: number;
  /** The repayment to set aside when the cliff is out of reach (`not_worth_fighting`). */
  setAside: number | null;
  suggestion: 'allow_retirement_moves' | null;
  flags: FlagCode[];
};

export type EngineErrorCode =
  | 'FILING_STATUS_UNSUPPORTED'
  | 'SLCSP_REQUIRED'
  | 'SLCSP_DERIVATION_UNRELIABLE'
  | 'ESTIMATE_OVER_CLIFF_WITH_APTC';

export class EngineError extends Error {
  readonly code: EngineErrorCode;

  constructor(code: EngineErrorCode, message: string = code) {
    super(message);
    this.name = 'EngineError';
    this.code = code;
  }
}

/** Plain-English explanation of a diagnosis (spec §E.2); produced by the template or by AI. */
export const ExplanationSchema = z.object({
  headline: z.string().max(140),
  paragraphs: z.array(z.string().max(500)).min(1).max(3),
  moveNotes: z.array(z.object({ leverId: LeverIdSchema, note: z.string().max(300) })),
  caveats: z.array(z.string().max(200)).max(4),
});
export type Explanation = z.infer<typeof ExplanationSchema>;

export type AlertCode =
  | 'CROSSED_CLIFF'
  | 'BACK_UNDER_CLIFF'
  | 'APPROACHING_CLIFF'
  | 'REPAYMENT_UP'
  | 'REPORT_CHANGE'
  | 'DEADLINE_SOON';
/** A check-in alert: a code for the UI and static copy filled with engine numbers (spec §A.8). */
export type Alert = { code: AlertCode; message: string };

/** A dated step and the levers it affects (spec §A.8). */
export type Deadline = { date: string; label: string; levers: LeverId[] };

export type GigOptionId = 'decline' | 'take_do_nothing' | 'take_with_plan' | 'bill_in_january';

/** The gig check (spec §A.7), plus the flags of the plan and the rough tax estimate. */
export type GigCheckResult = {
  gigAmount: number;
  magiWithout: number;
  magiWith: number;
  crossesCliff: boolean;
  taxOnGig: { seTax: number; incomeTax: number; total: number; marginalRate: number };
  options: Array<{ id: GigOptionId; netFromGig: number; ptcKept: number; repayment: number; notes: string[] }>;
  /** Gig amounts where taking it and doing nothing loses money; whole dollars. */
  lossZone: { from: number; to: number } | null;
  /** Gig 0 to 30,000 in steps of 500. */
  curve: Array<{ gig: number; netDoNothing: number; netWithPlan: number }>;
  /** Redacted by the API when unpaid. */
  plan: PlanResult;
  flags: FlagCode[];
};

/** Poverty line for one region: size 1 amount plus a fixed step per extra person. */
export type FplLine = { base: number; perAdditional: number };
export type FplTable = { contiguous: FplLine; alaska: FplLine; hawaii: FplLine };

/** Applicable-figure band in whole FPL percents; the figure moves linearly from startBp to endBp. */
export type ApplicableBand = { fromPct: number; toPct: number; startBp: number; endBp: number };

/** Repayment cap for FPL % below `belowPct`; none at or above the last band. */
export type RepaymentCap = { belowPct: number; single: number; other: number };

/** Progressive bracket; the top bracket has `upTo: Infinity`. */
export type TaxBracket = { upTo: number; rate: number };

/** Either a 400% cliff (no credit above it) or, in enhanced-subsidy years, a flat rate above 400%. */
type CliffRule = { cliffMultiple: number; aboveCliffRate: null } | { cliffMultiple: null; aboveCliffRate: number };

export type RuleSet = CliffRule & {
  id: string;
  taxYear: number;
  fpl: FplTable;
  applicableBands: readonly ApplicableBand[];
  repaymentCaps: readonly RepaymentCap[] | null;
  standardDeduction: Record<FilingStatus, number>;
  brackets: Record<FilingStatus, readonly TaxBracket[]>;
  se: {
    netEarningsFactor: number;
    ssRate: number;
    medicareRate: number;
    ssWageBase: number;
    deductibleShare: number;
    filingThreshold: number;
  };
  capitalLossLimit: number;
  hsa: { selfOnly: number; family: number };
  ira: {
    limit: number;
    minDeductionIfPartiallyPhasedOut: number;
    phaseOut: {
      singleOrHohCovered: readonly [number, number];
      mfjContributorCovered: readonly [number, number];
      mfjContributorNotCoveredSpouseCovered: readonly [number, number];
    };
  };
  sep: { selfEmployedRate: number; planRateMax: number; dollarCap: number; compensationCap: number };
  dates: {
    yearEnd: string;
    enrollForJan1: string;
    oeEnd: string;
    q4Estimated: string;
    form1095aBy: string;
    contributionDeadline: string;
    sepExtended: string;
  };
  nextYear: { fpl: FplTable };
  sbmStates: readonly UsStateCode[];
};
