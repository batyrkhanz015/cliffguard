'use client';

import { useRef, useEffect, useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS } from '@/components/ui/Field';
import { US_STATE_CODES } from '@/engine/types';
import { EligibilityNoticeExtractionSchema, extractionWarnings, type EligibilityNoticeExtraction } from '@/lib/noticeExtraction';
import { parseMoney } from '@/lib/money';
import { US_STATE_NAMES } from '@/lib/usStates';

const FIELDS = [
  ['coverageYear', 'Coverage year'], ['state', 'State'], ['householdSize', 'People on the tax return'],
  ['incomeEstimate', 'Estimated annual household income ($)'], ['aptcMonthly', 'Advance credit per month ($)'],
  ['premiumMonthly', 'Monthly premium before credit ($)'], ['planMetal', 'Plan metal level'], ['planName', 'Plan name'],
] as const;
type NoticeField = (typeof FIELDS)[number][0];
type Values = Record<NoticeField, string>;
const METALS = ['bronze', 'catastrophic', 'silver', 'gold', 'platinum', 'unknown'];
const MONEY_FIELDS: ReadonlySet<NoticeField> = new Set(['incomeEstimate', 'aptcMonthly', 'premiumMonthly']);
const HINTS: Partial<Record<NoticeField, string>> = {
  coverageYear: '2025–2027; this check is for 2026.', householdSize: '1–10 people.',
  incomeEstimate: '$0–$2,000,000.', aptcMonthly: '$0–$10,000.', premiumMonthly: '$0–$10,000.',
  planName: 'Up to 80 characters; for your review only.',
};

function readValue(field: NoticeField, value: string): string | number | null {
  if (value.trim() === '') return null;
  if (MONEY_FIELDS.has(field)) return parseMoney(value) ?? Number.NaN;
  if (field === 'coverageYear' || field === 'householdSize') return Number(value);
  return value;
}

export function ExtractionConfirmCard({ extraction, onConfirm, onCancel }: {
  extraction: EligibilityNoticeExtraction;
  onConfirm: (notice: EligibilityNoticeExtraction) => void;
  onCancel: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const errorFocus = useRef<NoticeField | null>(null);
  const [values, setValues] = useState<Values>(() => Object.fromEntries(
    FIELDS.map(([field]) => [field, extraction[field] === null ? '' : String(extraction[field])]),
  ) as Values);
  const [errors, setErrors] = useState<Partial<Values>>({});
  useEffect(() => { heading.current?.focus(); }, []);
  useEffect(() => {
    if (errorFocus.current !== null) {
      document.getElementById(`notice-${errorFocus.current}`)?.focus();
      errorFocus.current = null;
    }
  }, [errors]);
  const parsed = EligibilityNoticeExtractionSchema.safeParse({
    ...extraction,
    ...Object.fromEntries(FIELDS.map(([field]) => [field, readValue(field, values[field])])),
  });
  const warnings = extractionWarnings(parsed.success ? parsed.data : extraction);

  function confirm() {
    if (!parsed.success) {
      const next: Partial<Values> = {};
      for (const issue of parsed.error.issues) {
        const field = FIELDS.find(([name]) => name === issue.path[0])?.[0];
        if (field) next[field] = 'Check this value and use the range shown, or leave it blank for manual entry.';
      }
      errorFocus.current = FIELDS.find(([field]) => next[field])?.[0] ?? null;
      setErrors(next);
      return;
    }
    onConfirm(parsed.data);
  }

  return (
    <section
      aria-labelledby="notice-confirm-heading"
      className="space-y-5 rounded-md border border-violet/40 bg-violet/5 p-4"
      onKeyDown={(event) => {
        // Editing this card must not implicitly submit CheckForm's outer form.
        if (event.key === 'Enter' && (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement)) {
          event.preventDefault();
        }
      }}
    >
      <h3 id="notice-confirm-heading" ref={heading} tabIndex={-1} className="text-xl font-bold">Check what we read</h3>
      <p className="text-sm">Compare every value with your notice. Edit anything that needs correcting. Blank fields stay available for manual entry. Nothing is saved here.</p>
      <div role="note" className="space-y-2 text-sm text-gray-700">
        {warnings.map((warning, index) => <p key={index}>{warning}</p>)}
      </div>
      {FIELDS.map(([field, label]) => {
        const id = `notice-${field}`;
        const evidence = extraction.evidence.filter((item) => item.field === field && item.quote.trim() !== '');
        const missing = values[field].trim() === '';
        const shared = {
          id, value: values[field],
          onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const value = event.currentTarget.value;
            setValues((current) => ({ ...current, [field]: value }));
            setErrors((current) => ({ ...current, [field]: undefined }));
          },
          'aria-invalid': errors[field] ? true as const : undefined,
          'aria-describedby': `${id}-evidence${HINTS[field] ? ` ${id}-hint` : ''}${errors[field] ? ` ${id}-error` : ''}`,
          className: INPUT_CLASS,
        };
        return (
          <div key={field} className={missing ? 'rounded-md border border-dashed border-gray-400 p-3' : ''}>
            <Field id={id} label={label} error={errors[field]} hint={HINTS[field]}>
              {field === 'state' ? (
                <select {...shared}>
                  <option value="">Enter manually</option>
                  {US_STATE_CODES.map((code) => <option key={code} value={code}>{US_STATE_NAMES[code]}</option>)}
                </select>
              ) : field === 'planMetal' ? (
                <select {...shared}>
                  <option value="">Enter manually</option>
                  {METALS.map((metal) => <option key={metal} value={metal}>{metal}</option>)}
                </select>
              ) : (
                <input {...shared} type="text" inputMode={field === 'planName' ? undefined : 'decimal'} maxLength={field === 'planName' ? 80 : 20} />
              )}
            </Field>
            <div id={`${id}-evidence`} className="mt-2 text-sm text-gray-600">
              {evidence.length ? evidence.map((item, index) => (
                <blockquote key={index} className="border-l-2 border-violet/30 pl-3">“{item.quote}”</blockquote>
              )) : <p>{missing ? 'Not found. Enter manually if you know it.' : 'No quote found. Verify this value against your notice.'}</p>}
            </div>
          </div>
        );
      })}
      <p className="text-sm">Filing status and who your plan covers still need your answers. A notice from another year may have different figures.</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={confirm}>Confirm and use these</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </section>
  );
}
