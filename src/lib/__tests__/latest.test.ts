import { describe, expect, it } from 'vitest';
import { createLatestGate } from '../latest';

describe('createLatestGate', () => {
  it('treats only the newest request as latest, whatever order the responses arrive in', () => {
    const gate = createLatestGate();
    const tokens = [gate.begin(), gate.begin(), gate.begin()];

    const arrivalOrder = [2, 0, 1];
    const accepted = arrivalOrder.filter((index) => gate.isLatest(tokens[index]));

    expect(accepted).toEqual([2]);
  });

  it('keeps a lone request latest until another begins', () => {
    const gate = createLatestGate();
    const first = gate.begin();
    expect(gate.isLatest(first)).toBe(true);

    gate.begin();
    expect(gate.isLatest(first)).toBe(false);
  });

  it('gives each gate its own sequence', () => {
    const one = createLatestGate();
    const two = createLatestGate();
    const token = one.begin();
    two.begin();
    two.begin();

    expect(one.isLatest(token)).toBe(true);
  });
});
