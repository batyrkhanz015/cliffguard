import { describe, expect, it } from 'vitest';
import { DANI } from '@/samples/dani';
import { EMPTY_DRAFT, FIELD, adultField, draftFromInput, type CheckDraft } from '../draft';
import { MFS_UNSUPPORTED, errorsForStep, firstStepWithError, stepForField, validateDraft } from '../validate';

const dani = draftFromInput(DANI);

function withDani(patch: Partial<CheckDraft>): CheckDraft {
  return { ...dani, ...patch };
}

function errorsOf(draft: CheckDraft) {
  const result = validateDraft(draft);
  return result.ok ? {} : result.errors;
}

describe('validateDraft', () => {
  it("round-trips Dani's sample inputs exactly", () => {
    expect(validateDraft(dani)).toEqual({ ok: true, input: DANI });
  });

  it('asks only for the required answers on an empty form', () => {
    expect(Object.keys(errorsOf(EMPTY_DRAFT)).sort()).toEqual([
      FIELD.filingStatus,
      FIELD.incomeEstimate,
      FIELD.aptcMonthly,
      FIELD.coverage,
      FIELD.planMetal,
      FIELD.state,
    ].sort());
  });

  it('treats blank optional amounts as zero and a blank premium as unknown', () => {
    const draft = withDani({ dividends: '', unbilledInvoices: '', premiumMonthly: '' });
    const result = validateDraft(draft);
    if (!result.ok) throw new Error('expected a valid draft');
    expect(result.input.investments.dividends).toBe(0);
    expect(result.input.levers.unbilledInvoicesMovable).toBe(0);
    expect(result.input.marketplace.premiumMonthly).toBeNull();
  });

  it('reads amounts the way people type them', () => {
    const result = validateDraft(withDani({ incomeEstimate: '$98.5k', aptcMonthly: ' 650 ' }));
    if (!result.ok) throw new Error('expected a valid draft');
    expect(result.input.marketplace.incomeEstimate).toBe(98_500);
    expect(result.input.marketplace.aptcMonthly).toBe(650);
  });

  it('rejects garbage and negative amounts with inline messages', () => {
    const errors = errorsOf(withDani({ incomeEstimate: 'abc', plannedPurchases: '-5' }));
    expect(errors[FIELD.incomeEstimate]).toBe('Enter a dollar amount, like 105,000 or 105k.');
    expect(errors[FIELD.plannedPurchases]).toBe('Enter an amount of $0 or more.');
  });

  it('accepts a net capital loss', () => {
    const result = validateDraft(withDani({ capitalGainsNet: '-2,000' }));
    if (!result.ok) throw new Error('expected a valid draft');
    expect(result.input.investments.capitalGainsNet).toBe(-2_000);
  });

  it('keeps only the first adult unless filing jointly', () => {
    const result = validateDraft(withDani({ filingStatus: 'hoh', householdSize: 3 }));
    if (!result.ok) throw new Error('expected a valid draft');
    expect(result.input.adults).toHaveLength(1);
    expect(result.input.adults[0].label).toBe('Dani');
  });

  it('falls back to a default name when the name is blank', () => {
    const [first, second] = dani.adults;
    const result = validateDraft(withDani({ adults: [{ ...first, label: '  ' }, second] }));
    if (!result.ok) throw new Error('expected a valid draft');
    expect(result.input.adults[0].label).toBe('You');
  });

  it('requires the benchmark when a guard is "no"', () => {
    const errors = errorsOf(withDani({ tookFullCredit: false, benchmarkAnnual: '' }));
    expect(Object.keys(errors)).toEqual([FIELD.benchmark]);
  });

  it('uses the benchmark only while its field is shown', () => {
    const manual = validateDraft(withDani({ householdUnchanged: false, benchmarkAnnual: '19,800' }));
    const hidden = validateDraft(withDani({ benchmarkAnnual: '19,800' }));
    if (!manual.ok || !hidden.ok) throw new Error('expected valid drafts');
    expect(manual.input.marketplace.slcspAnnualOverride).toBe(19_800);
    expect(hidden.input.marketplace.slcspAnnualOverride).toBeNull();
  });

  it('explains why married filing separately is not supported', () => {
    expect(errorsOf(withDani({ filingStatus: 'mfs' }))[FIELD.filingStatus]).toBe(MFS_UNSUPPORTED);
  });

  it("maps the schema's limits to plain messages", () => {
    expect(errorsOf(withDani({ aptcMonthly: '20,000' }))[FIELD.aptcMonthly]).toBe('Enter $10,000 or less.');
  });
});

describe('steps', () => {
  it.each([
    [FIELD.state, 1],
    [FIELD.householdSize, 1],
    [FIELD.aptcMonthly, 2],
    [FIELD.benchmark, 2],
    [FIELD.planMetal, 3],
    [adultField(1, 'wagesRest'), 4],
    [FIELD.capitalGainsNet, 4],
    [FIELD.otherAboveTheLine, 4],
    [adultField(0, 'iraSoFar'), 5],
    [adultField(1, 'covered'), 5],
    [FIELD.hsaSoFar, 5],
    [FIELD.unbilledInvoices, 5],
  ] as const)('puts %s on step %d', (path, step) => {
    expect(stepForField(path)).toBe(step);
  });

  it('filters errors to one step and finds the first step with an error', () => {
    const errors = { [FIELD.unbilledInvoices]: 'x', [FIELD.aptcMonthly]: 'y' };
    expect(errorsForStep(errors, 2)).toEqual({ [FIELD.aptcMonthly]: 'y' });
    expect(firstStepWithError(errors)).toBe(2);
    expect(firstStepWithError({})).toBeNull();
  });
});
