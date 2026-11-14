import { describe, expect, it } from 'vitest';
import { allowedNumbers, ungroundedNumbers } from '../claude/grounding';

describe('number grounding', () => {
  const allowed = allowedNumbers({ dollars: 122036, rate: 0.0996, deadline: '2027-04-15', rounded: 1697 });
  it.each(['$122,036', '9.96%', 'April 15, 2027', '$1,698'])('accepts %s', (text) => {
    expect(ungroundedNumbers(text, allowed)).toEqual([]);
  });
  it('returns invented figures', () => expect(ungroundedNumbers('$4,321', allowed)).toEqual([4321]));
  it('supports nested sources, question amounts, signed figures and counting', () => {
    expect(ungroundedNumbers('-$200, 12 months, $600', allowedNumbers([{ n: -200.4 }], 'What about $600?'))).toEqual([]);
  });
});
