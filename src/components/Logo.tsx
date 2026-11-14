import Link from 'next/link';

/** The mark: a low line, the red cliff wall, a high line. Then the wordmark. */
export function Logo() {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-2.5 rounded-sm text-white">
      <svg aria-hidden viewBox="0 0 28 20" className="h-5 w-7">
        <path d="M1.5 17h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
        <rect x="15" y="2" width="4" height="16.5" fill="var(--color-cliff)" />
        <path d="M20.5 3.5h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      </svg>
      <span className="font-display text-lg font-extrabold uppercase tracking-tight">CliffGuard</span>
    </Link>
  );
}
