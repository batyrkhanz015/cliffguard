import type { Metadata } from 'next';
import { CheckForm } from '@/components/check/CheckForm';

export const metadata: Metadata = { title: 'Check my numbers' };

const STEPS = [1, 2, 3, 4, 5] as const;

/** `?step=2` opens the Marketplace step directly, for the notice upload. */
export default async function CheckPage({ searchParams }: PageProps<'/check'>) {
  const { step } = await searchParams;
  const initialStep = STEPS.find((n) => String(n) === step) ?? 1;
  return <CheckForm initialStep={initialStep} />;
}
