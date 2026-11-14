import { Card } from '@/components/ui/Card';
import { formatMoney } from '@/lib/money';
import type { CheckinView } from '@/lib/checkinView';
export function History({ history }: { history: CheckinView[] }) {
  if (history.length === 0) return null;
  const values = history.map(item => item.result.magi);
  const min = Math.min(...values); const span = Math.max(1, Math.max(...values) - min);
  const points = values.map((value, index) => `${10 + index * 280 / Math.max(1, values.length - 1)},${65 - (value - min) * 50 / span}`).join(' ');
  return <Card>
    <h2 className="text-xl font-bold">Check-in history</h2>
    {history.length > 1 && <svg viewBox="0 0 300 80" role="img" aria-label="Projected MAGI over your saved check-ins; amounts appear in the table below" className="mt-3 h-24 w-full text-violet"><polyline fill="none" stroke="currentColor" strokeWidth="3" points={points} /></svg>}
    <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm tabular"><caption className="sr-only">Your last 24 check-ins, oldest first</caption><thead><tr>{['Date', 'MAGI', 'Headroom', 'Repayment'].map(label => <th scope="col" className="pb-2 pr-3" key={label}>{label}</th>)}</tr></thead><tbody>{history.map(item => <tr className="border-t border-gray-200" key={item.id}><th scope="row" className="whitespace-nowrap py-3 pr-3 font-normal">{item.asOf}</th>{[item.result.magi, item.result.headroom, item.result.repayment].map((value, index) => <td key={index} className="whitespace-nowrap py-3 pr-3">{formatMoney(value)}</td>)}</tr>)}</tbody></table></div>
  </Card>;
}
