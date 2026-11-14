import { z } from 'zod';

/** Browser-side JSON calls to our API routes, reading the spec §D error shape. */

const ApiIssueSchema = z.object({
  path: z.array(z.union([z.string(), z.number()])),
  message: z.string(),
});
const ApiErrorBodySchema = z.object({
  error: z.object({ code: z.string(), message: z.string(), issues: z.array(ApiIssueSchema).optional() }),
});

type ApiIssue = z.infer<typeof ApiIssueSchema>;
export type ApiFailure = {
  ok: false;
  /** 0 when the request never reached the server. */
  status: number;
  code: string;
  issues: ApiIssue[];
  retryAfterSec: number | null;
};
export type ApiResult = { ok: true; data: unknown } | ApiFailure;

function retryAfter(response: Response): number | null {
  const seconds = Number(response.headers.get('retry-after'));
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : null;
}

export async function sendJson(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, body?: unknown): Promise<ApiResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return { ok: false, status: 0, code: 'NETWORK', issues: [], retryAfterSec: null };
  }
  const payload: unknown = await response.json().catch(() => null);
  if (response.ok) return { ok: true, data: payload };

  const parsed = ApiErrorBodySchema.safeParse(payload);
  return {
    ok: false,
    status: response.status,
    code: parsed.success ? parsed.data.error.code : `HTTP_${response.status}`,
    issues: parsed.success ? (parsed.data.error.issues ?? []) : [],
    retryAfterSec: retryAfter(response),
  };
}
