/** Every gig figure is tax-approximate; this says so wherever one appears. */
export function RoughEstimateNote({ className = '' }: { className?: string }) {
  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      Rough federal estimate (excludes QBI deduction and state tax)
    </p>
  );
}
