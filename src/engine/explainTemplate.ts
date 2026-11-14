import type { Diagnosis } from './diagnose';
import { formatDate, movesBring, usd } from './format';
import type { Explanation, FlagCode, LeverId, Move, PlanResult } from './types';

/** Static copy for the flags that change how far to trust the numbers. */
const FLAG_CAVEATS: Record<FlagCode, string> = {
  NO_APTC: 'You get no advance credit, so there is nothing to repay; you may be due a credit at filing.',
  PARTIAL_YEAR: 'You had the credit for part of the year only, so the figures cover those months.',
  CAPITAL_LOSS_LIMITED: 'Capital losses count only up to the annual limit; carryovers from earlier years are not included.',
  BELOW_100_FPL: 'Income below the poverty line follows different Marketplace rules. Check with an enrollment helper.',
  SBM_STATE: 'Your state runs its own exchange. Its rules and dates can differ from these.',
  SEHI_DEDUCTION_EXCLUDED: 'We left out the self-employed health insurance deduction, so your true income may be lower.',
  AGE_CATCHUP_EXCLUDED: 'Age 50+ catch-up contributions are not counted, so you may be able to contribute more.',
  ROUGH_TAX_ESTIMATE: 'Tax figures are rough: standard deduction and brackets only, no state tax or credits.',
  CATASTROPHIC_NO_PTC: 'A catastrophic plan earns no premium tax credit, so there is no cliff to protect.',
  IRA_SEP_COMBO_EXCLUDED: 'We do not combine IRA and SEP-IRA deductions in one plan; ask a tax pro if you want both.',
  NEAR_CLIFF_STEP: 'You are close enough to the line that the next thousand dollars would cross it; the cost shown is the smooth rate below it.',
};
const MAX_CAVEATS = 4;

const MOVE_NOTES: Record<LeverId, (move: Move) => string> = {
  invoiceTiming: (m) => `Bill ${usd(m.amount)} of work in January instead. The money still arrives, just in 2027.`,
  businessPurchases: (m) => `Buy the ${usd(m.amount)} of business equipment or supplies before ${formatDate(m.deadline)}.`,
  hsa: (m) => `Put ${usd(m.amount)} in an HSA by ${formatDate(m.deadline)}. It stays yours and is spendable on health costs.`,
  delayStockSale: (m) => `Sell ${usd(m.amount)} of gains in January instead of this year.`,
  traditionalIra: (m) => `Contribute ${usd(m.amount)} to a traditional IRA by ${formatDate(m.deadline)}. It is locked until retirement.`,
  sepIra: (m) => `Contribute ${usd(m.amount)} to a SEP-IRA by ${formatDate(m.deadline)}. It is locked until retirement.`,
};

function headlineFor(d: Diagnosis): string {
  switch (d.zone) {
    case 'over':
      return `You are ${usd(-d.headroom)} over the subsidy cliff`;
    case 'below_100':
      return 'Your income is below the poverty line';
    case 'near':
    case 'clear':
      return `You are ${usd(d.headroom)} under the subsidy cliff`;
  }
}

function situation(d: Diagnosis): string {
  const income = `Your projected income is ${usd(d.income.magi)} against a cliff of ${usd(d.cliff)}.`;
  if (d.zone === 'over') {
    const outcome =
      d.repayment > 0
        ? `so you would repay all ${usd(d.repayment)} of the advance credit you received`
        : 'but you received no advance credit, so you would repay nothing';
    return `${income} Over the line you get no premium credit, ${outcome}.`;
  }
  if (d.zone === 'below_100') return `${income} That is under 100% of the poverty line, where the Marketplace rules differ.`;
  const bill = d.repayment > 0 ? `You would repay ${usd(d.repayment)} at filing` : `You would repay nothing at filing`;
  return `${income} ${bill}, and keep ${usd(d.ptcAllowed)} of credit.`;
}

function slope(d: Diagnosis): string | null {
  if (d.zone === 'over' || d.zone === 'below_100') return null;
  return `Each extra thousand dollars of income adds about ${usd(d.per1000)} to your bill at filing, and ${d.daysToYearEnd} days remain to change this year's income.`;
}

function planParagraph(plan: PlanResult | null): string | null {
  if (plan === null) return null;
  switch (plan.verdict) {
    case 'under_line':
      return null;
    case 'worth_it':
    case 'costly':
      return `${movesBring(plan.moves.length)} income from ${usd(plan.magiBefore)} to ${usd(plan.magiAfter)} and cut the repayment from ${usd(plan.repaymentBefore)} to ${usd(plan.repaymentAfter)}.${plan.verdict === 'costly' ? ' The money tied up costs more than the credit it saves; weigh it before acting.' : ''}`;
    case 'needs_retirement_moves':
      return 'Only retirement contributions get you under the line. Allow them to see the plan.';
    case 'not_worth_fighting':
      return `No combination of moves keeps the credit. Set ${usd(plan.setAside ?? plan.repaymentBefore)} aside and give an accurate 2027 estimate.`;
  }
}

/**
 * A plain-English reading of the diagnosis and the rescue plan from static templates. Deterministic;
 * every number comes from the arguments. The fallback when Claude's explanation is unavailable.
 */
export function templateExplanation(d: Diagnosis, plan: PlanResult | null): Explanation {
  const paragraphs = [situation(d), slope(d), planParagraph(plan)].filter((p): p is string => p !== null);
  const flags = new Set<FlagCode>([...d.flags, ...(plan?.flags ?? [])]);
  return {
    headline: headlineFor(d),
    paragraphs,
    moveNotes: (plan?.moves ?? []).map((move) => ({ leverId: move.leverId, note: MOVE_NOTES[move.leverId](move) })),
    caveats: [...flags].map((flag) => FLAG_CAVEATS[flag]).slice(0, MAX_CAVEATS),
  };
}
