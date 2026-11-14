import { redirect } from 'next/navigation';

/** Kept so older links work: the plan and its access panel live at /plan. */
export default function UnlockPage(): never {
  redirect('/plan');
}
