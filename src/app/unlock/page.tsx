import { PlanAccess } from '@/components/plan/PlanAccess';

/** Standalone demo entry until the independently built T7 /plan page is merged. */
export default function UnlockPage() {
  return <main><div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
    <h1 className="font-display text-3xl font-bold">Your CliffGuard plan</h1>
    <p className="mt-3 text-gray-600">Demo access to your saved household and latest gig check. No payment or card required.</p>
  </div><PlanAccess /></main>;
}
