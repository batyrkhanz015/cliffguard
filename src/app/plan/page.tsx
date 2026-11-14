'use client';

import { PlanPreview } from '@/components/plan/PlanPreview';
import { ResultSkeleton } from '@/components/result/ResultSkeleton';
import { ScreenNotice } from '@/components/ScreenNotice';
import { useHousehold } from '@/lib/useHousehold';

export default function PlanPage() {
  const state = useHousehold();
  switch (state.status) {
    case 'loading':
      return <ResultSkeleton />;
    case 'redirecting':
      return <ScreenNotice kind="start" />;
    case 'error':
      return <ScreenNotice kind="error" onRetry={state.retry} />;
    case 'ready':
      return <PlanPreview household={state.household} />;
  }
}
