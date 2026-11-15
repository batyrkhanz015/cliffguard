'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const PlanIcon = (
  <svg {...ICON_PROPS}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4h6v3H9zM9 13l2 2 4-4" />
  </svg>
);

const CheckinIcon = (
  <svg {...ICON_PROPS}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18M9 15l2 2 4-4" />
  </svg>
);

type NavItem = { href: string; label: string; icon: ReactNode };

const ITEMS: NavItem[] = [
  { href: '/plan', label: 'My plan', icon: PlanIcon },
  { href: '/checkin', label: 'Check-in', icon: CheckinIcon },
];

const BASE =
  'inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-[10px] px-3 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-night sm:px-4';
/** Active page: solid violet with a faint inner ring. Inactive: violet outline that fills on hover. */
const ACTIVE = 'bg-violet shadow-[inset_0_0_0_2px_rgb(255_255_255/0.35)] hover:bg-violet-deep';
const INACTIVE = 'border border-violet-link hover:bg-violet';

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Header navigation as icon buttons; icon-only below `sm` so the header fits at 375 px. */
export function HeaderNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="flex gap-2">
      {ITEMS.map(({ href, label, icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className={`${BASE} ${active ? ACTIVE : INACTIVE}`}
          >
            {icon}
            <span className="sr-only sm:not-sr-only">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
