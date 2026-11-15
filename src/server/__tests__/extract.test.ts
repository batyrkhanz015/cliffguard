import { afterEach, describe, expect, it, vi } from 'vitest';
import { extractNotice, validateExtraction } from '../ai/extract';
import { EligibilityNoticeExtractionSchema } from '@/lib/noticeExtraction';

import { NOTICE } from '@/test/noticeFixture';

afterEach(() => vi.unstubAllEnvs());
describe('extraction validation', () => {
  it('rejects an unrelated document and invalid numeric ranges', () => {
    expect(validateExtraction({ ...NOTICE, docType: 'not_a_notice' })).toEqual({ error: 'NOT_RECOGNIZED' });
    expect(EligibilityNoticeExtractionSchema.safeParse({ ...NOTICE, aptcMonthly: 20000 }).success).toBe(false);
    expect(validateExtraction({ ...NOTICE, aptcMonthly: 20000 })).toEqual({ error: 'NOT_RECOGNIZED' });
  });
  it('adds year and credit-versus-premium warnings', () => {
    const result = validateExtraction({ ...NOTICE, coverageYear: 2025, premiumMonthly: 600 });
    expect('warnings' in result && result.warnings.join(' ')).toMatch(/2026/);
    expect('warnings' in result && result.warnings.join(' ')).toMatch(/premium/i);
  });
  it('keeps missing values null for manual entry', () => {
    const result = validateExtraction({ ...NOTICE, state: null, householdSize: null });
    expect('extraction' in result && result.extraction.state).toBeNull();
    expect('warnings' in result && result.warnings.join(' ')).toMatch(/household/i);
  });
  it('leaves unsupported model values manual, including whitespace-only evidence', () => {
    const result = validateExtraction({ ...NOTICE, evidence: [{ field: 'incomeEstimate', quote: '  ' }, { field: 'state', quote: 'Texas' }] });
    expect('extraction' in result && result.extraction.incomeEstimate).toBeNull();
    expect('extraction' in result && result.extraction.state).toBe('TX');
    expect('extraction' in result && result.extraction.aptcMonthly).toBeNull();
  });
  it('falls back without a call when disabled', async () => {
    vi.stubEnv('CLAUDE_ENABLED', 'false');
    expect(await extractNotice({ bytes: new TextEncoder().encode('%PDF-1.7\n'), type: 'application/pdf' })).toEqual({ error: 'AI_UNAVAILABLE' });
  });
});
