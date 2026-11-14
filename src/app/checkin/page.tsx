import Link from 'next/link';
import { CheckinPanel } from '@/components/checkin/CheckinPanel';
export default function CheckinPage() {
  return <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6"><div><p className="type-eyebrow text-violet">CliffGuard Year · 2026 coverage</p><h1 className="mt-3 text-3xl font-bold">Your monthly check-in</h1><Link className="mt-3 inline-flex min-h-11 items-center font-semibold text-violet underline" href="/plan">Back to your plan</Link></div><CheckinPanel /></main>;
}
