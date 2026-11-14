import { Disclosure } from '@/components/ui/Disclosure';
import { Field, INPUT_CLASS, describedBy, fieldIdFor } from '@/components/ui/Field';
import { MoneyInput } from '@/components/ui/MoneyInput';
import {
  DEFAULT_ADULT_LABELS,
  FIELD,
  adultField,
  isJoint,
  type AdultIndex,
  type StepProps,
} from '@/lib/check/draft';

function AdultIncome({ index, draft, errors, onAdultChange }: StepProps & { index: AdultIndex }) {
  const adult = draft.adults[index];
  const nameField = adultField(index, 'label');
  const nameId = fieldIdFor(nameField);
  const nameError = errors[nameField];
  const money = (key: 'seYtd' | 'seRest' | 'wagesYtd' | 'wagesRest') => ({
    name: adultField(index, key),
    value: adult[key],
    error: errors[adultField(index, key)],
    onChange: (text: string) => onAdultChange(index, { [key]: text }),
  });

  return (
    <fieldset className="space-y-5 border-t border-hairline pt-6 first:border-t-0 first:pt-0">
      <legend className="font-display text-xl font-bold uppercase">
        {adult.label.trim() || DEFAULT_ADULT_LABELS[index]}
      </legend>
      <Field id={nameId} label="Name" optional error={nameError}>
        <input
          id={nameId}
          name={nameField}
          type="text"
          maxLength={24}
          autoComplete="off"
          placeholder={DEFAULT_ADULT_LABELS[index]}
          value={adult.label}
          aria-invalid={nameError ? true : undefined}
          aria-describedby={describedBy(nameId, { error: nameError })}
          onChange={(event) => onAdultChange(index, { label: event.target.value })}
          className={INPUT_CLASS}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <MoneyInput
          label="Self-employment profit so far"
          hint="Profit after business expenses, Jan 1 to today."
          placeholder="e.g. 60,000"
          {...money('seYtd')}
        />
        <MoneyInput label="Still expected by Dec 31" hint="Profit you expect to earn." placeholder="e.g. 10,000" {...money('seRest')} />
        <MoneyInput label="W-2 wages so far" hint="Box 1 of your pay stubs, year to date." placeholder="e.g. 0" {...money('wagesYtd')} />
        <MoneyInput label="Still expected by Dec 31" hint="Wages you expect to be paid." placeholder="e.g. 0" {...money('wagesRest')} />
      </div>
    </fieldset>
  );
}

export function StepIncome(props: StepProps) {
  const { draft, errors, onChange } = props;
  const adults: readonly AdultIndex[] = isJoint(draft) ? [0, 1] : [0];
  const otherAmounts = [
    draft.taxableInterest,
    draft.taxExemptInterest,
    draft.dividends,
    draft.capitalGainsNet,
    draft.otherIncome,
    draft.otherMagiAddbacks,
    draft.otherAboveTheLine,
  ];
  const hasOtherAmounts = otherAmounts.some((text) => text.trim() !== '');

  return (
    <div className="space-y-7">
      <p className="text-gray-700">Leave a box blank if it&apos;s zero.</p>
      {adults.map((index) => (
        <AdultIncome key={index} index={index} {...props} />
      ))}

      <Disclosure summary="Investments and other income" forceOpen={hasOtherAmounts}>
        <div className="grid gap-5 sm:grid-cols-2">
          <MoneyInput
            name={FIELD.taxableInterest}
            label="Taxable interest"
            value={draft.taxableInterest}
            error={errors[FIELD.taxableInterest]}
            onChange={(taxableInterest) => onChange({ taxableInterest })}
          />
          <MoneyInput
            name={FIELD.taxExemptInterest}
            label="Tax-exempt interest"
            hint="Counts toward the credit even though it isn't taxed."
            value={draft.taxExemptInterest}
            error={errors[FIELD.taxExemptInterest]}
            onChange={(taxExemptInterest) => onChange({ taxExemptInterest })}
          />
          <MoneyInput
            name={FIELD.dividends}
            label="Dividends"
            hint="Include fund capital-gain distributions."
            value={draft.dividends}
            error={errors[FIELD.dividends]}
            onChange={(dividends) => onChange({ dividends })}
          />
          <MoneyInput
            name={FIELD.capitalGainsNet}
            label="Net capital gains"
            hint="Sales so far plus any you plan before Dec 31. Write a loss like -2,000."
            signed
            value={draft.capitalGainsNet}
            error={errors[FIELD.capitalGainsNet]}
            onChange={(capitalGainsNet) => onChange({ capitalGainsNet })}
          />
          <MoneyInput
            name={FIELD.otherIncome}
            label="Other taxable income"
            value={draft.otherIncome}
            error={errors[FIELD.otherIncome]}
            onChange={(otherIncome) => onChange({ otherIncome })}
          />
          <MoneyInput
            name={FIELD.otherMagiAddbacks}
            label="Other income the credit counts"
            hint="Untaxed Social Security, excluded foreign income, dependents' income if they must file."
            value={draft.otherMagiAddbacks}
            error={errors[FIELD.otherMagiAddbacks]}
            onChange={(otherMagiAddbacks) => onChange({ otherMagiAddbacks })}
          />
          <MoneyInput
            name={FIELD.otherAboveTheLine}
            label="Other deductions before AGI"
            hint="Student loan interest, educator expenses and similar."
            value={draft.otherAboveTheLine}
            error={errors[FIELD.otherAboveTheLine]}
            onChange={(otherAboveTheLine) => onChange({ otherAboveTheLine })}
          />
        </div>
      </Disclosure>
    </div>
  );
}
