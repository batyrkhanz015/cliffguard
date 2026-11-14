import { DEFAULT_LEVER_ORDER, type HouseholdInput, type Scenario } from '@/engine/types';

/**
 * Sample inputs for the "try a sample" button and the spec §B fixtures: a self-employed
 * designer in Texas, filing jointly with a W-2 spouse, two kids, a bronze family plan.
 * Inputs only; every output is computed by the engine.
 */
export const DANI: HouseholdInput = {
  coverageYear: 2026,
  state: 'TX',
  filingStatus: 'mfj',
  householdSize: 4,
  adults: [
    {
      id: 'a',
      label: 'Dani',
      selfEmploymentProfit: { ytd: 78_000, expectedRest: 13_500 },
      wages: { ytd: 0, expectedRest: 0 },
      coveredByWorkplacePlan: false,
      contributedSoFar: { traditionalIra: 0, sepIra: 0 },
    },
    {
      id: 'b',
      label: 'Alex',
      selfEmploymentProfit: { ytd: 0, expectedRest: 0 },
      wages: { ytd: 29_200, expectedRest: 5_800 },
      coveredByWorkplacePlan: false,
      contributedSoFar: { traditionalIra: 0, sepIra: 0 },
    },
  ],
  marketplace: {
    incomeEstimate: 105_000,
    aptcMonthly: 778.5,
    monthsWithAptc: 12,
    tookFullCredit: true,
    householdUnchanged: true,
    slcspAnnualOverride: null,
    premiumMonthly: 1_240,
    planMetal: 'bronze',
    coverage: 'family',
  },
  investments: {
    taxableInterest: 500,
    taxExemptInterest: 500,
    dividends: 1_000,
    capitalGainsNet: 0,
    otherIncome: 0,
    otherMagiAddbacks: 0,
  },
  adjustments: { hsaContributedSoFar: 0, otherAboveTheLine: 0 },
  levers: { unbilledInvoicesMovable: 3_000, plannedPurchases: 1_800, plannedStockSaleGains: 0 },
  preferences: { keepMyCash: true, leverOrder: [...DEFAULT_LEVER_ORDER] },
};

export const DANI_GIG: NonNullable<Scenario['gig']> = { amount: 12_000, canBillInJanuary: false };

export const DANI_AS_OF = '2026-11-14';
