import { describe, expect, test } from 'vitest';
import { DANI, DANI_AS_OF, DANI_GIG } from '@/samples/dani';
import { diagnose } from '../diagnose';
import { estimate2027 } from '../estimate2027';
import { templateExplanation } from '../explainTemplate';
import { optimize } from '../optimizer';
import { ExplanationSchema, type PlanResult } from '../types';

const WITH_GIG = { gig: DANI_GIG, asOf: DANI_AS_OF };
const HOUSEHOLD = { state: DANI.state, householdSize: DANI.householdSize };

describe('estimate2027: spec §B F13', () => {
  const plan = optimize(DANI, WITH_GIG);

  test('adds the income deferred to January to the expected 2027 income', () => {
    const result = estimate2027(120_000, plan, HOUSEHOLD);
    expect(result.floor).toBe(123_000);
    expect(result.cliff2027).toBe(132_000);
    expect(result.headroom2027).toBe(9_000);
    expect(result.warning).toBeNull();
  });

  test('warns when the floor is over the 2027 cliff', () => {
    expect(estimate2027(131_000, plan, HOUSEHOLD).warning).toMatch(/\$134,000/);
  });

  test('without a plan the floor is the expected income', () => {
    expect(estimate2027(90_000, null, HOUSEHOLD).floor).toBe(90_000);
  });

  test('property: no expected income ever yields a floor below it', () => {
    for (let i = 0; i < 500; i += 1) {
      const expected = Math.random() * 200_000;
      expect(estimate2027(expected, plan, HOUSEHOLD).floor).toBeGreaterThanOrEqual(expected);
      expect(estimate2027(expected, null, HOUSEHOLD).floor).toBeGreaterThanOrEqual(expected);
    }
  });
});

describe('templateExplanation', () => {
  const f1 = diagnose(DANI, { gig: null, asOf: DANI_AS_OF });
  const plan = optimize(DANI, WITH_GIG);

  const numbersIn = (value: unknown): Set<number> => {
    const found = new Set<number>();
    const walk = (v: unknown): void => {
      if (typeof v === 'number') {
        found.add(Math.round(Math.abs(v)));
      } else if (Array.isArray(v)) {
        v.forEach(walk);
      } else if (typeof v === 'object' && v !== null) {
        Object.values(v).forEach(walk);
      }
    };
    walk(value);
    return found;
  };
  const dollarsIn = (text: string): number[] =>
    [...text.matchAll(/\$([\d,]+)/g)].map((m) => Number(m[1].replaceAll(',', '')));

  function expectOnlyInputNumbers(explanation: ReturnType<typeof templateExplanation>, ...inputs: unknown[]) {
    const allowed = numbersIn(inputs);
    const text = JSON.stringify(explanation);
    for (const amount of dollarsIn(text)) expect(allowed.has(amount), `$${amount} is not an input`).toBe(true);
  }

  test('F1 diagnosis with the F3 plan: valid, 1-3 paragraphs, only input numbers', () => {
    const explanation = templateExplanation(f1, plan);
    expect(ExplanationSchema.safeParse(explanation).success).toBe(true);
    expect(explanation.paragraphs.length).toBeGreaterThanOrEqual(1);
    expect(explanation.paragraphs.length).toBeLessThanOrEqual(3);
    expect(explanation.moveNotes.map((n) => n.leverId)).toEqual(plan.moves.map((m) => m.leverId));
    expectOnlyInputNumbers(explanation, f1, plan);
  });

  test('is deterministic', () => {
    expect(templateExplanation(f1, plan)).toEqual(templateExplanation(f1, plan));
  });

  test.each<[string, PlanResult['verdict'], Partial<PlanResult>]>([
    ['no plan', 'under_line', {}],
    ['not worth fighting', 'not_worth_fighting', { moves: [], setAside: 9_342 }],
    ['needs retirement moves', 'needs_retirement_moves', { moves: [], suggestion: 'allow_retirement_moves' }],
    ['costly', 'costly', {}],
  ])('over the cliff, %s', (name, verdict, patch) => {
    const over = diagnose(DANI, WITH_GIG);
    const given = name === 'no plan' ? null : { ...plan, verdict, ...patch };
    const explanation = templateExplanation(over, given);
    expect(ExplanationSchema.safeParse(explanation).success).toBe(true);
    expectOnlyInputNumbers(explanation, over, given);
  });

  test('every zone produces valid copy', () => {
    for (const income of [20_000, 60_000, 126_000, 140_000]) {
      const d = diagnose(
        { ...DANI, marketplace: { ...DANI.marketplace, slcspAnnualOverride: 19_800, incomeEstimate: income } },
        { gig: null, asOf: DANI_AS_OF, extra: { selfEmployment: income - 122_036 } },
      );
      const explanation = templateExplanation(d, null);
      expect(ExplanationSchema.safeParse(explanation).success).toBe(true);
      expectOnlyInputNumbers(explanation, d);
    }
  });
});
