/** Public, non-secret household identity; never derived from session or entitlement IDs. */
export function householdScope(record: { createdAt: string; source: 'sample_dani' | 'manual' | 'upload'; checkinIdentity?: string }): string {
  // Older T6 records stay readable and stable until their household is replaced.
  return record.checkinIdentity ?? `${record.createdAt}:${record.source === 'sample_dani' ? 'sample' : 'personal'}`;
}
