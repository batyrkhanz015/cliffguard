import { describe, expect, it } from 'vitest';
import { formatMoney, formatMoneyInput, moneyTextError, parseMoney, parseSignedMoney } from '../money';

describe('parseMoney', () => {
  it.each([
    ['$105,000', 105_000],
    ['105000', 105_000],
    ['105k', 105_000],
    ['105K', 105_000],
    ['10.5k', 10_500],
    ['105,000.50', 105_000.5],
    [' 7,294 ', 7_294],
    ['$ 778.50', 778.5],
    ['0', 0],
  ])('reads %j as %d', (text, expected) => {
    expect(parseMoney(text)).toBe(expected);
  });

  it.each(['-5', 'abc', '', '   ', '$', 'k', '1,2', '12,34,567', '1.2.3', '5 apples', '.5'])(
    'rejects %j',
    (text) => {
      expect(parseMoney(text)).toBeNull();
    },
  );
});

describe('parseSignedMoney', () => {
  it.each([
    ['-3,000', -3_000],
    ['−3,000', -3_000],
    ['($3,000)', -3_000],
    ['3,000', 3_000],
    ['-2.5k', -2_500],
  ])('reads %j as %d', (text, expected) => {
    expect(parseSignedMoney(text)).toBe(expected);
  });

  it.each(['-', '()', 'abc', '', '--5'])('rejects %j', (text) => {
    expect(parseSignedMoney(text)).toBeNull();
  });
});

describe('formatMoney', () => {
  it('formats whole dollars with a symbol and separators', () => {
    expect(formatMoney(122_036)).toBe('$122,036');
  });

  it('rounds to whole dollars by default', () => {
    expect(formatMoney(778.5)).toBe('$779');
  });

  it('shows cents on request', () => {
    expect(formatMoney(778.5, { cents: true })).toBe('$778.50');
  });

  it('puts the sign before the symbol', () => {
    expect(formatMoney(-1_668)).toBe('-$1,668');
  });
});

describe('formatMoneyInput', () => {
  it('formats whole amounts without a symbol', () => {
    expect(formatMoneyInput(105_000)).toBe('105,000');
  });

  it('keeps cents when there are any', () => {
    expect(formatMoneyInput(105_000.5)).toBe('105,000.50');
  });
});

describe('moneyTextError', () => {
  it('accepts blank and valid amounts', () => {
    expect(moneyTextError('')).toBeNull();
    expect(moneyTextError('105k')).toBeNull();
  });

  it('explains negative amounts', () => {
    expect(moneyTextError('-5')).toBe('Enter an amount of $0 or more.');
  });

  it('explains garbage', () => {
    expect(moneyTextError('abc')).toBe('Enter a dollar amount, like 105,000 or 105k.');
  });

  it('allows negative amounts when the field is signed', () => {
    expect(moneyTextError('-2,000', { signed: true })).toBeNull();
    expect(moneyTextError('abc', { signed: true })).toBe('Enter a dollar amount, like 2,000 or -2,000 for a loss.');
  });
});
