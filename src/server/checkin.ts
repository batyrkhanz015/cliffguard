import 'server-only';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { HouseholdInputSchema, computeAlerts, diagnose } from '@/engine';
import { ApiError } from './errors';
import { isEntitled, type HouseholdRecord } from './household';

import { CheckinBodySchema, type CheckinBody } from '@/lib/checkinRequest';
export { CheckinBodySchema, type CheckinBody } from '@/lib/checkinRequest';
export type Checkin = HouseholdRecord['checkins'][number];

export function requireYear(record: HouseholdRecord, asOf: string): void {
  if (!isEntitled(record, asOf) || record.entitlement?.product !== 'year') {
    throw new ApiError('NOT_ENTITLED', 402, 'CliffGuard Year access is required for check-ins and calendar reminders.');
  }
}

/** Stable key order makes equivalent partial records identical for retry detection. */
export function checkinFingerprint(body: CheckinBody): string {
  const sorted = (values: Partial<Record<'a' | 'b', number>>) => ({
    ...(values.a === undefined ? {} : { a: values.a }), ...(values.b === undefined ? {} : { b: values.b }),
  });
  return createHash('sha256').update(JSON.stringify({
    received: { seByAdult: sorted(body.received.seByAdult), wagesByAdult: sorted(body.received.wagesByAdult), capitalGains: body.received.capitalGains, interestOrDividends: body.received.interestOrDividends },
    expectedRestAfter: body.expectedRestAfter ? { seByAdult: sorted(body.expectedRestAfter.seByAdult), wagesByAdult: sorted(body.expectedRestAfter.wagesByAdult) } : null,
  })).digest('hex');
}

/** Pure 2026 update. No gig scenario is added: received income belongs to the saved annual inputs. */
export function applyCheckin(record: HouseholdRecord, rawBody: CheckinBody, asOf: string) {
  const body = CheckinBodySchema.parse(rawBody);
  z.iso.date().parse(asOf);
  const fingerprint = checkinFingerprint(body);
  const lastId = record.checkins.at(-1)?.id ?? 'baseline';
  const derivedId = createHash('sha256').update(`${record.updatedAt}:${lastId}:${fingerprint}:${asOf}`).digest('hex');
  const id = body.requestId ?? `checkin_${derivedId}`;
  const existing = record.checkins.find(checkin => checkin.id === id);
  if (existing) {
    if (existing.requestFingerprint !== fingerprint) {
      throw new ApiError('VALIDATION', 400, 'This request ID was already used with different amounts.');
    }
    // The saved input snapshot reproduces the original response even after later check-ins.
    const input = existing.projectionInput ?? record.input;
    const diagnosis = diagnose(input, { gig: null, asOf: existing.asOf });
    const alerts = computeAlerts(existing.baseline ?? null, diagnosis, existing.asOf);
    return { record, checkin: existing, diagnosis, alerts, replayed: true };
  }
  if (body.baselineVersion && body.baselineVersion !== record.updatedAt) {
    throw new ApiError('VALIDATION', 400, 'Your saved numbers changed. Refresh this page before entering a new check-in.');
  }
  const active = new Set(record.input.adults.map(adult => adult.id));
  for (const amounts of [body.received.seByAdult, body.received.wagesByAdult, body.expectedRestAfter?.seByAdult ?? {}, body.expectedRestAfter?.wagesByAdult ?? {}]) {
    if (Object.keys(amounts).some(id => !active.has(id as 'a' | 'b'))) {
      throw new ApiError('VALIDATION', 400, 'A check-in adult is not in this household.');
    }
  }
  const nextInput = structuredClone(record.input);
  const expected: Checkin['expectedRestAfter'] = { seByAdult: {}, wagesByAdult: {} };
  for (const adult of nextInput.adults) {
    const se = body.received.seByAdult[adult.id] ?? 0;
    const wages = body.received.wagesByAdult[adult.id] ?? 0;
    adult.selfEmploymentProfit = {
      ytd: adult.selfEmploymentProfit.ytd + se,
      expectedRest: body.expectedRestAfter?.seByAdult[adult.id] ?? Math.max(0, adult.selfEmploymentProfit.expectedRest - se),
    };
    adult.wages = {
      ytd: adult.wages.ytd + wages,
      expectedRest: body.expectedRestAfter?.wagesByAdult[adult.id] ?? Math.max(0, adult.wages.expectedRest - wages),
    };
    expected.seByAdult[adult.id] = adult.selfEmploymentProfit.expectedRest;
    expected.wagesByAdult[adult.id] = adult.wages.expectedRest;
    const annualSe = adult.selfEmploymentProfit.ytd + adult.selfEmploymentProfit.expectedRest;
    const annualWages = adult.wages.ytd + adult.wages.expectedRest;
    if (annualSe > 1_000_000_000 || annualWages > 1_000_000_000) {
      throw new ApiError('VALIDATION', 400, 'Annual income exceeds the supported range.');
    }
  }
  // Investments are annual forecasts: add only previously uncounted taxable receipts, once.
  nextInput.investments.capitalGainsNet += body.received.capitalGains;
  nextInput.investments.taxableInterest += body.received.interestOrDividends;
  const annualInterest = nextInput.investments.taxableInterest + nextInput.investments.dividends;
  if (Math.abs(nextInput.investments.capitalGainsNet) > 1_000_000_000 || annualInterest > 1_000_000_000) {
    throw new ApiError('VALIDATION', 400, 'Annual investments exceed the supported range.');
  }
  const parsed = HouseholdInputSchema.safeParse(nextInput);
  if (!parsed.success) throw new ApiError('VALIDATION', 400, 'Updated household numbers are invalid.', { issues: parsed.error.issues });
  const before = diagnose(record.input, { gig: null, asOf });
  const diagnosis = diagnose(parsed.data, { gig: null, asOf });
  const baseline = { magi: before.income.magi, headroom: before.headroom, repayment: before.repayment, zone: before.zone };
  const alerts = computeAlerts(baseline, diagnosis, asOf);
  const checkin: Checkin = {
    id, asOf, received: body.received, expectedRestAfter: expected,
    result: { magi: diagnosis.income.magi, headroom: diagnosis.headroom, repayment: diagnosis.repayment, alerts: alerts.map(alert => alert.code) },
    requestFingerprint: fingerprint, baseline, projectionInput: parsed.data,
  };
  const checkins = [...record.checkins, checkin].slice(-24);
  return { record: { ...record, input: parsed.data, checkins }, checkin, diagnosis, alerts, replayed: false };
}

/** Monthly due state uses New York's caller-supplied date; the household always remains TY2026. */
export function checkinSchedule(asOf: string, lastCheckin?: string) {
  const month = asOf.slice(0, 7);
  const next = new Date(`${month}-01T00:00:00Z`);
  next.setUTCMonth(next.getUTCMonth() + 1);
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(new Date(`${asOf}T00:00:00Z`));
  return { due: lastCheckin?.slice(0, 7) !== month, monthLabel, nextDate: next.toISOString().slice(0, 10) };
}
