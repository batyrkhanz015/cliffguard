import Link from 'next/link';
import { Button, buttonClasses } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type ScreenNoticeProps = { kind: 'error'; onRetry: () => void } | { kind: 'start' };

/** Stands in for a screen that can't be built: a load error with a retry, or the pointer shown while redirecting. */
export function ScreenNotice(props: ScreenNoticeProps) {
  return (
    <Card className="mx-auto max-w-xl">
      {props.kind === 'error' ? (
        <div role="alert">
          <h1 className="type-display text-3xl">We couldn&apos;t load your numbers</h1>
          <p className="mt-3 text-gray-700">Check your connection and try again. Nothing was lost.</p>
          <Button onClick={props.onRetry} className="mt-5">
            Try again
          </Button>
        </div>
      ) : (
        <div role="status">
          <h1 className="type-display text-3xl">Start with Dani or your numbers</h1>
          <p className="mt-3 text-gray-700">There is nothing to show yet. Taking you to the start.</p>
          <Link href="/" className={`${buttonClasses()} mt-5`}>
            Go to the start
          </Link>
        </div>
      )}
    </Card>
  );
}
