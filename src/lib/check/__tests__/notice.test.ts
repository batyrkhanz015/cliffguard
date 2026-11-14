import { describe, expect, it, vi, afterEach } from 'vitest';
import { confirmNotice, manualDraftState, noticeDraftPatch, noticeSaveHeaders } from '../notice';
import { draftFromInput, EMPTY_DRAFT } from '../draft';
import { DANI } from '@/samples/dani';
import { NOTICE } from '@/test/noticeFixture';
import { sendJson } from '@/lib/api';
import { NoticeRequests } from '@/lib/noticeRequests';

afterEach(() => vi.unstubAllGlobals());
describe('confirmed notice draft and provenance', () => {
  it('applies only non-null notice values and preserves unrelated answers', () => {
    const draft = draftFromInput(DANI);
    const initial = manualDraftState(draft);
    const confirmed = confirmNotice(initial, { ...NOTICE, state: null, householdSize: 2, planMetal: null, incomeEstimate: 0, premiumMonthly: null });
    expect(confirmed.draft).toEqual({ ...draft, householdSize: 2, incomeEstimate: '0', aptcMonthly: '778.50' });
    expect(confirmed.draft.adults).toBe(draft.adults);
    expect(confirmed.draft.filingStatus).toBe('mfj');
    expect(confirmed.draft.coverage).toBe('family');
    expect(confirmed.inputSource).toBe('upload');
    expect(initial.draft).toBe(draft);
  });
  it('never infers filing/coverage and does not mark all-null/manual/unconfirmed data as uploaded', () => {
    const patch = noticeDraftPatch(NOTICE);
    expect(patch).not.toHaveProperty('filingStatus');
    expect(patch).not.toHaveProperty('coverage');
    const initial = manualDraftState(EMPTY_DRAFT);
    const unchanged = confirmNotice(initial, { ...NOTICE, state: null, householdSize: null, planMetal: null, incomeEstimate: null, aptcMonthly: null, premiumMonthly: null });
    expect(unchanged).toBe(initial);
    expect(noticeSaveHeaders(initial.inputSource)).toEqual({});
  });
  it('resets upload provenance when Dani numbers replace the draft', () => {
    const confirmed = confirmNotice(manualDraftState(EMPTY_DRAFT), NOTICE);
    expect(noticeSaveHeaders(confirmed.inputSource)).toEqual({ 'x-cliffguard-input-source': 'upload' });
    const sample = manualDraftState(draftFromInput(DANI));
    expect(noticeSaveHeaders(sample.inputSource)).toEqual({});
  });
  it('sends upload provenance only through explicit final-save options', async () => {
    const transport = vi.fn<typeof fetch>(async () => Response.json({ ok: true })); vi.stubGlobal('fetch', transport);
    await sendJson('PUT', '/api/household', DANI);
    expect(new Headers(transport.mock.calls[0]?.[1]?.headers).get('x-cliffguard-input-source')).toBeNull();
    await sendJson('PUT', '/api/household', DANI, { headers: noticeSaveHeaders('upload') });
    expect(new Headers(transport.mock.calls[1]?.[1]?.headers).get('x-cliffguard-input-source')).toBe('upload');
  });
});
describe('notice request lifecycle', () => {
  it('aborts cancellation/unmount and rejects stale responses after retry or sample reset', () => {
    const gate = new NoticeRequests();
    const first = gate.begin(); expect(gate.isCurrent(first)).toBe(true);
    gate.cancel(); expect(first.signal.aborted).toBe(true); expect(gate.isCurrent(first)).toBe(false);
    const second = gate.begin(); const third = gate.begin();
    expect(second.signal.aborted).toBe(true); expect(gate.isCurrent(second)).toBe(false);
    expect(gate.isCurrent(third)).toBe(true);
    gate.finish(second); expect(gate.isCurrent(third)).toBe(true);
    gate.finish(third); expect(gate.isCurrent(third)).toBe(false);
  });
});
