import { describe, expect, it } from 'vitest';
import { allowedNumbers, ungroundedNumbers } from '../ai/grounding';

describe('number grounding', () => {
  const allowed = allowedNumbers({ dollars: 122036, rate: 0.0996, deadline: '2027-04-15', rounded: 1697 });
  it.each(['$122,036', '9.96%', 'April 15, 2027', '$1,697', '1697', '$1,697.00'])('accepts %s', (text) => {
    expect(ungroundedNumbers(text, allowed)).toEqual([]);
  });
  it('rejects a fabricated figure and an off-by-one dollar amount', () => {
    expect(ungroundedNumbers('$12,345', allowed)).toEqual([12345]);
    expect(ungroundedNumbers('$1,698', allowed)).toEqual([1698]);
  });
  it('accepts the whole-dollar rounding of an allowed decimal', () => {
    expect(ungroundedNumbers('$122,036', allowedNumbers({ agi: 122035.73 }))).toEqual([]);
  });
  it('accepts percent forms of fractional rates only', () => {
    expect(ungroundedNumbers('22%', allowedNumbers({ rate: 0.22 }))).toEqual([]);
    expect(ungroundedNumbers('2,200', allowedNumbers({ dollars: 22 }))).toEqual([2200]);
  });
  it('returns invented figures', () => expect(ungroundedNumbers('$4,321', allowed)).toEqual([4321]));
  it('supports nested sources, question amounts, signed figures and counting', () => {
    expect(ungroundedNumbers('-$200, 12 months, $600', allowedNumbers([{ n: -200.4 }], 'What about $600?'))).toEqual([]);
  });
});
