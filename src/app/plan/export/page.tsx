import { redirect } from 'next/navigation';
import { householdIncome, type Diagnosis } from '@/engine';
import { todayAsOf } from '@/server/clock';
import { isEntitled, loadHousehold } from '@/server/household';
import { planExport } from '@/server/planAccess';
import { getSid } from '@/server/session';
import { PrintButton } from '@/components/plan/PrintButton';
import { LEVER_COPY } from '@/engine/server';
import './print.css';

const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

function FormPreview({ label, diagnosis }: { label: string; diagnosis: Diagnosis }) {
  const rows = [
    ['Household income (line 3)', money(householdIncome(diagnosis.income.magi))],
    ['Federal poverty line (line 4)', money(diagnosis.fpl)],
    ['FPL % (line 5)', `${diagnosis.fplPercent}%`],
    ['Applicable figure (line 7)', diagnosis.applicableFigure?.toFixed(4) ?? 'Not applicable — above cliff'],
    ['Annual contribution (line 8a)', money(diagnosis.annualContribution)],
    ['Annual SLCSP (benchmark)', money(diagnosis.slcsp.annual)],
    ['PTC allowed (line 24)', money(diagnosis.ptcAllowed)],
    ['APTC (line 25)', money(diagnosis.aptcReceived)],
    ['Excess APTC (line 27)', money(Math.max(0, diagnosis.aptcReceived - diagnosis.ptcAllowed))],
    ['Excess advance PTC repayment (line 29)', money(diagnosis.repayment)],
  ];
  return <section className="mt-6"><h3 className="font-bold">{label}</h3>
    <dl className="mt-2 divide-y divide-hairline">{rows.map(([name, value]) => <div key={name} className="flex flex-wrap justify-between gap-2 py-2"><dt>{name}</dt><dd className="tabular font-semibold">{value}</dd></div>)}</dl>
  </section>;
}

export default async function ExportPage() {
  const household = await loadHousehold(await getSid());
  const asOf = todayAsOf();
  if (!household || !isEntitled(household, asOf)) redirect('/plan');
  const { input, lastGig, planProgress } = household;
  const { plan, before, after } = planExport(household, asOf);
  const timestamp = new Date().toISOString();
  const demo = household.entitlement?.stripeSessionId.startsWith('demo_');
  const filingLabels = { single: 'Single', mfj: 'Married filing jointly', hoh: 'Head of household' };

  return <main className="plan-export mx-auto w-full max-w-4xl px-4 py-10 text-sm leading-relaxed sm:px-6">
    <div className="print:hidden mb-6 flex flex-wrap gap-4"><PrintButton /><a href="/plan" className="self-center text-violet underline">Back to plan</a></div>
    <h1 className="font-display text-3xl font-bold">CliffGuard · tax-preparer export</h1>
    <p className="mt-2">Tax year 2026 · {demo ? 'Demo access — no payment taken' : 'Unlocked plan'}</p>
    <p>Rules: {before.rulesId} · Engine as of {asOf} · Generated {timestamp}</p>
    <p className="mt-3 font-semibold">Education, not tax advice. Rules as of Nov 2026. Projections are not a filed return; review eligibility, actual income and Form 1095-A with your preparer.</p>

    <section className="mt-8"><h2 className="text-xl font-bold">Household inputs</h2>
      <p className="mt-2">State: {input.state} · Filing status: {filingLabels[input.filingStatus]} · Tax family size (Form 8962 line 1): {input.householdSize}</p>
      <p>Marketplace estimate: {money(input.marketplace.incomeEstimate)} · APTC/month: {money(input.marketplace.aptcMonthly)} · Months: {input.marketplace.monthsWithAptc}</p>
      <p>Premium/month: {input.marketplace.premiumMonthly === null ? 'Not provided (credit not capped by premium)' : money(input.marketplace.premiumMonthly)} · {input.marketplace.planMetal} · {input.marketplace.coverage} coverage</p>
      <p>SLCSP method: {before.slcsp.source === 'manual' ? 'User-entered annual benchmark' : 'Derived: annual advance credit + required contribution at estimated income'}. Full credit taken: {input.marketplace.tookFullCredit ? 'yes' : 'no'}; household unchanged: {input.marketplace.householdUnchanged ? 'yes' : 'no'}.</p>
      {input.adults.map((adult) => <p key={adult.id} className="mt-2">{adult.label} (Adult {adult.id.toUpperCase()}): SE profit YTD {money(adult.selfEmploymentProfit.ytd)}, expected {money(adult.selfEmploymentProfit.expectedRest)}; wages YTD {money(adult.wages.ytd)}, expected {money(adult.wages.expectedRest)}. Workplace plan: {adult.coveredByWorkplacePlan ? 'yes' : 'no'}. IRA already contributed {money(adult.contributedSoFar.traditionalIra)}; SEP {money(adult.contributedSoFar.sepIra)}.</p>)}
      <p className="mt-2">Investments: taxable interest {money(input.investments.taxableInterest)}, tax-exempt interest {money(input.investments.taxExemptInterest)}, dividends {money(input.investments.dividends)}, net capital gains {money(input.investments.capitalGainsNet)}, other income {money(input.investments.otherIncome)}, other MAGI addbacks {money(input.investments.otherMagiAddbacks)}.</p>
      <p>Adjustments: HSA already contributed {money(input.adjustments.hsaContributedSoFar)}; other above-the-line deductions {money(input.adjustments.otherAboveTheLine)}.</p>
      <p>Available options: movable unbilled invoices {money(input.levers.unbilledInvoicesMovable)}, planned purchases {money(input.levers.plannedPurchases)}, planned stock-sale gains {money(input.levers.plannedStockSaleGains)}.</p>
      <p>Scenario: {lastGig ? `Additional gig ${money(lastGig.amount)}; January billing allowed: ${lastGig.canBillInJanuary ? 'yes' : 'no'}` : 'No additional gig'}.</p>
      <p>Keep my cash: {input.preferences.keepMyCash ? 'on' : 'off'} · Saved lever order: {input.preferences.leverOrder.map((id) => LEVER_COPY[id].name).join(' → ') || 'Default order'}.</p>
    </section>

    <section className="mt-8"><h2 className="text-xl font-bold">MAGI breakdown (before → after proposed moves)</h2>
      <dl className="mt-2 divide-y divide-hairline">{([
        ['Projected self-employment profit', before.income.seProfitByAdult.a + before.income.seProfitByAdult.b, after.income.seProfitByAdult.a + after.income.seProfitByAdult.b],
        ['Wages', before.income.wages, after.income.wages],
        ['Deduction: half of SE tax', before.income.halfSeTax, after.income.halfSeTax],
        ['Allowed capital gains/losses', before.income.capGainsAllowed, after.income.capGainsAllowed],
        ['Adjusted gross income', before.income.agi, after.income.agi],
        ['PTC MAGI', before.income.magi, after.income.magi],
      ] as const).map(([label, initial, final]) => <div key={label} className="flex flex-wrap justify-between gap-2 py-2"><dt>{label}</dt><dd>{money(initial)} → {money(final)}</dd></div>)}</dl>
      <p className="mt-2">MAGI = AGI + tax-exempt interest + other MAGI addbacks. AGI includes the household inputs above and proposed HSA/retirement deductions below. QBI and the self-employed health-insurance deduction are excluded.</p>
    </section>
    <section className="mt-8"><h2 className="text-xl font-bold">Form 8962 preview</h2>
      <p>Labels follow the 2025 form. Tax family size: {input.householdSize}. Repayment limitation: none for 2026.</p>
      <FormPreview label="Before proposed moves" diagnosis={before} /><FormPreview label="After proposed moves" diagnosis={after} />
    </section>

    <section className="mt-8"><h2 className="text-xl font-bold">Proposed moves · {plan.verdict.replaceAll('_', ' ')}</h2>
      {plan.moves.length === 0 && <p className="mt-2">No actionable moves in the current plan. {plan.setAside !== null ? `Projected repayment to set aside: ${money(plan.setAside)}.` : 'Monitor income and review your Marketplace estimate.'}</p>}
      {plan.moves.map((move) => <article key={`${move.leverId}-${move.adultId ?? 'household'}`} className="mt-5 border-t border-hairline pt-4">
        <h3 className="font-bold">{LEVER_COPY[move.leverId].name}{move.adultId ? ` · Adult ${move.adultId.toUpperCase()}` : ''}: {money(move.amount)}</h3>
        <p>Deadline: {move.deadline} · MAGI reduction: {money(move.magiReduction)} · {move.liquidity.replaceAll('_', ' ')}</p>
        <ol className="mt-2 list-decimal pl-5">{move.howTo.map((step) => <li key={step}>{step}</li>)}</ol>
        <p className="mt-2"><strong>Return location:</strong> {move.returnLocation}</p>
        <p><strong>Move status:</strong> {planProgress[move.leverId]?.done ? 'Marked complete' : 'Not complete'}</p>
        <ul className="mt-2">{move.proof.map((proof, index) => <li key={proof}>{planProgress[move.leverId]?.proofsChecked.includes(index) ? '[x]' : '[ ]'} {proof}</li>)}</ul>
        {move.warnings.map((warning) => <p key={warning} className="mt-2"><strong>Warning:</strong> {warning}</p>)}
      </article>)}
    </section>
    <section className="mt-8"><h2 className="text-xl font-bold">Flags and assumptions</h2>
      <ul className="mt-2 list-disc pl-5">{[...new Set([...before.flags, ...plan.flags])].map((flag) => <li key={flag}>{flag.replaceAll('_', ' ')}</li>)}</ul>
      <p className="mt-3">No filing, investment transaction or contribution is performed by CliffGuard. Verify deadlines, plan eligibility, allowable deductions and supporting documents before taking action.</p>
    </section>
  </main>;
}
