import { describe, expect, it } from 'vitest';
import { backendFor } from '../store';

describe('backendFor', () => {
  it('uses Upstash with only the Vercel integration KV_REST_API pair', () => {
    const backend = backendFor({ KV_REST_API_URL: 'https://kv.example.test', KV_REST_API_TOKEN: 'token' });
    expect(backend.kind).toBe('upstash');
  });

  it('does not mix half pairs from the two naming schemes', () => {
    const backend = backendFor({
      UPSTASH_REDIS_REST_URL: 'https://upstash.example.test',
      KV_REST_API_TOKEN: 'token',
      NODE_ENV: 'production',
    });
    expect(backend.kind).toBe('unavailable');
  });
});
