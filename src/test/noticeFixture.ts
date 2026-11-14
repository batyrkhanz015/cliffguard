import type { EligibilityNoticeExtraction } from '@/lib/noticeExtraction';

export const NOTICE: EligibilityNoticeExtraction = {
  docType: 'marketplace_eligibility_notice', coverageYear: 2026, state: 'TX', householdSize: 3,
  incomeEstimate: 105000, aptcMonthly: 778.5, premiumMonthly: 1500, planMetal: 'bronze',
  planName: 'Sample Bronze', evidence: ['coverageYear', 'state', 'householdSize', 'incomeEstimate', 'aptcMonthly', 'premiumMonthly', 'planMetal', 'planName'].map((field) => ({ field, quote: 'Evidence from sample notice' })), warnings: [],
};
