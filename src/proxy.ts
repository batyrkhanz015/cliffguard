import { NextResponse, type NextRequest } from 'next/server';
import { isSid, SID_COOKIE, SID_COOKIE_OPTIONS } from '@/server/sessionCookie';

/**
 * Gives every visitor an anonymous session id (spec §D), with no sign-up. A new id is also put
 * on the request itself, so the page or route answering this first request already sees it.
 */
export function proxy(request: NextRequest) {
  if (isSid(request.cookies.get(SID_COOKIE)?.value)) return NextResponse.next();

  const sid = crypto.randomUUID();
  request.cookies.set(SID_COOKIE, sid);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(SID_COOKIE, sid, SID_COOKIE_OPTIONS);
  return response;
}

export const config = {
  // Everything but build assets and static images; `/api/calendar.ics` still gets a session.
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
