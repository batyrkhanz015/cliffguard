import type { ReactNode } from 'react';

type CardProps = {
  as?: 'div' | 'section' | 'article' | 'aside' | 'li';
  surface?: 'light' | 'dark';
  /** `accent` swaps the hairline border for solid violet. */
  tone?: 'default' | 'accent';
  /** Tighter padding for inline notices. */
  compact?: boolean;
  className?: string;
  children: ReactNode;
};

const SURFACES = {
  light: { border: 'border-hairline', fill: 'bg-white text-gray-950' },
  dark: { border: 'border-violet/60', fill: 'bg-night-raised text-white' },
} as const;

/** A bordered panel with the violet corner square. */
export function Card({ as: Tag = 'div', surface = 'light', tone = 'default', compact = false, className = '', children }: CardProps) {
  const { border, fill } = SURFACES[surface];
  return (
    <Tag className={`relative rounded-md border ${compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6'} ${tone === 'accent' ? 'border-violet' : border} ${fill} ${className}`}>
      <span aria-hidden className="absolute right-0 top-0 size-2.5 rounded-tr-md bg-violet" />
      {children}
    </Tag>
  );
}
