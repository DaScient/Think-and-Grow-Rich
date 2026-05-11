import { describe, expect, it } from 'vitest';
import {
  awardVibrationalPoints,
  buildAffirmationHeatmap,
  calcConsistencyScore,
  computeRank,
  hasStreakLapsed,
  levelToMinXp,
  STREAK_DECAY_DAYS,
  VIBRATIONAL_POINTS,
  xpToLevel,
} from '../mastery/index.js';
import {
  HillPrinciple,
  type AffirmationEntry,
  type HillPrincipleKey,
  type PlannedTask,
  type PrincipleMastery,
  type UserMasteryProfile,
} from '../types/os.js';

function makeMastery(level: number, exp = 0): PrincipleMastery {
  return { level, exp, lastAction: null, consistencyScore: 0 };
}

function makeAllPrinciples(level: number): Record<HillPrincipleKey, PrincipleMastery> {
  const keys = Object.values(HillPrinciple);
  const out = {} as Record<HillPrincipleKey, PrincipleMastery>;
  for (const k of keys) out[k] = makeMastery(level);
  return out;
}

describe('xpToLevel / levelToMinXp', () => {
  it('returns level 1 for zero or negative xp', () => {
    expect(xpToLevel(0)).toBe(1);
    expect(xpToLevel(-5)).toBe(1);
    expect(xpToLevel(Number.NaN)).toBe(1);
  });

  it('grows monotonically with exp', () => {
    const samples = [0, 50, 100, 250, 500, 1000, 5000, 100000].map(xpToLevel);
    for (let i = 1; i < samples.length; i += 1) {
      const prev = samples[i - 1]!;
      const cur = samples[i]!;
      expect(cur).toBeGreaterThanOrEqual(prev);
    }
  });

  it('never exceeds level 100', () => {
    expect(xpToLevel(Number.MAX_SAFE_INTEGER)).toBeLessThanOrEqual(100);
    expect(xpToLevel(Number.MAX_SAFE_INTEGER)).toBeGreaterThan(1);
  });

  it('levelToMinXp is consistent with xpToLevel for level 1', () => {
    expect(levelToMinXp(1)).toBe(0);
  });
});

describe('computeRank', () => {
  it('returns Apprentice for a fresh profile', () => {
    expect(computeRank(makeAllPrinciples(1))).toBe('Apprentice');
  });

  it('returns Builder for moderate average level', () => {
    expect(computeRank(makeAllPrinciples(40))).toBe('Builder');
  });

  it('returns Master once average level crosses 70', () => {
    expect(computeRank(makeAllPrinciples(75))).toBe('Master');
  });
});

describe('hasStreakLapsed', () => {
  it('treats a null lastAction as already lapsed', () => {
    expect(hasStreakLapsed(null)).toBe(true);
  });

  it('returns false when activity is fresh', () => {
    const now = new Date('2026-05-11T00:00:00Z');
    const recent = new Date('2026-05-10T12:00:00Z');
    expect(hasStreakLapsed(recent, now)).toBe(false);
  });

  it('returns true after the decay window', () => {
    const now = new Date('2026-05-11T00:00:00Z');
    const old = new Date('2026-05-01T00:00:00Z');
    expect(hasStreakLapsed(old, now, STREAK_DECAY_DAYS)).toBe(true);
  });
});

describe('calcConsistencyScore', () => {
  it('returns 0 for an empty task list', () => {
    expect(calcConsistencyScore([])).toBe(0);
  });

  it('returns 1.0 when every task was completed', () => {
    const tasks: PlannedTask[] = Array.from({ length: 3 }, (_, i) => ({
      id: `t${i}`,
      principle: 'PERSISTENCE',
      plannedAt: new Date(),
      completedAt: new Date(),
      pivotedAt: null,
    }));
    expect(calcConsistencyScore(tasks)).toBe(1);
  });

  it('counts only completed tasks toward the score', () => {
    const tasks: PlannedTask[] = [
      { id: 'a', principle: 'DESIRE', plannedAt: new Date(), completedAt: new Date(), pivotedAt: null },
      { id: 'b', principle: 'DESIRE', plannedAt: new Date(), completedAt: null, pivotedAt: null },
    ];
    expect(calcConsistencyScore(tasks)).toBe(0.5);
  });
});

describe('buildAffirmationHeatmap', () => {
  it('handles an empty input', () => {
    expect(buildAffirmationHeatmap([])).toEqual([]);
  });

  it('returns all-zero intensities when no entries had any recitations', () => {
    const entries: AffirmationEntry[] = [
      { date: new Date('2026-05-01'), count: 0 },
      { date: new Date('2026-05-02'), count: 0 },
    ];
    const cells = buildAffirmationHeatmap(entries);
    expect(cells.every((c) => c.intensity === 0)).toBe(true);
  });

  it('buckets intensity relative to the input maximum', () => {
    const entries: AffirmationEntry[] = [
      { date: new Date('2026-05-01'), count: 1 },
      { date: new Date('2026-05-02'), count: 4 },
      { date: new Date('2026-05-03'), count: 0 },
    ];
    const cells = buildAffirmationHeatmap(entries);
    expect(cells[1]?.intensity).toBe(4);
    expect(cells[2]?.intensity).toBe(0);
  });
});

describe('awardVibrationalPoints', () => {
  const baseProfile: UserMasteryProfile = {
    userId: 'u-1',
    currentRank: 'Apprentice',
    principles: makeAllPrinciples(1),
    masterMindGroupIds: [],
    chiefAim: {
      definition: 'Ship the TAGR OS MVP',
      targetDate: new Date('2026-12-31'),
      monetaryValue: 100_000,
      progressPercent: 0,
    },
  };

  it('adds the right XP for an action', () => {
    const next = awardVibrationalPoints(baseProfile, 'PERSISTENCE', 'chiefAimTask');
    expect(next.principles.PERSISTENCE.exp).toBe(VIBRATIONAL_POINTS.chiefAimTask);
  });

  it('updates the lastAction timestamp', () => {
    const now = new Date('2026-05-11T08:00:00Z');
    const next = awardVibrationalPoints(baseProfile, 'DESIRE', 'autoSuggestion', now);
    expect(next.principles.DESIRE.lastAction).toEqual(now);
  });

  it('promotes rank as average level grows', () => {
    let profile: UserMasteryProfile = {
      ...baseProfile,
      principles: makeAllPrinciples(60),
    };
    profile = { ...profile, currentRank: computeRank(profile.principles) };
    expect(profile.currentRank).toBe('Builder');
  });
});
