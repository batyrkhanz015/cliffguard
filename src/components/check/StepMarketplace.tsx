import { Disclosure } from '@/components/ui/Disclosure';
import { fieldIdFor } from '@/components/ui/Field';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { Stepper } from '@/components/ui/Stepper';
import { Toggle } from '@/components/ui/Toggle';
import { FIELD, benchmarkFieldShown, type StepProps } from '@/lib/check/draft';

export function StepMarketplace({ draft, errors, onChange }: StepProps) {
  return (
    <div className="space-y-7">
      <p className="text-gray-700">These numbers are on your Marketplace eligibility notice.</p>

      <MoneyInput
        name={FIELD.incomeEstimate}
        label="Household income you estimated for 2026"
        hint="What you told HealthCare.gov when you enrolled."
        placeholder="e.g. 85,000"
        value={draft.incomeEstimate}
        error={errors[FIELD.incomeEstimate]}
        onChange={(incomeEstimate) => onChange({ incomeEstimate })}
      />

      <MoneyInput
        name={FIELD.aptcMonthly}
        label="Advance credit per month (APTC)"
        hint="If your credit changed during the year, enter your average monthly credit."
        placeholder="e.g. 650"
        value={draft.aptcMonthly}
        error={errors[FIELD.aptcMonthly]}
        onChange={(aptcMonthly) => onChange({ aptcMonthly })}
      />

      <div className="space-y-5 border-t border-hairline pt-6">
        <Toggle
          id={fieldIdFor(FIELD.tookFullCredit)}
          label="Did you take the full credit you were offered?"
          description="Say no if you applied only part of it to your premium."
          checked={draft.tookFullCredit}
          onChange={(tookFullCredit) => onChange({ tookFullCredit })}
        />
        <Toggle
          id={fieldIdFor(FIELD.householdUnchanged)}
          label="Is your household the same as when you enrolled?"
          description="Same people on your plan and on your tax return."
          checked={draft.householdUnchanged}
          onChange={(householdUnchanged) => onChange({ householdUnchanged })}
        />
      </div>

      {benchmarkFieldShown(draft) && (
        <MoneyInput
          name={FIELD.benchmark}
          label="Benchmark plan cost for all of 2026"
          hint="We can't work this out from your credit here. It's the yearly cost of your area's second-lowest-cost silver plan. Find it with HealthCare.gov's tax tool, or use the yearly total in column B of Form 1095-A."
          placeholder="e.g. 18,000"
          value={draft.benchmarkAnnual}
          error={errors[FIELD.benchmark]}
          onChange={(benchmarkAnnual) => onChange({ benchmarkAnnual })}
        />
      )}

      <Disclosure
        summary="More about your credit"
        forceOpen={draft.premiumMonthly.trim() !== '' || draft.monthsWithAptc !== 12}
      >
        <div className="space-y-7">
          <Stepper
            id={fieldIdFor(FIELD.monthsWithAptc)}
            label="Months you got the credit"
            value={draft.monthsWithAptc}
            min={1}
            max={12}
            onChange={(monthsWithAptc) => onChange({ monthsWithAptc })}
          />
          <MoneyInput
            name={FIELD.premiumMonthly}
            label="Monthly premium before the credit"
            hint="Lets us cap any refund at what you actually paid."
            placeholder="e.g. 1,240"
            optional
            value={draft.premiumMonthly}
            error={errors[FIELD.premiumMonthly]}
            onChange={(premiumMonthly) => onChange({ premiumMonthly })}
          />
        </div>
      </Disclosure>
    </div>
  );
}
