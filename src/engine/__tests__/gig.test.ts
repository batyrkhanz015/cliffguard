import { describe, expect, test } from 'vitest';
import { DANI, DANI_AS_OF, DANI_GIG } from '@/samples/dani';
import { gigCheck } from '../gig';
import * as server from '../server';
import { expectDollars } from './fixtures';

const CAN_BILL_IN_JANUARY = { ...DANI_GIG, canBillInJanuary: true };
const optionOf = (result: ReturnType<typeof gigCheck>, id: string) => {
  const option = result.options.find((o) => o.id === id);
  if (option === undefined) throw new Error(`no option ${id}`);
  return option;
};

describe('gigCheck: spec §B F3', () => {
  const result = gigCheck(DANI, DANI_GIG, DANI_AS_OF);

  test('MAGI with the gig and what the gig costs in tax', () => {
    expect(result.gigAmount).toBe(12_000);
    expectDollars(result.magiWith, 133_188);
    expect(result.crossesCliff).toBe(true);
    expectDollars(result.taxOnGig.seTax, 1_696);
    expectDollars(result.taxOnGig.incomeTax, 1_338);
    expectDollars(result.taxOnGig.total, 3_034);
    expect(result.taxOnGig.marginalRate).toBe(0.12);
  });

  test('doing nothing nets $1,321 and repays the full credit; the plan nets $8,548', () => {
    const doNothing = optionOf(result, 'take_do_nothing');
    expectDollars(doNothing.netFromGig, 1_321);
    expectDollars(doNothing.repayment, 9_342);
    expectDollars(optionOf(result, 'take_with_plan').netFromGig, 8_548);
    expect(optionOf(result, 'decline').netFromGig).toBe(0);
    expect(result.options.map((o) => o.id)).not.toContain('bill_in_january');
  });

  test('carries the plan flags and the rough tax estimate flag', () => {
    expect(result.plan.verdict).toBe('worth_it');
    expect(result.flags).toEqual(['ROUGH_TAX_ESTIMATE']);
  });

  test('the curve runs 0 to 30,000 in steps of 500 and starts at zero', () => {
    expect(result.curve).toHaveLength(61);
    expect(result.curve[0]).toEqual({ gig: 0, netDoNothing: 0, netWithPlan: 0 });
    expect(result.curve[60].gig).toBe(30_000);
    const at12k = result.curve.find((p) => p.gig === 12_000);
    expectDollars(at12k?.netDoNothing ?? NaN, 1_321);
    expectDollars(at12k?.netWithPlan ?? NaN, 8_548);
  });
});

describe('gigCheck: spec §B F3b loss zone', () => {
  test('taking a gig of $7,064 to $10,233 loses money if you do nothing', () => {
    const { lossZone } = gigCheck(DANI, DANI_GIG, DANI_AS_OF);
    expectDollars(lossZone?.from ?? NaN, 7_064, 5);
    expectDollars(lossZone?.to ?? NaN, 10_233, 5);
  });

  test('an $8,000 gig, doing nothing, nets -$1,668', () => {
    const result = gigCheck(DANI, { amount: 8_000, canBillInJanuary: false }, DANI_AS_OF);
    expectDollars(optionOf(result, 'take_do_nothing').netFromGig, -1_668);
  });

  test('a household already over the cliff has no loss zone', () => {
    const over = { ...DANI, marketplace: { ...DANI.marketplace, incomeEstimate: 105_000 } };
    const overIncome = {
      ...over,
      adults: [
        { ...over.adults[0], selfEmploymentProfit: { ytd: 200_000, expectedRest: 0 } },
        over.adults[1],
      ] as typeof DANI.adults,
    };
    expect(gigCheck(overIncome, DANI_GIG, DANI_AS_OF).lossZone).toBeNull();
  });
});

describe('gigCheck: spec §B F3c bill in January', () => {
  test('nets $8,966, keeps the $7,645 credit and tells the user to include it in 2027', () => {
    const result = gigCheck(DANI, CAN_BILL_IN_JANUARY, DANI_AS_OF);
    const january = optionOf(result, 'bill_in_january');
    expectDollars(january.netFromGig, 8_966);
    expectDollars(january.ptcKept, 7_645);
    expect(january.notes.join(' ')).toMatch(/2027 estimate/);
  });
});

test('gig.ts is server-only: the server entry exports it', () => {
  expect(server.gigCheck).toBe(gigCheck);
});
