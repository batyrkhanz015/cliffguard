import type { FplTable, RuleSet } from '../types';
import { TY2026 } from './ty2026';

/**
 * Test-only: 2025 enhanced-subsidy rules (spec §A.2), used to reproduce the KFF and Morkel
 * fixtures. Not exported from the engine index. Only the PTC keys differ from TY2026.
 */

/** 2024 HHS poverty guidelines (used for 2025 coverage). */
export const FPL_2024: FplTable = {
  contiguous: { base: 15_060, perAdditional: 5_380 },
  // Fixtures F5–F7 are 48-state households; 2024 AK/HI lines are not modelled in this test-only set.
  alaska: { base: 15_060, perAdditional: 5_380 },
  hawaii: { base: 15_060, perAdditional: 5_380 },
};

export const TY2025_ENHANCED: RuleSet = {
  ...TY2026,
  id: 'ty2025-enhanced-test',
  taxYear: 2025,
  fpl: FPL_2024,
  cliffMultiple: null,
  aboveCliffRate: 0.085,
  applicableBands: [
    { fromPct: 0, toPct: 150, startBp: 0, endBp: 0 },
    { fromPct: 150, toPct: 200, startBp: 0, endBp: 200 },
    { fromPct: 200, toPct: 250, startBp: 200, endBp: 400 },
    { fromPct: 250, toPct: 300, startBp: 400, endBp: 600 },
    { fromPct: 300, toPct: 400, startBp: 600, endBp: 850 },
  ],
  repaymentCaps: [
    { belowPct: 200, single: 375, other: 750 },
    { belowPct: 300, single: 975, other: 1_950 },
    { belowPct: 400, single: 1_625, other: 3_250 },
  ],
};
