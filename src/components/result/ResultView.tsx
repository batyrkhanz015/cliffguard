'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { GigChart } from '@/components/gig/GigChart';
import { GigInput } from '@/components/gig/GigInput';
import { GigOptionsTable } from '@/components/gig/GigOptionsTable';
import type { ExactNets } from '@/components/gig/offerNets';
import type { GigOptionId } from '@/engine';
import { SampleBanner } from '@/components/shared/SampleBanner';
import { buttonClasses } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { usd } from '@/engine/format';
import { withExtraIncome } from '@/lib/extraIncome';
import { useGigCheck } from '@/lib/useGigCheck';
import type { GigCheckView } from '@/lib/planView';
import type { LoadedHousehold } from '@/lib/useHousehold';
import { CliffChart, type ChartMark } from './CliffChart';
import { DaysLeftChip } from './DaysLeftChip';
import { ExtraIncomeSlider } from './ExtraIncomeSlider';
import { FlagsAccordion } from './FlagsAccordion';
import { Headline } from './Headline';
import { HowWeGotThis } from './HowWeGotThis';
import { ReportChangeCard } from './ReportChangeCard';

/** The engine's own nets for the checked offer, for the chart's labels. */
function exactNets(result: GigCheckView): ExactNets | undefined {
  const net = (id: GigOptionId) => result.options.find((option) => option.id === id)?.netFromGig;
  const [netWithPlan, netDoNothing] = [net('take_with_plan'), net('take_do_nothing')];
  return netWithPlan === undefined || netDoNothing === undefined ? undefined : { netWithPlan, netDoNothing };
}

/** The result screen (S2) with the gig check (S3) on it. */
export function ResultView({ household }: { household: LoadedHousehold }) {
  const { input, diagnosis } = household;
  const [extra, setExtra] = useState(0);
  const gig = useGigCheck(household.lastGig);

  const scenario = useMemo(() => withExtraIncome(input, diagnosis, extra), [input, diagnosis, extra]);
  const withOffer = gig.result === null ? null : gig.result.options.find((option) => option.id === 'take_do_nothing');
  const marks = useMemo<ChartMark[]>(() => {
    const list: ChartMark[] = [{ id: 'now', label: 'Today', magi: diagnosis.income.magi, repayment: diagnosis.repayment, tone: 'now' }];
    if (extra > 0) {
      list.push({ id: 'extra', label: `With +${usd(extra)}`, shortLabel: `+${usd(extra)}`, magi: scenario.income.magi, repayment: scenario.repayment, tone: 'scenario' });
    }
    if (gig.result !== null && withOffer !== undefined && withOffer !== null) {
      list.push({ id: 'offer', label: 'With the offer', shortLabel: 'Offer', magi: gig.result.magiWith, repayment: withOffer.repayment, tone: 'scenario' });
    }
    return list;
  }, [diagnosis, extra, scenario, gig.result, withOffer]);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      {household.isSample && <SampleBanner />}
      <Headline diagnosis={diagnosis} />
      <DaysLeftChip daysToYearEnd={diagnosis.daysToYearEnd} />

      <Card>
        <h2 className="type-display text-2xl sm:text-3xl">What if you earn more?</h2>
        <div className="mt-5 space-y-6">
          <ExtraIncomeSlider extra={extra} onChange={setExtra} scenario={scenario} />
          <CliffChart input={input} diagnosis={diagnosis} marks={marks} />
        </div>
      </Card>

      <ReportChangeCard reportChange={diagnosis.reportChange} incomeEstimate={input.marketplace.incomeEstimate} />

      <Card>
        <h2 className="type-display text-2xl sm:text-3xl">Got an offer?</h2>
        <div className="mt-5 space-y-8">
          <GigInput key={gig.offer?.amount ?? 'none'} initial={gig.offer} loading={gig.loading} onSubmit={gig.check} />
          <GigOptionsTable
            result={gig.result}
            loading={gig.loading}
            error={gig.error}
            onRetry={gig.retry}
          />
          {gig.result !== null && gig.offer !== null && (
            <GigChart
              curve={gig.result.curve}
              lossZone={gig.result.lossZone}
              gigAmount={gig.offer.amount}
              exact={gig.result.gigAmount === gig.offer.amount ? exactNets(gig.result) : undefined}
              onGigChange={(amount) => gig.check({ amount, canBillInJanuary: gig.offer?.canBillInJanuary ?? false })}
            />
          )}
        </div>
      </Card>

      <div>
        <Link href="/plan" className={`${buttonClasses('primary')} w-full sm:w-auto`}>
          See my rescue plan
        </Link>
      </div>

      <div className="space-y-3">
        <HowWeGotThis input={input} diagnosis={diagnosis} />
        <FlagsAccordion flags={diagnosis.flags} />
      </div>
    </main>
  );
}
