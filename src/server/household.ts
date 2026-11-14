import 'server-only';
import { z } from 'zod';
import {
  AdultIdSchema,
  diagnose,
  HouseholdInputSchema,
  LeverIdSchema,
  type AlertCode,
  type Diagnosis,
  type HouseholdInput,
} from '@/engine';
import { gigCheck } from '@/engine/server';
import type { GigCheckView } from '@/lib/planView';
import { DANI, DANI_GIG } from '@/samples/dani';
import { ApiError } from './errors';
import { gigCheckView } from './redact';
import { store } from './store';

/** The session's saved state (spec §D), stored under `cg:hh:{sid}`. */

const RECORD_TTL_SEC = 400 * 24 * 60 * 60;
const MAX_CHECKINS = 24;
/** Largest gig the server checks; the engine's loss-zone search stops at the same size. */
const MAX_GIG = 1_000_000;

const Money = z.number().min(0);
const AmountsByAdult = z.partialRecord(AdultIdSchema, Money);

export const GigInputSchema = z.object({
  amount: z.number().positive().max(MAX_GIG),
  canBillInJanuary: z.boolean(),
});
export type GigInput = z.infer<typeof GigInputSchema>;

const ALERT_CODES = [
  'CROSSED_CLIFF',
  'BACK_UNDER_CLIFF',
  'APPROACHING_CLIFF',
  'REPAYMENT_UP',
  'REPORT_CHANGE',
  'DEADLINE_SOON',
] as const satisfies readonly AlertCode[];

const CheckinSchema = z.object({
  id: z.string().min(1),
  asOf: z.iso.date(),
  received: z.object({
    seByAdult: AmountsByAdult,
    wagesByAdult: AmountsByAdult,
    capitalGains: z.number(),
    interestOrDividends: Money,
  }),
  expectedRestAfter: z.object({ seByAdult: AmountsByAdult, wagesByAdult: AmountsByAdult }),
  result: z.object({
    magi: z.number(),
    headroom: z.number(),
    repayment: Money,
    alerts: z.array(z.enum(ALERT_CODES)),
  }),
});

export const LeverProgressSchema = z.object({
  done: z.boolean(),
  doneAt: z.iso.datetime().optional(),
  /** Indexes into the lever's proof list. */
  proofsChecked: z.array(z.number().int().min(0)),
});

const EntitlementSchema = z.object({
  product: z.enum(['rescue', 'year']),
  stripeSessionId: z.string().min(1),
  paidAt: z.iso.datetime(),
  /** The last day of access, inclusive, as an ISO date. */
  validUntil: z.iso.date(),
});

const HouseholdSourceSchema = z.enum(['sample_dani', 'manual', 'upload']);
type HouseholdSource = z.infer<typeof HouseholdSourceSchema>;

export const HouseholdRecordSchema = z.object({
  version: z.literal(1),
  sid: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  source: HouseholdSourceSchema,
  input: HouseholdInputSchema,
  lastGig: GigInputSchema.nullable(),
  planProgress: z.partialRecord(LeverIdSchema, LeverProgressSchema),
  /** Newest last. */
  checkins: z.array(CheckinSchema).max(MAX_CHECKINS),
  entitlement: EntitlementSchema.nullable(),
});
export type HouseholdRecord = z.infer<typeof HouseholdRecordSchema>;

const keyFor = (sid: string): string => `cg:hh:${sid}`;

/**
 * The session's household, or null when there is none. A record that is missing, from an old
 * version or unreadable also counts as none (Review Focus 3): the user starts over, never a 500.
 */
export async function loadHousehold(sid: string): Promise<HouseholdRecord | null> {
  const parsed = HouseholdRecordSchema.safeParse(await store.get(keyFor(sid)));
  return parsed.success && parsed.data.sid === sid ? parsed.data : null;
}

/** `loadHousehold`, answering NOT_FOUND (404) when the session has no household yet. */
export async function requireHousehold(sid: string): Promise<HouseholdRecord> {
  const household = await loadHousehold(sid);
  if (household === null) throw new ApiError('NOT_FOUND', 404, 'Enter your numbers or try the sample first.');
  return household;
}

/** Saves for 400 days from now. Validates first, so we never store a record we couldn't load. */
export async function saveHousehold(record: HouseholdRecord): Promise<void> {
  await store.set(keyFor(record.sid), HouseholdRecordSchema.parse(record), RECORD_TTL_SEC);
}

export async function deleteHousehold(sid: string): Promise<void> {
  await store.del(keyFor(sid));
}

/** Paid and still within the purchase's last day. */
export const isEntitled = (record: HouseholdRecord, asOf: string): boolean =>
  record.entitlement !== null && asOf <= record.entitlement.validUntil;

type InputChange = { sid: string; source: HouseholdSource; input: HouseholdInput; now: string };

/**
 * The record after the user enters (or loads) a household's numbers. The session keeps its
 * purchase and its saved preferences (keep my cash, lever order) over the input's defaults.
 * The gig, plan progress and check-ins belong to one household: they carry over while the
 * source stays the same and start fresh when it changes, e.g. from the sample to the user's own.
 */
export function replaceInput(existing: HouseholdRecord | null, change: InputChange): HouseholdRecord {
  const { sid, source, input, now } = change;
  if (existing === null) {
    return {
      version: 1,
      sid,
      createdAt: now,
      updatedAt: now,
      source,
      input,
      lastGig: null,
      planProgress: {},
      checkins: [],
      entitlement: null,
    };
  }
  return {
    ...existing,
    updatedAt: now,
    source,
    input: { ...input, preferences: existing.input.preferences },
    ...(existing.source === source ? {} : { lastGig: null, planProgress: {}, checkins: [] }),
  };
}

export type SampleResult = { household: HouseholdRecord; diagnosis: Diagnosis; gig: GigCheckView };

/**
 * Loads Dani's sample household and gig offer into the session, then computes her year and
 * the gig check live. The plan amounts stay locked unless the session has paid.
 */
export async function buildSample(sid: string, asOf: string): Promise<SampleResult> {
  const household: HouseholdRecord = {
    ...replaceInput(await loadHousehold(sid), {
      sid,
      source: 'sample_dani',
      input: DANI,
      now: new Date().toISOString(),
    }),
    lastGig: DANI_GIG,
  };
  const diagnosis = diagnose(household.input, { gig: null, asOf });
  const gig = gigCheckView(gigCheck(household.input, DANI_GIG, asOf), isEntitled(household, asOf));
  await saveHousehold(household);
  return { household, diagnosis, gig };
}
