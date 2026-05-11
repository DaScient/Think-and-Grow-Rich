import { describe, expect, it } from 'vitest';
import {
  calcStepCompletion,
  getFearByType,
  getPrincipleById,
  getPrinciplesByCategory,
  PRINCIPLES,
  SIX_FEARS,
} from '../principles/index.js';

describe('PRINCIPLES dataset', () => {
  it('contains exactly 13 principles', () => {
    expect(PRINCIPLES).toHaveLength(13);
  });

  it('has sequential IDs from 1 to 13', () => {
    const ids = PRINCIPLES.map((p) => p.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  it('every principle has a non-empty name, summary, and affirmation', () => {
    for (const p of PRINCIPLES) {
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.summary.length).toBeGreaterThan(0);
      expect(p.affirmation.length).toBeGreaterThan(0);
    }
  });

  it('every principle has at least one step', () => {
    for (const p of PRINCIPLES) {
      expect(p.steps.length).toBeGreaterThan(0);
    }
  });

  it('every related principle ID is a valid ID (1–13)', () => {
    const validIds = new Set(PRINCIPLES.map((p) => p.id));
    for (const p of PRINCIPLES) {
      for (const relId of p.relatedPrinciples) {
        expect(validIds.has(relId)).toBe(true);
      }
    }
  });
});

describe('getPrincipleById', () => {
  it('returns the correct principle for each ID', () => {
    for (let id = 1; id <= 13; id++) {
      const principle = getPrincipleById(id as Parameters<typeof getPrincipleById>[0]);
      expect(principle.id).toBe(id);
    }
  });

  it('returns the first principle — Desire', () => {
    const p = getPrincipleById(1);
    expect(p.name).toBe('Desire');
  });

  it('returns the thirteenth principle — The Sixth Sense', () => {
    const p = getPrincipleById(13);
    expect(p.name).toBe('The Sixth Sense');
  });
});

describe('getPrinciplesByCategory', () => {
  it('returns only principles matching the requested category', () => {
    const mental = getPrinciplesByCategory('mental');
    for (const p of mental) {
      expect(p.category).toBe('mental');
    }
  });

  it('returns at least one principle per category', () => {
    const categories = ['foundation', 'mental', 'planning', 'execution', 'mastery'] as const;
    for (const cat of categories) {
      expect(getPrinciplesByCategory(cat).length).toBeGreaterThan(0);
    }
  });

  it('all principles are covered across categories', () => {
    const categories = ['foundation', 'mental', 'planning', 'execution', 'mastery'] as const;
    const total = categories.reduce(
      (acc, cat) => acc + getPrinciplesByCategory(cat).length,
      0,
    );
    expect(total).toBe(13);
  });
});

describe('SIX_FEARS dataset', () => {
  it('contains exactly 6 fears', () => {
    expect(SIX_FEARS).toHaveLength(6);
  });

  it('every fear has a non-empty label, description, and antidote', () => {
    for (const f of SIX_FEARS) {
      expect(f.label.length).toBeGreaterThan(0);
      expect(f.description.length).toBeGreaterThan(0);
      expect(f.antidote.length).toBeGreaterThan(0);
    }
  });
});

describe('getFearByType', () => {
  it('returns the fear of poverty', () => {
    const fear = getFearByType('poverty');
    expect(fear.type).toBe('poverty');
    expect(fear.label).toContain('Poverty');
  });

  it('returns the fear of death', () => {
    const fear = getFearByType('death');
    expect(fear.type).toBe('death');
  });
});

describe('calcStepCompletion', () => {
  it('returns 0 when no steps are completed', () => {
    expect(calcStepCompletion(1, [])).toBe(0);
  });

  it('returns 100 when all steps are completed', () => {
    const principle = getPrincipleById(1);
    const allStepOrders = principle.steps.map((s) => s.order);
    expect(calcStepCompletion(1, allStepOrders)).toBe(100);
  });

  it('returns correct percentage for partial completion', () => {
    const principle = getPrincipleById(1); // has 6 steps
    expect(principle.steps).toHaveLength(6);
    expect(calcStepCompletion(1, [1, 2, 3])).toBe(50);
  });

  it('handles principles with fewer steps correctly', () => {
    // Principle 13 has 3 steps
    const p13 = getPrincipleById(13);
    expect(p13.steps).toHaveLength(3);
    expect(calcStepCompletion(13, [1])).toBe(33);
  });
});
