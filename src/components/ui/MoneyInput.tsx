'use client';

import { useState } from 'react';
import { formatMoneyInput, moneyTextError, parseMoney, parseSignedMoney } from '@/lib/money';
import { Field, INPUT_CLASS, describedBy, fieldIdFor } from './Field';

type MoneyInputProps = {
  /** Field path, e.g. "marketplace.incomeEstimate"; also sets the DOM id. */
  name: string;
  label: string;
  /** The text as typed, e.g. "105k"; reformatted to "105,000" on blur. */
  value: string;
  onChange: (text: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  optional?: boolean;
  /** Accept losses such as "-2,000". */
  signed?: boolean;
};

export function MoneyInput({
  name,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  optional = false,
  signed = false,
}: MoneyInputProps) {
  const id = fieldIdFor(name);
  const [blurError, setBlurError] = useState<string | null>(null);
  const shownError = error ?? blurError ?? undefined;

  function handleBlur() {
    const message = moneyTextError(value, { signed });
    setBlurError(message);
    if (message !== null) return;
    const amount = signed ? parseSignedMoney(value) : parseMoney(value);
    if (amount !== null) onChange(formatMoneyInput(amount));
  }

  return (
    <Field id={id} label={label} hint={hint} error={shownError} optional={optional}>
      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
          $
        </span>
        <input
          id={id}
          name={name}
          type="text"
          inputMode={signed ? 'text' : 'decimal'}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={describedBy(id, { hint, error: shownError })}
          onChange={(event) => {
            setBlurError(null);
            onChange(event.target.value);
          }}
          onBlur={handleBlur}
          className={`${INPUT_CLASS} tabular pl-7`}
        />
      </div>
    </Field>
  );
}
