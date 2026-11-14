import 'server-only';
import { z } from 'zod';

/** One deletable envelope per session; a different full calculation hash replaces it. */
export const explanationCacheKey = (sid: string): string => `cg:explain:${sid}`;
export const ExplanationCacheSchema = z.strictObject({
  hash: z.string().regex(/^[a-f0-9]{64}$/),
  explanation: z.unknown(),
});
