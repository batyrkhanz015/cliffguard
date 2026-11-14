import type { ReactNode } from 'react';
import { PlanAccess } from '@/components/plan/PlanAccess';

export default function PlanLayout({ children }: { children: ReactNode }) {
  return <>{children}<PlanAccess /></>;
}
