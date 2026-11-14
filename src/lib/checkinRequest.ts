import { z } from 'zod';
import { AdultIdSchema } from '@/engine/types';

const Money = z.number().min(0).max(1_000_000_000);
const ByAdult = z.partialRecord(AdultIdSchema, Money);
/** Shared with persisted browser retries; every request is still validated by the server. */
export const CheckinBodySchema = z.strictObject({
  requestId: z.string().regex(/^[A-Za-z0-9_-]{8,100}$/).optional(),
  baselineVersion: z.iso.datetime().optional(),
  received: z.strictObject({
    seByAdult: ByAdult, wagesByAdult: ByAdult,
    capitalGains: z.number().min(-1_000_000_000).max(1_000_000_000),
    interestOrDividends: Money,
  }),
  expectedRestAfter: z.strictObject({ seByAdult: ByAdult, wagesByAdult: ByAdult }).optional(),
});
export type CheckinBody = z.infer<typeof CheckinBodySchema>;
