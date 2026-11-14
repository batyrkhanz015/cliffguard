import { Skeleton } from '@/components/ui/Skeleton';

/** Placeholder for the result screen while the household loads. */
export function ResultSkeleton() {
  return (
    <main aria-busy aria-label="Loading your result" className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-32 w-full" />
    </main>
  );
}
