import 'server-only';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from '@/lib/uploadLimit';
import { ApiError } from './errors';

// Allows multipart headers/fields while bounding the stream before formData() allocates it.
export const MAX_UPLOAD_REQUEST_BYTES = MAX_UPLOAD_BYTES + 16 * 1024;
export const UPLOAD_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'] as const;
export type UploadType = (typeof UPLOAD_TYPES)[number];

type UploadCheck = { ok: true } | { ok: false; code: 'FILE_TOO_LARGE' | 'UNSUPPORTED_FILE_TYPE'; status: 413 | 422 };
export function checkUpload(file: { size: number; type: string }): UploadCheck {
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, code: 'FILE_TOO_LARGE', status: 413 };
  if (file.size <= 0 || !Number.isFinite(file.size) || !UPLOAD_TYPES.some((type) => type === file.type)) {
    return { ok: false, code: 'UNSUPPORTED_FILE_TYPE', status: 422 };
  }
  return { ok: true };
}

/** Basic byte signatures reject mislabeled HTML/other types before they reach an AI provider. */
export function matchesUploadType(bytes: Uint8Array, type: string): boolean {
  const starts = (...signature: number[]) => signature.every((value, index) => bytes[index] === value);
  if (type === 'application/pdf') return starts(0x25, 0x50, 0x44, 0x46, 0x2d);
  if (type === 'image/png') return starts(137, 80, 78, 71, 13, 10, 26, 10);
  if (type === 'image/jpeg') return starts(255, 216, 255);
  if (type === 'image/webp') return starts(82, 73, 70, 70) && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80;
  return false;
}

/** Read at most `maximum` bytes, including when Content-Length is absent or dishonest. */
export async function readBoundedBody(request: Request, maximum: number): Promise<Uint8Array> {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maximum) throw new ApiError('FILE_TOO_LARGE', 413, `Choose one file of ${MAX_UPLOAD_MB} MB or less.`);
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError('VALIDATION', 400, 'Choose a notice to upload.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      if (request.signal.aborted) throw new ApiError('AI_UNAVAILABLE', 503, 'Reading cancelled. Enter the numbers below.');
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) {
        await reader.cancel();
        throw new ApiError('FILE_TOO_LARGE', 413, `Choose one file of ${MAX_UPLOAD_MB} MB or less.`);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}
