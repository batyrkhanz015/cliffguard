import { ChoiceGroup, type Choice } from '@/components/ui/ChoiceGroup';
import { FIELD, type Coverage, type PlanMetal, type StepProps } from '@/lib/check/draft';

const METALS: readonly Choice<PlanMetal>[] = [
  { value: 'bronze', label: 'Bronze' },
  { value: 'catastrophic', label: 'Catastrophic' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'unknown', label: 'Not sure' },
];

const COVERAGE: readonly Choice<Coverage>[] = [
  { value: 'self', label: 'Just me' },
  { value: 'family', label: 'Me and family' },
];

export function StepPlan({ draft, errors, onChange }: StepProps) {
  return (
    <div className="space-y-7">
      <ChoiceGroup
        name={FIELD.planMetal}
        legend="Your plan's metal level"
        hint="From 2026, bronze and catastrophic plans can be paired with an HSA."
        options={METALS}
        value={draft.planMetal}
        error={errors[FIELD.planMetal]}
        onChange={(planMetal) => onChange({ planMetal })}
      />
      <ChoiceGroup
        name={FIELD.coverage}
        legend="Who the plan covers"
        hint="This sets how much you can put in an HSA."
        options={COVERAGE}
        value={draft.coverage}
        error={errors[FIELD.coverage]}
        onChange={(coverage) => onChange({ coverage })}
      />
    </div>
  );
}
