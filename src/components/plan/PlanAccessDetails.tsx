import Link from 'next/link';
import type { ReactNode } from 'react';

/** A feature preview, never a source of personal plan amounts or instructions. */
export function PlanAccessDetails({ upgrade }: { upgrade: boolean }) {
  return <div className="mt-8 space-y-6 border-t border-hairline pt-6">
    {!upgrade && <div>
      <p className="type-eyebrow text-violet">A look inside</p>
      <h3 className="mt-2 text-xl font-bold">Know what to do. Keep the proof.</h3>
      <p className="mt-2 text-sm text-gray-600">Feature preview. Your actual amounts, actions and deadlines come from your calculation.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-hairline bg-air/60 p-4">
          <div aria-hidden="true" className="mb-4 flex flex-wrap gap-2 text-xs font-semibold text-violet">
            <span className="rounded border border-violet/25 bg-white px-2 py-1">Exact amount</span>
            <span className="rounded border border-violet/25 bg-white px-2 py-1">Due date</span>
          </div>
          <h4 className="font-bold">One clear action at a time</h4>
          <p className="mt-2 text-sm text-gray-600">An amount, a deadline and how-to steps together, with a saved checklist for the records to keep.</p>
          <div aria-hidden="true" className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-600">
            <span className="flex size-4 items-center justify-center rounded-sm border border-violet bg-violet text-white">✓</span>
            Supporting record saved
          </div>
        </div>
        <div className="rounded-md border border-hairline bg-air/60 p-4">
          <div aria-hidden="true" className="mb-4 inline-flex size-9 items-center justify-center rounded border border-violet/25 bg-white text-violet">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6" /></svg>
          </div>
          <h4 className="font-bold">Ready for your tax preparer</h4>
          <p className="mt-2 text-sm text-gray-600">A printable summary of your inputs, calculations and plan, including deadlines and your proof checklist.</p>
          <p className="mt-4 text-xs font-semibold text-violet">Print or save as PDF</p>
        </div>
      </div>
    </div>}

    <div>
      <h3 className="text-lg font-bold">Before you choose</h3>
      <div className="mt-3 divide-y divide-hairline">
        <Answer question="What do I get after unlocking?">
          Both plans include exact move amounts, how-to steps, deadlines, a saved proof checklist, a plan explanation and a tax-preparer export. Year also includes income check-ins, history, alerts, calendar reminders and the 2027 estimate helper.
        </Answer>
        <Answer question="Will I be charged?">
          No. These buttons grant free demo access. You do not enter a card, no payment is taken and no subscription starts. The displayed prices are planned prices for the products.
        </Answer>
        <Answer question="Can I use my own numbers?">
          Yes. <Link href="/check" className="inline-flex min-h-11 items-center font-semibold text-violet underline underline-offset-4">Enter your own numbers</Link> to build your plan. Dani’s family is a fictional sample; sample figures are labeled throughout the calculation flow.
        </Answer>
      </div>
    </div>
  </div>;
}

function Answer({ question, children }: { question: string; children: ReactNode }) {
  return <details className="group py-1">
    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
      {question}
      <span aria-hidden="true" className="shrink-0 text-lg text-violet transition-transform group-open:rotate-45">+</span>
    </summary>
    <p className="pb-4 pr-4 text-sm leading-relaxed text-gray-600">{children}</p>
  </details>;
}
