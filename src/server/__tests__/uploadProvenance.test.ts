import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PUT } from '@/app/api/household/route';
import { loadHousehold } from '../household';
import { DANI } from '@/samples/dani';
const identity = vi.hoisted(() => ({ sid: '' }));
vi.mock('../session', () => ({ getSid: async () => identity.sid }));
vi.mock('../ratelimit', () => ({ enforceLimit: vi.fn() }));
beforeEach(() => { identity.sid = crypto.randomUUID(); });
afterEach(() => vi.restoreAllMocks());
function save(source?: string, body: unknown = DANI) {
  return PUT(new Request('http://localhost/api/household', { method: 'PUT', headers: { 'content-type': 'application/json', ...(source ? { 'x-cliffguard-input-source': source } : {}) }, body: JSON.stringify(body) }));
}
describe('final validated upload provenance', () => {
  it.each([undefined, 'manual', 'sample_dani', 'anything'])('keeps backward-compatible manual source for %s', async (source) => {
    expect((await save(source)).status).toBe(200);
    expect((await loadHousehold(identity.sid))?.source).toBe('manual');
  });
  it('records upload source only at a successful final save', async () => {
    expect(await loadHousehold(identity.sid)).toBeNull();
    expect((await save('upload', { state: 'TX' })).status).toBe(400);
    expect(await loadHousehold(identity.sid)).toBeNull();
    expect((await save('upload')).status).toBe(200);
    expect((await loadHousehold(identity.sid))?.source).toBe('upload');
  });
});
