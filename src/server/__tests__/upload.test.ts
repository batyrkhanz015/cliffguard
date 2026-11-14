import { describe, expect, it } from 'vitest';
import { checkUpload } from '../upload';

describe('upload validation', () => {
  it('rejects more than 5 MiB before accepting the media type', () => {
    expect(checkUpload({ size: 5 * 1024 * 1024 + 1, type: 'application/pdf' })).toEqual({ ok: false, code: 'FILE_TOO_LARGE', status: 413 });
  });
  it('rejects HTML and empty files', () => {
    expect(checkUpload({ size: 100, type: 'text/html' })).toEqual({ ok: false, code: 'UNSUPPORTED_FILE_TYPE', status: 422 });
    expect(checkUpload({ size: 0, type: 'application/pdf' }).ok).toBe(false);
  });
  it.each(['application/pdf', 'image/png', 'image/jpeg', 'image/webp'])('accepts %s at the size boundary', (type) => {
    expect(checkUpload({ size: 5 * 1024 * 1024, type })).toEqual({ ok: true });
  });
});
