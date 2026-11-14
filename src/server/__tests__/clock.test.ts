import { describe, expect, it } from 'vitest';
import { todayAsOf } from '../clock';

describe('todayAsOf', () => {
  it("is today's date in New York as YYYY-MM-DD", () => {
    expect(todayAsOf(new Date('2026-11-14T15:00:00Z'))).toBe('2026-11-14');
  });

  it('is still the evening before in New York just after midnight UTC', () => {
    expect(todayAsOf(new Date('2026-11-15T03:30:00Z'))).toBe('2026-11-14');
  });
});
