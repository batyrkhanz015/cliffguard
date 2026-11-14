import type { Diagnosis } from '@/engine';
import { usd } from '@/engine/format';
import { Card } from '@/components/ui/Card';

type ReportChangeCardProps = {
  reportChange: Diagnosis['reportChange'];
  /** The income you told HealthCare.gov. */
  incomeEstimate: number;
};

/** Whether to update the income estimate on HealthCare.gov, so the monthly credit matches the year. */
export function ReportChangeCard({ reportChange, incomeEstimate }: ReportChangeCardProps) {
  return (
    <Card>
      <p className="type-eyebrow text-violet">Report a change</p>
      {reportChange.recommended ? (
        <>
          <h2 className="type-display mt-2 text-2xl">Update HealthCare.gov</h2>
          <p className="mt-3 text-gray-700">
            You told them {usd(incomeEstimate)}. Your year looks like {usd(reportChange.incomeToReport)}. Report
            the change before December so your monthly credit matches and April holds fewer surprises.
          </p>
        </>
      ) : (
        <>
          <h2 className="type-display mt-2 text-2xl">Your estimate is close</h2>
          <p className="mt-3 text-gray-700">
            You told them {usd(incomeEstimate)}. Your year looks like {usd(reportChange.incomeToReport)}. No
            update needed yet.
          </p>
        </>
      )}
    </Card>
  );
}
