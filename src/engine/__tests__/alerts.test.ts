import { describe, expect, test } from 'vitest';
import { DANI, DANI_AS_OF } from '@/samples/dani';
import { computeAlerts } from '../alerts';
import { upcomingDeadlines } from '../deadlines';
import { diagnose, type Diagnosis } from '../diagnose';
import { LEVER_TERMS } from '../levers';
import { TY2026 } from '../rules/ty2026';

const dani = (asOf: string, gig: number | null = null): Diagnosis =>
  diagnose(DANI, { gig: gig === null ? null : { amount: gig, canBillInJanuary: false }, asOf });
const codes = (alerts: ReturnType<typeof computeAlerts>) => alerts.map((a) => a.code);
const snapshot = (d: Diagnosis) => ({ magi: d.income.magi, headroom: d.headroom, repayment: d.repayment, zone: d.zone });

describe('computeAlerts', () => {
  const near = snapshot(dani(DANI_AS_OF));
  const over = dani(DANI_AS_OF, 12_000);

  test('near the cliff → over it gives CROSSED_CLIFF with the new repayment', () => {
    const alerts = computeAlerts(near, over, DANI_AS_OF);
    expect(codes(alerts)).toContain('CROSSED_CLIFF');
    expect(alerts.find((a) => a.code === 'CROSSED_CLIFF')?.message).toContain('$9,342');
  });

  test('over → under gives BACK_UNDER_CLIFF', () => {
    expect(codes(computeAlerts(snapshot(over), dani(DANI_AS_OF), DANI_AS_OF))).toContain('BACK_UNDER_CLIFF');
  });

  test('clear → near gives APPROACHING_CLIFF', () => {
    const clear = { ...near, zone: 'clear' as const };
    expect(codes(computeAlerts(clear, dani(DANI_AS_OF), DANI_AS_OF))).toContain('APPROACHING_CLIFF');
  });

  test('a repayment $300 higher gives REPAYMENT_UP; $200 does not', () => {
    const next = dani(DANI_AS_OF);
    expect(codes(computeAlerts({ ...near, repayment: next.repayment - 300 }, next, DANI_AS_OF))).toContain('REPAYMENT_UP');
    expect(codes(computeAlerts({ ...near, repayment: next.repayment - 200 }, next, DANI_AS_OF))).not.toContain('REPAYMENT_UP');
  });

  test('a recommended report change gives REPORT_CHANGE, even on the first check-in', () => {
    expect(codes(computeAlerts(null, dani(DANI_AS_OF), DANI_AS_OF))).toEqual(['REPORT_CHANGE']);
  });

  test('a deadline within 14 days gives DEADLINE_SOON naming it', () => {
    const alerts = computeAlerts(null, dani('2026-12-20'), '2026-12-20');
    expect(alerts.find((a) => a.code === 'DEADLINE_SOON')?.message).toContain('Dec 31, 2026');
  });
});

describe('upcomingDeadlines', () => {
  test('after Dec 15 it keeps Dec 31 and Apr 15 and drops the enrollment date', () => {
    const dates = upcomingDeadlines('2026-12-20').map((d) => d.date);
    expect(dates).not.toContain('2026-12-15');
    expect(dates).toContain('2026-12-31');
    expect(dates).toContain('2027-04-15');
  });

  test('a deadline on asOf itself is still upcoming, and the list is sorted', () => {
    const dates = upcomingDeadlines('2026-12-31').map((d) => d.date);
    expect(dates[0]).toBe('2026-12-31');
    expect(dates).toEqual([...dates].sort());
  });

  test('each deadline lists the levers that end on it, as the lever terms say', () => {
    for (const { date, levers } of upcomingDeadlines('2026-01-01')) {
      for (const lever of levers) {
        expect(TY2026.dates[LEVER_TERMS[lever].deadline]).toBe(date);
      }
    }
    const yearEnd = upcomingDeadlines('2026-11-14').find((d) => d.date === TY2026.dates.yearEnd);
    expect(yearEnd?.levers).toEqual(['invoiceTiming', 'businessPurchases', 'delayStockSale']);
  });
});
