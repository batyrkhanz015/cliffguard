'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ComponentType, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';
import { sendJson, type ApiFailure } from '@/lib/api';
import {
  EMPTY_DRAFT,
  FIELD,
  draftFromInput,
  type AdultDraft,
  type AdultIndex,
  type CheckDraft,
  type FieldErrors,
  type StepNumber,
  type StepProps,
} from '@/lib/check/draft';
import type { EligibilityNoticeExtraction, NoticeSource } from '@/lib/noticeExtraction';
import { confirmNotice, manualDraftState, noticeSaveHeaders } from '@/lib/check/notice';
import { MFS_UNSUPPORTED, errorsForStep, firstStepWithError, validateDraft } from '@/lib/check/validate';
import { DANI } from '@/samples/dani';
import { CheckProgress } from './CheckProgress';
import { StepIncome } from './StepIncome';
import { StepMarketplace } from './StepMarketplace';
import { StepOptions } from './StepOptions';
import { StepPlan } from './StepPlan';
import { StepWho } from './StepWho';

const STEP_TITLES: Record<StepNumber, string> = {
  1: "Where you live. Who's on your return.",
  2: 'What HealthCare.gov has on file',
  3: 'Your health plan',
  4: 'Your 2026 income',
  5: 'Your options',
};
const STEP_VIEWS: Record<StepNumber, ComponentType<StepProps>> = {
  1: StepWho,
  2: StepMarketplace,
  3: StepPlan,
  4: StepIncome,
  5: StepOptions,
};
const NEXT: Record<StepNumber, StepNumber | null> = { 1: 2, 2: 3, 3: 4, 4: 5, 5: null };
const PREVIOUS: Record<StepNumber, StepNumber | null> = { 1: null, 2: 1, 3: 2, 4: 3, 5: 4 };
const ALL_STEPS: ReadonlySet<StepNumber> = new Set([1, 2, 3, 4, 5]);

/** API error codes that point at one field (spec §A.4, §A.10). */
const FIELD_FOR_CODE: Partial<Record<string, { field: string; message: string }>> = {
  SLCSP_REQUIRED: { field: FIELD.benchmark, message: 'We need your benchmark plan cost to check this.' },
  SLCSP_DERIVATION_UNRELIABLE: {
    field: FIELD.benchmark,
    message: "Your credit covers your whole premium, so we can't work out the benchmark. Enter it here.",
  },
  ESTIMATE_OVER_CLIFF_WITH_APTC: {
    field: FIELD.benchmark,
    message: "Your estimate is over the line but you got a credit, so we can't work out the benchmark. Enter it here.",
  },
  FILING_STATUS_UNSUPPORTED: { field: FIELD.filingStatus, message: MFS_UNSUPPORTED },
};

type FocusTarget = 'heading' | 'invalid';
const CONTROLS = 'input, select, textarea, button';

function rateLimitMessage(retryAfterSec: number | null): string {
  if (retryAfterSec === null) return 'Too many tries. Wait a minute and try again.';
  return `Too many tries. Wait ${retryAfterSec} seconds and try again.`;
}

function optionsAnswered(draft: CheckDraft): boolean {
  const amounts = [draft.unbilledInvoices, draft.plannedPurchases, draft.plannedStockSaleGains, draft.hsaSoFar];
  const adults = draft.adults.flatMap((adult) => [adult.iraSoFar, adult.sepSoFar]);
  return [...amounts, ...adults].some((text) => text.trim() !== '') || draft.adults.some((adult) => adult.covered);
}

export function CheckForm({ initialStep }: { initialStep: StepNumber }) {
  const router = useRouter();
  const [formState, setFormState] = useState(() => manualDraftState(EMPTY_DRAFT));
  const { draft, inputSource } = formState;
  const [uploadGeneration, setUploadGeneration] = useState(0);
  function setDraft(update: CheckDraft | ((current: CheckDraft) => CheckDraft)) {
    setFormState((current) => ({ ...current, draft: typeof update === 'function' ? update(current.draft) : update }));
  }
  function confirmExtraction(notice: EligibilityNoticeExtraction, source: NoticeSource) {
    setFormState((current) => confirmNotice(current, notice, source));
    setServerErrors({});
    setFilledSample(false);
  }
  const [step, setStep] = useState<StepNumber>(initialStep);
  const [attempted, setAttempted] = useState<ReadonlySet<StepNumber>>(new Set());
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; canRetry: boolean } | null>(null);
  const [filledSample, setFilledSample] = useState(false);
  const focusNext = useRef<FocusTarget | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const target = focusNext.current;
    if (target === null) return;
    focusNext.current = null;
    if (target === 'heading') {
      headingRef.current?.focus();
      return;
    }
    // An invalid group (radios) is marked on its fieldset; focus its first control.
    const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    const control = invalid?.matches(CONTROLS) ? invalid : invalid?.querySelector<HTMLElement>(CONTROLS);
    control?.focus();
  });

  const validation = validateDraft(draft);
  const clientErrors = validation.ok ? {} : validation.errors;
  const errors: FieldErrors = {
    ...(attempted.has(step) ? errorsForStep(clientErrors, step) : {}),
    ...errorsForStep(serverErrors, step),
  };

  function change(patch: Partial<CheckDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setServerErrors({});
  }

  function changeAdult(index: AdultIndex, patch: Partial<AdultDraft>) {
    setDraft((current) => {
      const [first, second] = current.adults;
      return {
        ...current,
        adults: index === 0 ? [{ ...first, ...patch }, second] : [first, { ...second, ...patch }],
      };
    });
    setServerErrors({});
  }

  function goTo(target: StepNumber) {
    setStep(target);
    focusNext.current = 'heading';
  }

  function fillSample() {
    setFormState(manualDraftState(draftFromInput(DANI)));
    setUploadGeneration((current) => current + 1);
    setAttempted(new Set());
    setServerErrors({});
    setFilledSample(true);
  }

  function showFailure(failure: ApiFailure) {
    const known = FIELD_FOR_CODE[failure.code];
    const fieldErrors: FieldErrors = known
      ? { [known.field]: known.message }
      : Object.fromEntries(failure.issues.map((issue) => [issue.path.join('.'), issue.message]));
    const target = firstStepWithError(fieldErrors);
    if (target !== null) {
      if (known?.field === FIELD.benchmark) setDraft((current) => ({ ...current, manualBenchmark: true }));
      setServerErrors(fieldErrors);
      setStep(target);
      focusNext.current = 'invalid';
      if (!known) setToast({ message: 'Check the highlighted answers.', canRetry: false });
      return;
    }
    setToast({
      message: failure.status === 429 ? rateLimitMessage(failure.retryAfterSec) : "Couldn't save your numbers. Try again.",
      canRetry: true,
    });
  }

  async function save() {
    const result = validateDraft(draft);
    if (!result.ok) {
      setAttempted(ALL_STEPS);
      setStep(firstStepWithError(result.errors) ?? step);
      focusNext.current = 'invalid';
      return;
    }
    setSaving(true);
    setToast(null);
    const response = await sendJson('PUT', '/api/household', result.input, { headers: noticeSaveHeaders(inputSource) });
    if (response.ok) {
      router.push('/result');
      return;
    }
    setSaving(false);
    showFailure(response);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = NEXT[step];
    if (next === null) {
      void save();
      return;
    }
    if (Object.keys(errorsForStep(clientErrors, step)).length > 0) {
      setAttempted((current) => new Set(current).add(step));
      focusNext.current = 'invalid';
      return;
    }
    const missingEarlier = ([1, 2, 3, 4, 5] as const).find((prior) => prior < step && Object.keys(errorsForStep(clientErrors, prior)).length > 0);
    if (missingEarlier) {
      setAttempted((current) => new Set(current).add(missingEarlier));
      goTo(missingEarlier);
      return;
    }
    goTo(next);
  }

  const StepView = STEP_VIEWS[step];
  const previous = PREVIOUS[step];
  const submitLabel = NEXT[step] !== null ? 'Continue' : optionsAnswered(draft) ? 'See my numbers' : 'Skip, decide on the plan';

  return (
    <main className="flex-1 bg-air">
      <div className="mx-auto w-full max-w-2xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h1 className="type-display text-4xl sm:text-5xl">Check my numbers</h1>
          <Button variant="quiet" onClick={fillSample} className="min-h-11">
            Use Dani&apos;s numbers
          </Button>
        </div>
        <p role="status" className="mt-2 text-sm text-gray-600">
          {formState.demoNoticeApplied
            ? 'Demo notice values are filled in. These are fictional sample values; replace them with your own for a personal check.'
            : filledSample ? "Dani's sample numbers are filled in. Change anything you like." : ''}
        </p>
        <CheckProgress step={step} />

        <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-6">
          <Card>
            <h2 ref={headingRef} tabIndex={-1} className="pr-6 font-display text-2xl font-extrabold uppercase leading-tight">
              {STEP_TITLES[step]}
            </h2>
            <div className="mt-6">
              {step === 2 && Object.keys(errorsForStep(clientErrors, 1)).length > 0 && (
                <p role="note" className="mb-5 text-sm text-gray-700">
                  You can read your notice here. We also need your household answers.{' '}
                  <Button variant="quiet" onClick={() => goTo(1)}>Review household questions</Button>
                </p>
              )}
              <StepView key={`${step}-${uploadGeneration}`} draft={draft} errors={errors} onChange={change} onAdultChange={changeAdult} onNoticeConfirm={confirmExtraction} />
            </div>
          </Card>

          <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex items-center justify-between gap-3 border-t border-hairline bg-air px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0">
            {previous === null ? <span /> : <Button variant="secondary" onClick={() => goTo(previous)}>Back</Button>}
            <Button type="submit" loading={saving} loadingLabel="Computing your year…">
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          action={toast.canRetry ? { label: 'Retry', onClick: () => void save() } : undefined}
          onDismiss={() => setToast(null)}
        />
      )}
    </main>
  );
}
