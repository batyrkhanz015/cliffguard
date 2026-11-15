import 'server-only';
import { EngineError, type EngineErrorCode } from '@/engine';
import { StoreUnavailableError } from './store';

/** Every error code an API route returns (spec §D error shape). */
export type ErrorCode =
  | EngineErrorCode
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'NOT_ENTITLED'
  | 'RATE_LIMITED'
  | 'PAYMENT_UNAVAILABLE'
  | 'AI_UNAVAILABLE'
  | 'NOT_RECOGNIZED'
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_FILE_TYPE'
  | 'STORE_UNAVAILABLE'
  | 'INTERNAL';

/** `{ error: { code, message, issues? } }` with the given HTTP status. */
export function apiError(code: ErrorCode, status: number, message: string, issues?: unknown): Response {
  return Response.json({ error: { code, message, ...(issues === undefined ? {} : { issues }) } }, { status });
}

/** Thrown inside a route handler to answer with an error; `route()` turns it into the response. */
export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly issues: unknown;
  readonly retryAfterSec: number | null;

  constructor(
    code: ErrorCode,
    status: number,
    message: string,
    extra: { issues?: unknown; retryAfterSec?: number } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.issues = extra.issues;
    this.retryAfterSec = extra.retryAfterSec ?? null;
  }
}

/**
 * The response for anything a route handler throws. Engine errors are the user's input (422);
 * storage outages are 503; both outages and anything unexpected are logged here and answered
 * without details.
 */
export function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    const response = apiError(error.code, error.status, error.message, error.issues);
    if (error.retryAfterSec !== null) response.headers.set('Retry-After', String(error.retryAfterSec));
    return response;
  }
  if (error instanceof EngineError) return apiError(error.code, 422, error.message);
  if (error instanceof StoreUnavailableError) {
    console.error('Storage unavailable', error);
    return apiError('STORE_UNAVAILABLE', 503, 'Saving is unavailable right now. Try again later.');
  }
  console.error('Unexpected API error', error);
  return apiError('INTERNAL', 500, 'Something went wrong on our side. Try again.');
}
