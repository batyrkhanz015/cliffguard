import { describe, expect, it } from 'vitest';
import { moveKey, revisionKey } from '@/lib/keys';

describe('moveKey', () => {
  it('differs for two moves on the same lever', () => {
    expect(moveKey({ leverId: 'traditionalIra', adultId: 'a' })).not.toBe(moveKey({ leverId: 'traditionalIra', adultId: 'b' }));
  });

  it('falls back to household for household-level moves', () => {
    expect(moveKey({ leverId: 'hsa' })).toBe('hsa-household');
  });
});

describe('revisionKey', () => {
  it('differs between siblings that share a revision', () => {
    expect(revisionKey('explain', 4)).not.toBe(revisionKey('progress', 4));
  });
});
