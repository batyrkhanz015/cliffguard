/** Public engine API. Pure and client-safe. The test-only TY2025_ENHANCED rule set stays internal. */
export * from './types';
export { TY2026 } from './rules/ty2026';
export { cliffAmount, fplPercent, householdIncome, povertyLine } from './fpl';
export { applicableFigure, requiredContribution } from './applicable';
export { computeIncome, type IncomeBreakdown } from './income';
export { deriveSlcsp, type Slcsp } from './slcsp';
export { reconcile, type ReconcileInput, type Reconciliation } from './reconcile';
export { diagnose, type Diagnosis, type Zone } from './diagnose';
export { computeAlerts, type CheckIn } from './alerts';
export { upcomingDeadlines } from './deadlines';
export { estimate2027, type Estimate2027 } from './estimate2027';
export { templateExplanation } from './explainTemplate';
