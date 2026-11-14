import type { EligibilityNoticeExtraction } from '@/lib/noticeExtraction';
import { DANI } from './dani';

/** Offline sample inputs matching the bundled synthetic PDF; no document is read. */
export function demoNotice(): EligibilityNoticeExtraction {
  return {
    docType: 'marketplace_eligibility_notice',
    coverageYear: DANI.coverageYear,
    state: DANI.state,
    householdSize: DANI.householdSize,
    incomeEstimate: DANI.marketplace.incomeEstimate,
    aptcMonthly: DANI.marketplace.aptcMonthly,
    premiumMonthly: DANI.marketplace.premiumMonthly,
    planMetal: DANI.marketplace.planMetal,
    planName: 'Sample Texas Bronze Family Plan',
    evidence: [
      { field: 'coverageYear', quote: 'Coverage year: 2026' },
      { field: 'state', quote: 'State of residence: Texas (TX)' },
      { field: 'householdSize', quote: 'Tax household size: 4 people' },
      { field: 'incomeEstimate', quote: 'Estimated annual household income for 2026: $105,000.00' },
      { field: 'aptcMonthly', quote: 'Advance premium tax credit (APTC) per month: $778.50' },
      { field: 'premiumMonthly', quote: 'Monthly premium before any tax credit: $1,240.00' },
      { field: 'planMetal', quote: 'Plan metal level: Bronze' },
      { field: 'planName', quote: 'Plan name: Sample Texas Bronze Family Plan' },
    ],
    warnings: [],
  };
}
