'use client';

import { useState, type ReactNode } from 'react';

type DisclosureProps = {
  summary: string;
  /** Opens the section when it becomes true, e.g. because it holds answers; never closes it. */
  forceOpen: boolean;
  children: ReactNode;
};

/** A collapsible section that can't hide answers the user has given. */
export function Disclosure({ summary, forceOpen, children }: DisclosureProps) {
  const [open, setOpen] = useState(forceOpen);
  const [wasForced, setWasForced] = useState(forceOpen);
  if (forceOpen !== wasForced) {
    setWasForced(forceOpen);
    if (forceOpen) setOpen(true);
  }

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="rounded-md border border-hairline bg-air/60 p-4"
    >
      <summary className="cursor-pointer font-semibold text-violet">{summary}</summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}
