/** Chart colours, validated for contrast on white. Red is only for the cliff and the loss zone. */
export const CHART = {
  plan: '#00A352',
  doNothing: '#5B42DC',
  scenario: '#4F31BA',
  cliff: '#FB2C36',
  grid: '#E5E7EB',
  baseline: '#9CA3AF',
  tick: '#6B7280',
  ink: '#0C0C0C',
  surface: '#FFFFFF',
} as const;

/** The drawing area inside the SVG, in pixels. */
export type Plot = { left: number; right: number; top: number; bottom: number };
