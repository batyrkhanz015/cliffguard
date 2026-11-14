import type { UnlockedMove as Move } from '@/lib/planView';
import { Card } from '@/components/ui/Card';
import { ProofChecklist } from './ProofChecklist';

const dollars = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export function UnlockedMove({ move }: { move: Move }) {
  return (
    <Card as="article">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-xl font-bold">{move.name}{move.adultId ? ` · Adult ${move.adultId.toUpperCase()}` : ''}</h3>
        <p className="tabular text-2xl font-bold text-violet">{dollars(move.amount)}</p>
      </div>
      <p className="mt-3 text-sm font-semibold">Deadline: <time dateTime={move.deadline}>{move.deadline}</time></p>
      <p className="mt-1 text-sm">Projected MAGI reduction: {dollars(move.magiReduction)}</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
        {move.howTo.map((step) => <li key={step}>{step}</li>)}
      </ol>
      <p className="mt-4 text-sm"><strong>On your return:</strong> {move.returnLocation}</p>
      {move.warnings.length > 0 && <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-cliff-strong">
        {move.warnings.map((warning) => <li key={warning}>{warning}</li>)}
      </ul>}
      <ProofChecklist leverId={move.leverId} proofs={move.proof} />
    </Card>
  );
}
