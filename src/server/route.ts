import 'server-only';
import type { z } from 'zod';
import { ApiError, errorResponse } from './errors';

type Handler = (request: Request) => Promise<Response>;

/** JSON bodies here are a few KB; anything far larger is refused before parsing. */
const MAX_BODY_CHARS = 32_000;

/** Wraps a route handler so anything it throws becomes the spec §D error response. */
export function route(handler: Handler): Handler {
  return async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

/** The JSON body parsed by `schema` (unknown keys stripped), or VALIDATION (400, 413). */
export async function readJson<Schema extends z.ZodType>(request: Request, schema: Schema): Promise<z.output<Schema>> {
  const text = await request.text();
  if (text.length > MAX_BODY_CHARS) throw new ApiError('VALIDATION', 413, 'The request body is too large.');
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ApiError('VALIDATION', 400, 'The request body must be JSON.');
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError('VALIDATION', 400, 'Some fields are invalid.', { issues: parsed.error.issues });
  }
  return parsed.data;
}

/** The caller's IP for per-IP limits; on Vercel the first `x-forwarded-for` entry is the client. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}
