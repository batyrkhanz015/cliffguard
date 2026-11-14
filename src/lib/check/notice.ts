import type { EligibilityNoticeExtraction, NoticeSource } from '@/lib/noticeExtraction';
import { formatMoneyInput } from '@/lib/money';
import type { CheckDraft } from './draft';

/** Only explicit, confirmed non-null notice fields become a patch. All other answers survive. */
export function noticeDraftPatch(notice: EligibilityNoticeExtraction): Partial<CheckDraft> {
  const patch: Partial<CheckDraft> = {};
  if (notice.state !== null) patch.state = notice.state;
  if (notice.householdSize !== null) patch.householdSize = notice.householdSize;
  if (notice.planMetal !== null) patch.planMetal = notice.planMetal;
  if (notice.incomeEstimate !== null) patch.incomeEstimate = formatMoneyInput(notice.incomeEstimate);
  if (notice.aptcMonthly !== null) patch.aptcMonthly = formatMoneyInput(notice.aptcMonthly);
  if (notice.premiumMonthly !== null) patch.premiumMonthly = formatMoneyInput(notice.premiumMonthly);
  return patch;
}

export type NoticeDraftState = { draft: CheckDraft; inputSource: 'manual' | 'upload'; demoNoticeApplied: boolean };
export function manualDraftState(draft: CheckDraft): NoticeDraftState { return { draft, inputSource: 'manual', demoNoticeApplied: false }; }
export function confirmNotice(state: NoticeDraftState, notice: EligibilityNoticeExtraction, source: NoticeSource = 'upload'): NoticeDraftState {
  const patch = noticeDraftPatch(notice);
  return Object.keys(patch).length === 0 ? state : {
    draft: { ...state.draft, ...patch },
    inputSource: source === 'demo' ? 'manual' : 'upload',
    demoNoticeApplied: source === 'demo',
  };
}
export function noticeSaveHeaders(source: NoticeDraftState['inputSource']): Record<string, string> {
  return source === 'upload' ? { 'x-cliffguard-input-source': 'upload' } : {};
}
