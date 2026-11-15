import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import { POST } from '@/app/api/extract/route';
import { MAX_UPLOAD_BYTES } from '@/lib/uploadLimit';
import { extractNotice } from '../claude/extract';
import { limit } from '../ratelimit';
import { store } from '../store';
import { NOTICE } from '@/test/noticeFixture';

vi.mock('../session', () => ({ getSid: async () => 'upload-test-sid' }));
vi.mock('../ratelimit', () => ({ limit: vi.fn(async () => ({ ok: true, retryAfterSec: 0 })) }));
vi.mock('../claude/extract', () => ({ extractNotice: vi.fn() }));
function multipart(files = 1, type = 'application/pdf', data = '%PDF-1.7\n', docType = 'eligibility_notice') {
  const body = new FormData(); body.set('docType', docType);
  for (let i = 0; i < files; i++) body.append('file', new File([data], 'notice.pdf', { type }));
  return new Request('http://localhost/api/extract', { method: 'POST', body, headers: { 'x-forwarded-for': '192.0.2.1' } });
}
function sample(body: unknown = { sample: 'dani_notice' }) {
  return new Request('http://localhost/api/extract', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
}
beforeEach(() => {
  vi.mocked(limit).mockResolvedValue({ ok: true, retryAfterSec: 0 });
  vi.mocked(extractNotice).mockResolvedValue({ extraction: NOTICE, warnings: ['Review the notice'] });
});
afterEach(() => vi.restoreAllMocks());

describe('extraction route', () => {
  it('applies both exact limits, returns unconfirmed values/no-store and never writes data', async () => {
    const save = vi.spyOn(store, 'set');
    const response = await POST(multipart());
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toMatchObject({ extraction: { incomeEstimate: 105000 }, confirmed: false });
    expect(limit).toHaveBeenCalledWith('extractSession', 'upload-test-sid', 3, 3600);
    expect(limit).toHaveBeenCalledWith('extractIp', '192.0.2.1', 10, 86400);
    expect(save).not.toHaveBeenCalled();
  });
  it.each([0, 1])('enforces rate rule %i independently with Retry-After', async (rule) => {
    vi.mocked(limit).mockResolvedValueOnce({ ok: rule !== 0, retryAfterSec: 60 }).mockResolvedValueOnce({ ok: rule !== 1, retryAfterSec: 90 });
    const response = await POST(multipart());
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe(rule === 0 ? '60' : '90');
    expect(extractNotice).not.toHaveBeenCalled();
  });
  it('passes the actual bundled PDF through the identical extractor', async () => {
    expect((await POST(sample())).status).toBe(200);
    const [file] = vi.mocked(extractNotice).mock.calls[0];
    const pdf = await readFile('public/samples/dani-eligibility-notice.pdf');
    expect(Buffer.from(file.bytes)).toEqual(pdf);
    expect(file.type).toBe('application/pdf');
  });
  it('rejects extra, missing and multiple files, wrong docType, wrong sample and mislabeled bytes', async () => {
    for (const request of [multipart(0), multipart(2), multipart(1, 'application/pdf', '%PDF-1.7', 'invoice'), multipart(1, 'application/pdf', '<html>'), multipart(1, 'text/html'), sample({ sample: 'fake' }), sample({ sample: 'dani_notice', file: 'injected' })]) {
      expect((await POST(request)).status).toBeGreaterThanOrEqual(400);
    }
    const form = new FormData(); form.set('file', new File(['%PDF-'], 'notice.pdf', { type: 'application/pdf' })); form.set('docType', 'eligibility_notice'); form.set('extra', 'bad');
    expect((await POST(new Request('http://localhost/api/extract', { method: 'POST', body: form }))).status).toBe(400);
    expect(extractNotice).not.toHaveBeenCalled();
  });
  it('rejects a file over 4 MiB and bounds a body without Content-Length', async () => {
    expect((await POST(multipart(1, 'application/pdf', '%PDF-' + 'x'.repeat(MAX_UPLOAD_BYTES)))).status).toBe(413);
    const request = new Request('http://localhost/api/extract', { method: 'POST', headers: { 'content-type': 'application/json' }, body: 'x'.repeat(1025) });
    expect(request.headers.has('content-length')).toBe(false);
    expect((await POST(request)).status).toBe(413);
    expect(extractNotice).not.toHaveBeenCalled();
  });
  it.each(['NOT_RECOGNIZED', 'CLAUDE_UNAVAILABLE'] as const)('leaves manual entry available for %s', async (error) => {
    vi.mocked(extractNotice).mockResolvedValue({ error });
    const response = await POST(multipart());
    expect(response.status).toBe(error === 'NOT_RECOGNIZED' ? 422 : 503);
    expect((await response.json()).error.message).toContain('Enter the numbers below');
  });
  it('never logs unexpected parser/provider exceptions or returns raw content', async () => {
    const log = vi.spyOn(console, 'error');
    vi.mocked(extractNotice).mockRejectedValue(new Error('secret raw document'));
    const response = await POST(multipart());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('secret');
    expect(log).not.toHaveBeenCalled();
  });
});
