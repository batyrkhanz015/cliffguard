import 'server-only';

/**
 * Server-only engine API: the optimizer, lever copy and tax estimate. Plan amounts and how-to never
 * ship to the browser; client code imports the pure engine from `@/engine` instead.
 */
export { optimize, SAFETY_BUFFER, COSTLY_MULTIPLE } from './optimizer';
export {
  LEVER_COPY,
  LEVER_TERMS,
  isEligible,
  capacity,
  planState,
  leverDeadline,
  type Eligibility,
  type LeverCopy,
  type LeverSlot,
  type PlanState,
} from './levers';
export { federalTax, incomeTaxSaved, marginalRate, taxableIncome } from './tax';
