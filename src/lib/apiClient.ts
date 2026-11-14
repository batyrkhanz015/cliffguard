import type { Diagnosis, HouseholdInput, LeverId } from '@/engine';
import { sendJson, type ApiFailure } from './api';
import type { GigCheckView, LeverRow, PlanView } from './planView';

/**
 * Typed browser calls to our own API routes. The response types mirror what the routes in
 * `src/app/api` send (spec §D); the data comes from our server, not from a third party.
 */

export type GigOffer = { amount: number; canBillInJanuary: boolean };

export type HouseholdResponse = {
  household: { input: HouseholdInput; lastGig: GigOffer | null } | null;
  diagnosis: Diagnosis | null;
};
export type PlanResponse = { plan: PlanView; entitled: boolean; levers: LeverRow[] };
export type PlanRequest = { gig: GigOffer | null; keepMyCash: boolean; leverOrder: LeverId[] };

export type Loaded<T> = { ok: true; data: T } | ApiFailure;

async function call<T>(method: 'GET' | 'POST', url: string, body?: unknown, notify = true): Promise<Loaded<T>> {
  const result = await sendJson(method, url, body, { notify });
  return result.ok ? { ok: true, data: result.data as T } : result;
}

export const fetchHousehold = () => call<HouseholdResponse>('GET', '/api/household');
/** `notify: false` skips the plan-changed event, for callers that emit one themselves after a group of writes. */
export const checkGig = (offer: GigOffer, options: { notify?: boolean } = {}) =>
  call<GigCheckView>('POST', '/api/gig-check', offer, options.notify);
export const fetchPlan = (request: PlanRequest, options: { notify?: boolean } = {}) =>
  call<PlanResponse>('POST', '/api/plan', request, options.notify);

/** The API codes that mean the check form still needs the benchmark premium (step 2). */
export const NEEDS_BENCHMARK = new Set(['SLCSP_REQUIRED', 'SLCSP_DERIVATION_UNRELIABLE', 'ESTIMATE_OVER_CLIFF_WITH_APTC']);
