import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'quiet';
/** The section the button sits on; outlined and quiet buttons change on dark. */
type Surface = 'light' | 'dark';

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-md text-base font-semibold transition-colors disabled:cursor-not-allowed';

const VARIANTS: Record<Variant, Record<Surface, string>> = {
  primary: {
    light: 'bg-violet px-6 text-white hover:bg-violet-deep disabled:bg-violet/60',
    dark: 'bg-violet px-6 text-white hover:bg-violet-deep disabled:bg-violet/60',
  },
  secondary: {
    light: 'border border-violet px-6 text-violet hover:bg-violet/5 disabled:opacity-60',
    dark: 'border border-violet-link px-6 text-white hover:bg-violet/25 disabled:opacity-60',
  },
  quiet: {
    light: 'px-1 text-violet underline decoration-violet/40 underline-offset-4 hover:decoration-violet',
    dark: 'px-1 text-white underline decoration-violet-link underline-offset-4 hover:decoration-white',
  },
};

/** Button styles, also used by links that look like buttons. */
export function buttonClasses(variant: Variant = 'primary', surface: Surface = 'light'): string {
  return `${BASE} ${VARIANTS[variant][surface]}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  surface?: Surface;
  /** Disables the button and shows a spinner with `loadingLabel`. */
  loading?: boolean;
  loadingLabel?: string;
};

export function Button({
  variant = 'primary',
  surface = 'light',
  loading = false,
  loadingLabel,
  disabled,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${buttonClasses(variant, surface)} ${className}`}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="size-4 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
        />
      )}
      {loading ? (loadingLabel ?? children) : children}
    </button>
  );
}
