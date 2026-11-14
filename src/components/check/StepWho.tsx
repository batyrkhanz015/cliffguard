import { TY2026 } from '@/engine/rules/ty2026';
import { US_STATE_CODES, UsStateCodeSchema } from '@/engine/types';
import { ChoiceGroup, type Choice } from '@/components/ui/ChoiceGroup';
import { Field, INPUT_CLASS, describedBy, fieldIdFor } from '@/components/ui/Field';
import { Stepper } from '@/components/ui/Stepper';
import { FIELD, minHouseholdSize, type FilingChoice, type StepProps } from '@/lib/check/draft';
import { MFS_UNSUPPORTED } from '@/lib/check/validate';
import { US_STATE_NAMES } from '@/lib/usStates';

const FILING_CHOICES: readonly Choice<FilingChoice>[] = [
  { value: 'single', label: 'Single' },
  { value: 'mfj', label: 'Married filing jointly' },
  { value: 'hoh', label: 'Head of household' },
  { value: 'mfs', label: 'Married filing separately' },
];

export function StepWho({ draft, errors, onChange }: StepProps) {
  const stateId = fieldIdFor(FIELD.state);
  const stateError = errors[FIELD.state];
  const ownExchangeState = draft.state !== '' && TY2026.sbmStates.includes(draft.state) ? draft.state : null;

  return (
    <div className="space-y-7">
      <div>
        <Field id={stateId} label="State you live in" error={stateError}>
          <select
            id={stateId}
            name={FIELD.state}
            value={draft.state}
            onChange={(event) => {
              const parsed = UsStateCodeSchema.safeParse(event.target.value);
              onChange({ state: parsed.success ? parsed.data : '' });
            }}
            aria-invalid={stateError ? true : undefined}
            aria-describedby={describedBy(stateId, { error: stateError })}
            className={INPUT_CLASS}
          >
            <option value="">Choose a state</option>
            {US_STATE_CODES.map((code) => (
              <option key={code} value={code}>
                {US_STATE_NAMES[code]}
              </option>
            ))}
          </select>
        </Field>
        {ownExchangeState && (
          <p role="note" className="mt-3 rounded-md border border-violet/40 bg-violet/5 p-3 text-sm text-gray-800">
            {US_STATE_NAMES[ownExchangeState]} runs its own marketplace. The federal math here is the same, but your state
            may add its own subsidy that we don&apos;t model.
          </p>
        )}
      </div>

      <ChoiceGroup
        name={FIELD.filingStatus}
        legend="How you file your taxes"
        options={FILING_CHOICES}
        value={draft.filingStatus}
        error={errors[FIELD.filingStatus] ?? (draft.filingStatus === 'mfs' ? MFS_UNSUPPORTED : undefined)}
        onChange={(filingStatus) =>
          onChange({ filingStatus, householdSize: Math.max(draft.householdSize, minHouseholdSize(filingStatus)) })
        }
      />

      <Stepper
        id={fieldIdFor(FIELD.householdSize)}
        label="People on your tax return"
        hint="You, a spouse if you file jointly, and anyone you claim as a dependent."
        error={errors[FIELD.householdSize]}
        value={draft.householdSize}
        min={minHouseholdSize(draft.filingStatus)}
        max={10}
        onChange={(householdSize) => onChange({ householdSize })}
      />
    </div>
  );
}
