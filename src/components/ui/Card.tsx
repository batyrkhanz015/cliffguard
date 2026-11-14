import type { ReactNode } from 'react';

type CardProps = {
  as?: 'div' | 'section' | 'article' | 'aside' | 'li';
  surface?: 'light' | 'dark';
  className?: string;
  children: ReactNode;
};

const SURFACES = {
  light: 'border-hairline bg-white text-gray-950',
  dark: 'border-violet/60 bg-night-raised text-white',
} as const;

/** A bordered panel with the violet corner square. */
export function Card({ as: Tag = 'div', surface = 'light', className = '', children }: CardProps) {
  return (
    <Tag className={`relative rounded-md border p-5 sm:p-6 ${SURFACES[surface]} ${className}`}>
      <span aria-hidden className="absolute right-0 top-0 size-2.5 rounded-tr-md bg-violet" />
      {children}
    </Tag>
  );
}
