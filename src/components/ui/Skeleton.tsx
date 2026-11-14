/** A placeholder block shown while data loads. Size it with `className`. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`rounded-sm bg-gray-200 motion-safe:animate-pulse ${className}`} />;
}
