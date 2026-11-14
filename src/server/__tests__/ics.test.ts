import { describe, expect, it } from 'vitest';
import { buildIcs } from '../ics';
describe('calendar export', () => {
  it('has rule deadlines, both alarms, twelve monthly events and CRLF lines', () => {
    const value = buildIcs('2026-11-15', 'https://cliffguard.example');
    expect(value).toContain('BEGIN:VCALENDAR\r\n');
    for (const date of ['20261215', '20261231', '20270115', '20270131', '20270415']) expect(value).toContain(`DTSTART;VALUE=DATE:${date}`);
    expect(value).toContain('TRIGGER:-P7D'); expect(value).toContain('TRIGGER:-P1D');
    expect(value).toContain('RRULE:FREQ=MONTHLY;COUNT=12');
    expect(value.replaceAll('\r\n', '')).not.toMatch(/[\r\n]/);
  });
});

  it('folds UTF-8 lines at 75 bytes and uses all-day exclusive end dates', () => {
    const value = buildIcs('2026-11-15', 'https://cliffguard.example');
    expect(value).toContain('\r\n ');
    for (const line of value.split('\r\n')) expect(Buffer.byteLength(line)).toBeLessThanOrEqual(75);
    expect(value).toContain('DTEND;VALUE=DATE:20270101');
    expect(value).toContain('DTSTART;VALUE=DATE:20261201');
    expect(value.replaceAll('\r\n ', '')).toContain('buy for the business or delay a stock sale');
    expect(value).toContain('a 2026 HSA\\, IRA or SEP-IRA\\, and to file');
  });
  it('uses a safe deep-link and rejects URL injection or unsafe schemes', () => {
    for (const url of ['javascript:alert(1)', 'file:///tmp/x', 'https://name:secret@example.com', 'https://example.com\r\nBEGIN:EVIL']) expect(() => buildIcs('2026-11-15', url)).toThrow();
    const unfolded = buildIcs('2026-12-01', 'https://example.com/a,b;evil?x=one').replaceAll('\r\n ', '');
    expect(unfolded).toContain('URL:https://example.com/checkin\r\n');
    expect(unfolded).not.toContain('evil');
    expect(unfolded).toContain('DTSTART;VALUE=DATE:20261201');
  });
  it('keeps plan deadlines after year-end and begins monthly reminders next month', () => {
    const value = buildIcs('2027-01-16', 'http://localhost:3000');
    expect(value).toContain('DTSTART;VALUE=DATE:20261231');
    expect(value).toContain('DTSTART;VALUE=DATE:20270201');
    expect(value.match(/BEGIN:VEVENT/g)).toHaveLength(7);
    expect(value.match(/BEGIN:VALARM/g)).toHaveLength(14);
  });
