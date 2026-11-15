import 'server-only';
import { z } from 'zod';
import { TY2026, upcomingDeadlines } from '@/engine';

const escapeText = (value: string) =>
  value
    .replaceAll('\\', '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,');
/** RFC5545 folds by UTF-8 octets, including the continuation's initial space. */
function fold(line: string): string {
  const lines: string[] = [];
  let current = '';
  let bytes = 0;
  for (const char of line) {
    const size = Buffer.byteLength(char);
    if (bytes + size > 75) {
      lines.push(current);
      current = ' ';
      bytes = 1;
    }
    current += char;
    bytes += size;
  }
  lines.push(current);
  return lines.join('\r\n');
}
const compact = (date: string) => date.replaceAll('-', '');
const followingDay = (date: string) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

export function buildIcs(asOf: string, appUrl: string): string {
  z.iso.date().parse(asOf);
  const url = new URL(appUrl);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || /[\r\n]/.test(appUrl))
    throw new Error('Calendar URL must be a safe HTTP(S) URL.');
  const link = new URL('/checkin', url.origin).href;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CliffGuard//2026 deadlines//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  const event = (date: string, id: string, label: string, monthly = false) => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${id}@cliffguard`,
      `DTSTAMP:${compact(asOf)}T000000Z`,
      `DTSTART;VALUE=DATE:${compact(date)}`,
      `DTEND;VALUE=DATE:${compact(followingDay(date))}`,
      `SUMMARY:${escapeText(label)}`,
      `DESCRIPTION:${escapeText(`Review your 2026 coverage-year numbers and plan. ${link}`)}`,
      `URL:${link}`,
    );
    if (monthly) lines.push('RRULE:FREQ=MONTHLY;COUNT=12');
    for (const days of [7, 1])
      lines.push(
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeText(label)}`,
        `TRIGGER:-P${days}D`,
        'END:VALARM',
      );
    lines.push('END:VEVENT');
  };
  // Keep every published deadline, including past dates, when importing the 2026 plan calendar.
  const included = new Set([
    TY2026.dates.enrollForJan1,
    TY2026.dates.yearEnd,
    TY2026.dates.oeEnd,
    TY2026.dates.q4Estimated,
    TY2026.dates.form1095aBy,
    TY2026.dates.contributionDeadline,
  ]);
  for (const deadline of upcomingDeadlines('2026-01-01'))
    if (included.has(deadline.date))
      event(
        deadline.date,
        `deadline-${compact(deadline.date)}-${deadline.label.startsWith('Fourth') ? 'tax' : 'plan'}`,
        deadline.label,
      );
  const first = new Date(`${asOf.slice(0, 7)}-01T00:00:00Z`);
  if (asOf.slice(8) !== '01') first.setUTCMonth(first.getUTCMonth() + 1);
  event(
    first.toISOString().slice(0, 10),
    `monthly-${compact(first.toISOString().slice(0, 10))}`,
    'CliffGuard monthly check-in',
    true,
  );
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
