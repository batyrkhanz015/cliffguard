import { z } from 'zod';
import { UsStateCodeSchema } from '@/engine/types';

/** Untrusted model output, also used to validate the editable confirmation card. */
export const EligibilityNoticeExtractionSchema = z.object({
  docType: z.enum(['marketplace_eligibility_notice', 'not_a_notice']),
  coverageYear: z.number().int().min(2025).max(2027).nullable(),
  state: UsStateCodeSchema.nullable(),
  householdSize: z.number().int().min(1).max(10).nullable(),
  incomeEstimate: z.number().min(0).max(2_000_000).nullable(),
  aptcMonthly: z.number().min(0).max(10_000).nullable(),
  premiumMonthly: z.number().min(0).max(10_000).nullable(),
  planMetal: z.enum(['bronze', 'catastrophic', 'silver', 'gold', 'platinum', 'unknown']).nullable(),
  planName: z.string().max(80).nullable(),
  evidence: z.array(z.object({ field: z.string().max(80), quote: z.string().max(100) })).max(10),
  warnings: z.array(z.string().max(160)).max(5),
});
export type EligibilityNoticeExtraction = z.infer<typeof EligibilityNoticeExtractionSchema>;
export type NoticeSource = 'upload' | 'demo';

/** Deterministic review notices; never infer filing status or plan coverage from size. */
export function extractionWarnings(extraction: EligibilityNoticeExtraction): string[] {
  const warnings = [...extraction.warnings];
  if (extraction.coverageYear !== 2026) warnings.push('This notice does not confirm coverage for 2026. Check the year before using these numbers.');
  if (extraction.aptcMonthly !== null && extraction.premiumMonthly !== null && extraction.aptcMonthly > extraction.premiumMonthly) {
    warnings.push('The advance credit is above the premium. Check both monthly amounts against your notice.');
  }
  if (extraction.state === null || extraction.householdSize === null) {
    warnings.push('State or household size was not found. Complete those questions manually.');
  } else {
    warnings.push('Check that the household size on this state’s notice matches the people on your tax return; plan coverage may differ.');
  }
  return [...new Set(warnings)];
}
