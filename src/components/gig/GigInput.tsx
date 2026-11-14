'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { Toggle } from '@/components/ui/Toggle';
import type { GigOffer } from '@/lib/apiClient';
import { formatMoneyInput, moneyTextError, parseMoney } from '@/lib/money';

export const GIG_MAX = 500_000;

type GigInputProps = {
  /** The offer last checked; fills the form again after a reload. */
  initial: GigOffer | null;
  loading: boolean;
  onSubmit: (offer: GigOffer) => void;
};

/** Why this text can't be checked as a gig; null when it can. */
function amountError(text: string): string | null {
  const typed = moneyTextError(text);
  if (typed !== null) return typed;
  const amount = parseMoney(text);
  if (amount === null) return 'Enter the offer amount, like 12,000 or 12k.';
  if (amount <= 0) return 'Enter an amount above $0.';
  return amount > GIG_MAX ? 'Enter an amount of $500,000 or less.' : null;
}

/** "Got an offer?" The amount and whether the work could be billed in January. */
export function GigInput({ initial, loading, onSubmit }: GigInputProps) {
  const [text, setText] = useState(initial === null ? '' : formatMoneyInput(initial.amount));
  const [canBill, setCanBill] = useState(initial?.canBillInJanuary ?? false);
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const message = amountError(text);
    setError(message ?? undefined);
    const amount = parseMoney(text);
    if (message === null && amount !== null) onSubmit({ amount, canBillInJanuary: canBill });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <MoneyInput
        name="gig.amount"
        label="How much is the offer?"
        hint="Total pay for the work, before tax."
        placeholder="12,000"
        value={text}
        onChange={(next) => {
          setText(next);
          setError(undefined);
        }}
        error={error}
      />
      <Toggle
        id="gig-can-bill"
        label="Could this be billed in January?"
        description="If the client would pay you in 2027, it doesn't count toward 2026."
        checked={canBill}
        onChange={setCanBill}
      />
      <Button type="submit" loading={loading} loadingLabel="Checking the offer…" className="w-full sm:w-auto">
        Check this offer
      </Button>
    </form>
  );
}
