import { fieldIdFor } from '@/components/ui/Field';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { Toggle } from '@/components/ui/Toggle';
import {
  DEFAULT_ADULT_LABELS,
  FIELD,
  adultField,
  isJoint,
  type AdultIndex,
  type StepProps,
} from '@/lib/check/draft';

function AdultRetirement({ index, draft, errors, onAdultChange }: StepProps & { index: AdultIndex }) {
  const adult = draft.adults[index];
  return (
    <fieldset className="space-y-5 border-t border-hairline pt-6">
      <legend className="font-display text-xl font-bold uppercase">
        {adult.label.trim() || DEFAULT_ADULT_LABELS[index]}
      </legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <MoneyInput
          name={adultField(index, 'iraSoFar')}
          label="Traditional IRA so far in 2026"
          value={adult.iraSoFar}
          error={errors[adultField(index, 'iraSoFar')]}
          onChange={(iraSoFar) => onAdultChange(index, { iraSoFar })}
        />
        <MoneyInput
          name={adultField(index, 'sepSoFar')}
          label="SEP-IRA so far in 2026"
          value={adult.sepSoFar}
          error={errors[adultField(index, 'sepSoFar')]}
          onChange={(sepSoFar) => onAdultChange(index, { sepSoFar })}
        />
      </div>
      <Toggle
        id={fieldIdFor(adultField(index, 'covered'))}
        label="Covered by a retirement plan at work in 2026?"
        description="A 401(k), 403(b), SIMPLE or SEP through an employer."
        checked={adult.covered}
        onChange={(covered) => onAdultChange(index, { covered })}
      />
    </fieldset>
  );
}

export function StepOptions(props: StepProps) {
  const { draft, errors, onChange } = props;
  const adults: readonly AdultIndex[] = isJoint(draft) ? [0, 1] : [0];

  return (
    <div className="space-y-7">
      <p className="text-gray-700">
        All optional. The rescue plan works with these. Leave any blank and decide on the plan.
      </p>
      <MoneyInput
        name={FIELD.unbilledInvoices}
        label="Work you could bill on or after January 1, 2027"
        hint="Only work you'd honestly invoice in January. Never ask a client to hold a payment."
        value={draft.unbilledInvoices}
        error={errors[FIELD.unbilledInvoices]}
        onChange={(unbilledInvoices) => onChange({ unbilledInvoices })}
      />
      <MoneyInput
        name={FIELD.plannedPurchases}
        label="Business purchases you'd make early in 2027 anyway"
        hint="Like a laptop or software you'll need soon."
        value={draft.plannedPurchases}
        error={errors[FIELD.plannedPurchases]}
        onChange={(plannedPurchases) => onChange({ plannedPurchases })}
      />
      <MoneyInput
        name={FIELD.plannedStockSaleGains}
        label="Gains on stock sales planned before Dec 31 that could wait"
        value={draft.plannedStockSaleGains}
        error={errors[FIELD.plannedStockSaleGains]}
        onChange={(plannedStockSaleGains) => onChange({ plannedStockSaleGains })}
      />
      <MoneyInput
        name={FIELD.hsaSoFar}
        label="HSA contributions so far in 2026"
        value={draft.hsaSoFar}
        error={errors[FIELD.hsaSoFar]}
        onChange={(hsaSoFar) => onChange({ hsaSoFar })}
      />
      {adults.map((index) => (
        <AdultRetirement key={index} index={index} {...props} />
      ))}
    </div>
  );
}
