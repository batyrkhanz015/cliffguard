import type { RuleSet } from '../types';

/**
 * Tax year 2026 (coverage year 2026). Every value comes from docs/tax-tables-2026.md,
 * which links the primary IRS / HHS sources. Repayment caps were repealed by P.L. 119-21 §71305.
 */
export const TY2026: RuleSet = {
  id: 'ty2026-v1',
  taxYear: 2026,

  // 2025 HHS poverty guidelines, used for 2026 coverage (90 FR 5917).
  fpl: {
    contiguous: { base: 15_650, perAdditional: 5_500 },
    alaska: { base: 19_550, perAdditional: 6_880 },
    hawaii: { base: 17_990, perAdditional: 6_330 },
  },
  // No credit when household income is more than 4 × FPL (Form 8962 line 5 → 401).
  cliffMultiple: 4,
  aboveCliffRate: null,

  // Rev. Proc. 2025-25 §3.01, in basis points of income. The last band includes 400%.
  applicableBands: [
    { fromPct: 0, toPct: 133, startBp: 210, endBp: 210 },
    { fromPct: 133, toPct: 150, startBp: 314, endBp: 419 },
    { fromPct: 150, toPct: 200, startBp: 419, endBp: 660 },
    { fromPct: 200, toPct: 250, startBp: 660, endBp: 844 },
    { fromPct: 250, toPct: 300, startBp: 844, endBp: 996 },
    { fromPct: 300, toPct: 400, startBp: 996, endBp: 996 },
  ],
  repaymentCaps: null,

  // Rev. Proc. 2025-32 via the 2026 Form 1040-ES tax rate schedules.
  standardDeduction: { single: 16_100, mfj: 32_200, hoh: 24_150 },
  brackets: {
    single: [
      { upTo: 12_400, rate: 0.1 },
      { upTo: 50_400, rate: 0.12 },
      { upTo: 105_700, rate: 0.22 },
      { upTo: 201_775, rate: 0.24 },
      { upTo: 256_225, rate: 0.32 },
      { upTo: 640_600, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    mfj: [
      { upTo: 24_800, rate: 0.1 },
      { upTo: 100_800, rate: 0.12 },
      { upTo: 211_400, rate: 0.22 },
      { upTo: 403_550, rate: 0.24 },
      { upTo: 512_450, rate: 0.32 },
      { upTo: 768_700, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    hoh: [
      { upTo: 17_700, rate: 0.1 },
      { upTo: 67_450, rate: 0.12 },
      { upTo: 105_700, rate: 0.22 },
      { upTo: 201_750, rate: 0.24 },
      { upTo: 256_200, rate: 0.32 },
      { upTo: 640_600, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
  },

  // 2026 Form 1040-ES SE tax worksheet and Schedule SE instructions.
  se: {
    netEarningsFactor: 0.9235,
    ssRate: 0.124,
    medicareRate: 0.029,
    ssWageBase: 184_500,
    deductibleShare: 0.5,
    filingThreshold: 400,
  },
  capitalLossLimit: 3_000,

  // Rev. Proc. 2025-19 (HSA), Notice 2025-67 (IRA, SEP). Age catch-ups are not collected.
  hsa: { selfOnly: 4_400, family: 8_750 },
  ira: {
    limit: 7_500,
    minDeductionIfPartiallyPhasedOut: 200,
    phaseOut: {
      singleOrHohCovered: [81_000, 91_000],
      mfjContributorCovered: [129_000, 149_000],
      mfjContributorNotCoveredSpouseCovered: [242_000, 252_000],
    },
  },
  sep: { selfEmployedRate: 0.2, planRateMax: 0.25, dollarCap: 72_000, compensationCap: 360_000 },

  dates: {
    yearEnd: '2026-12-31',
    enrollForJan1: '2026-12-15',
    oeEnd: '2027-01-15',
    q4Estimated: '2027-01-15',
    form1095aBy: '2027-01-31',
    contributionDeadline: '2027-04-15',
    sepExtended: '2027-10-15',
  },

  // 2026 HHS poverty guidelines, used for 2027 coverage (91 FR 1797).
  nextYear: {
    fpl: {
      contiguous: { base: 15_960, perAdditional: 5_680 },
      alaska: { base: 19_950, perAdditional: 7_100 },
      hawaii: { base: 18_360, perAdditional: 6_530 },
    },
  },

  // assumption: PY2026 full state-based exchanges per spec §A.2; not confirmed in the research file.
  sbmStates: [
    'CA', 'CO', 'CT', 'DC', 'GA', 'ID', 'IL', 'KY', 'ME', 'MD', 'MA',
    'MN', 'NV', 'NJ', 'NM', 'NY', 'PA', 'RI', 'VT', 'VA', 'WA',
  ],
};
