import 'server-only';
import { cookies } from 'next/headers';
import { SID_COOKIE, isSid } from './sessionCookie';

/**
 * The anonymous session id. `src/proxy.ts` puts a valid `cg_sid` on every app request
 * before it reaches a route, so a missing one is a bug, not a new visitor.
 */
export async function getSid(): Promise<string> {
  const sid = (await cookies()).get(SID_COOKIE)?.value;
  if (!isSid(sid)) throw new Error(`No ${SID_COOKIE} cookie: is src/proxy.ts matching this route?`);
  return sid;
}

/** Expires the session cookie; the proxy issues a fresh id on the next request. Route handlers only. */
export async function endSession(): Promise<void> {
  (await cookies()).delete(SID_COOKIE);
}
