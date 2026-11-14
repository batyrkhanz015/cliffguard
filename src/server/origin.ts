import 'server-only';
import { ApiError } from './errors';

function loopback(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '[::1]' || /^127(?:\.\d{1,3}){3}$/.test(hostname);
}

/** NextURL rewrites loopback addresses to localhost. Only dev may reconcile against actual Host. */
export function requireSameOrigin(request: Request, message: string): void {
  const origin = request.headers.get('origin');
  if (origin === null) return; // Preserve non-browser clients' existing behavior.
  const target = new URL(request.url);
  const host = request.headers.get('host');
  let accepted = origin === target.origin;
  if (process.env.NODE_ENV === 'development' && loopback(target.hostname) && host !== null) {
    try {
      const source = new URL(origin);
      accepted = source.origin === origin
        && loopback(source.hostname)
        && source.protocol === target.protocol
        && source.port === target.port
        && source.host === host.toLowerCase();
    } catch { accepted = false; }
  }
  if (!accepted) throw new ApiError('VALIDATION', 400, message);
}
