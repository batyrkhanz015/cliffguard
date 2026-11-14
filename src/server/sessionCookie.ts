import { z } from 'zod';

/**
 * The anonymous session cookie (spec §D). Shared by `src/proxy.ts`, which sets it, and
 * `session.ts`, which reads it; kept free of `next/headers` so the proxy can import it.
 */
export const SID_COOKIE = 'cg_sid';

const MAX_AGE_SEC = 400 * 24 * 60 * 60;

export const SID_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: MAX_AGE_SEC,
} as const;

const SidSchema = z.uuid();

/** A session id we issued: a UUID, so a tampered cookie can't pick odd store keys. */
export const isSid = (value: string | undefined): value is string => SidSchema.safeParse(value).success;
