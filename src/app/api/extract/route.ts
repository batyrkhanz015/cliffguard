import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { extractNotice } from '@/server/claude/extract';
import { ApiError } from '@/server/errors';
import { requireSameOrigin } from '@/server/origin';
import { limit } from '@/server/ratelimit';
import { clientIp, route } from '@/server/route';
import { getSid } from '@/server/session';
import { checkUpload, matchesUploadType, MAX_UPLOAD_REQUEST_BYTES, readBoundedBody } from '@/server/upload';

export const runtime = 'nodejs';
const SampleRequest = z.object({ sample: z.literal('dani_notice') }).strict();
const MANUAL_FALLBACK = "Couldn't read it. Enter the numbers below.";

/** Documents are held only in this request's memory; extraction never loads or saves a household. */
export const POST = route(async (request) => {
  try {
    requireSameOrigin(request, 'Upload your notice from this site.');
    const sid = await getSid();
    const limits = await Promise.all([
      limit('extractSession', sid, 3, 3600),
      limit('extractIp', clientIp(request, sid), 10, 86400),
    ]);
    const denied = limits.filter((result) => !result.ok);
    if (denied.length) {
      throw new ApiError('RATE_LIMITED', 429, 'Upload limit reached. Enter the numbers below or try again later.', {
        retryAfterSec: Math.max(...denied.map((result) => result.retryAfterSec)),
      });
    }
    const contentType = request.headers.get('content-type') ?? '';
    let file: { bytes: Uint8Array; type: string };
    if (contentType.split(';')[0].trim() === 'application/json') {
      const bytes = await readBoundedBody(request, 1024);
      let body: unknown;
      try { body = JSON.parse(new TextDecoder().decode(bytes)); }
      catch { throw new ApiError('VALIDATION', 400, 'Choose a notice or the sample notice.'); }
      if (!SampleRequest.safeParse(body).success) throw new ApiError('VALIDATION', 400, 'Choose a notice or the sample notice.');
      file = { bytes: await readFile(path.join(process.cwd(), 'public/samples/dani-eligibility-notice.pdf')), type: 'application/pdf' };
    } else if (contentType.startsWith('multipart/form-data;')) {
      const bytes = await readBoundedBody(request, MAX_UPLOAD_REQUEST_BYTES);
      let form: FormData;
      try { form = await new Response(bytes as Uint8Array<ArrayBuffer>, { headers: { 'content-type': contentType } }).formData(); }
      catch { throw new ApiError('VALIDATION', 400, 'Choose one notice to upload.'); }
      const entries = [...form.entries()];
      const upload = form.get('file');
      if (entries.length !== 2 || form.getAll('file').length !== 1 || form.getAll('docType').length !== 1 || form.get('docType') !== 'eligibility_notice' || !(upload instanceof File)) {
        throw new ApiError('VALIDATION', 400, 'Upload exactly one file and choose an eligibility notice.');
      }
      const checked = checkUpload(upload);
      if (!checked.ok) throw new ApiError(checked.code, checked.status, checked.code === 'FILE_TOO_LARGE' ? 'Choose one file of 5 MB or less.' : 'Choose a PDF, PNG, JPEG or WebP notice.');
      file = { bytes: new Uint8Array(await upload.arrayBuffer()), type: upload.type };
    } else {
      throw new ApiError('UNSUPPORTED_FILE_TYPE', 422, 'Choose a PDF, PNG, JPEG or WebP notice.');
    }
    if (!checkUpload({ size: file.bytes.byteLength, type: file.type }).ok || !matchesUploadType(file.bytes, file.type)) {
      throw new ApiError('UNSUPPORTED_FILE_TYPE', 422, 'This file does not match its format. Choose a PDF, PNG, JPEG or WebP notice.');
    }
    const result = await extractNotice(file, request.signal);
    if ('error' in result) throw new ApiError(result.error, result.error === 'NOT_RECOGNIZED' ? 422 : 503,
      result.error === 'NOT_RECOGNIZED' ? "This doesn't look like a Marketplace eligibility notice. Enter the numbers below." : MANUAL_FALLBACK);
    return Response.json({ extraction: result.extraction, warnings: result.warnings, confirmed: false }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // Multipart, filesystem and transport exceptions can contain untrusted data.
    throw new ApiError('CLAUDE_UNAVAILABLE', 503, MANUAL_FALLBACK);
  }
});
