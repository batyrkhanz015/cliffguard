import { Toggle } from '@/components/ui/Toggle';

type KeepMyCashToggleProps = { checked: boolean; onChange: (checked: boolean) => void };

/** On: only moves that leave your money spendable. Off: retirement contributions may be used too. */
export function KeepMyCashToggle({ checked, onChange }: KeepMyCashToggleProps) {
  return (
    <Toggle
      id="keep-my-cash"
      label="Keep my cash"
      description="Only use moves that leave your money spendable. Off lets the plan use IRA and SEP-IRA contributions, which are locked until retirement."
      checked={checked}
      onChange={onChange}
      onText="On"
      offText="Off"
    />
  );
}
