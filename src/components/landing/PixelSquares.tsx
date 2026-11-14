/** Decorative violet pixel squares scattered near the hero's corners. */

type Square = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  tone: string;
  /** Hidden on phones, where the corner overlaps text. */
  wideOnly?: boolean;
};

const SQUARES: readonly Square[] = [
  // Inside the hero's top padding, clear of the eyebrow on every width.
  { top: '0.75rem', right: '1.5rem', size: 12, tone: 'bg-violet' },
  { top: '0.4rem', right: '3.25rem', size: 6, tone: 'bg-violet-soft/70' },
  { top: '1.6rem', right: '0.6rem', size: 8, tone: 'bg-violet-bright/50' },
  { top: '9%', right: '7%', size: 6, tone: 'bg-violet-link/50', wideOnly: true },
  { bottom: '10%', left: '3%', size: 12, tone: 'bg-violet/80', wideOnly: true },
  { bottom: '5%', left: '8%', size: 7, tone: 'bg-violet-soft/60', wideOnly: true },
  { bottom: '16%', left: '1%', size: 6, tone: 'bg-violet-link/50', wideOnly: true },
];

export function PixelSquares() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {SQUARES.map((square, i) => (
        <span
          key={i}
          className={`absolute ${square.tone} ${square.wideOnly ? 'hidden sm:block' : ''}`}
          style={{
            top: square.top,
            bottom: square.bottom,
            left: square.left,
            right: square.right,
            width: square.size,
            height: square.size,
          }}
        />
      ))}
    </div>
  );
}
