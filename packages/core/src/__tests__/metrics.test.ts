import { describe, expect, it } from 'vitest';
import { calcDefeatPivotStats, calcSentimentTrend } from '../metrics/index.js';
import type { PlannedTask, SentimentSample } from '../types/os.js';

const HOUR = 60 * 60 * 1000;

describe('calcDefeatPivotStats', () => {
  it('returns zeros for an empty task list', () => {
    const r = calcDefeatPivotStats([]);
    expect(r).toEqual({ defeats: 0, pivots: 0, medianHoursToPivot: 0, conversionRate: 0 });
  });

  it('counts overdue uncompleted tasks as defeats', () => {
    const longAgo = new Date(Date.now() - 72 * HOUR);
    const tasks: PlannedTask[] = [
      { id: 'a', principle: 'PERSISTENCE', plannedAt: longAgo, completedAt: null, pivotedAt: null },
    ];
    expect(calcDefeatPivotStats(tasks).defeats).toBe(1);
  });

  it('reports conversionRate as pivots / defeats', () => {
    const longAgo = new Date(Date.now() - 72 * HOUR);
    const tasks: PlannedTask[] = [
      {
        id: 'a',
        principle: 'PERSISTENCE',
        plannedAt: longAgo,
        completedAt: null,
        pivotedAt: new Date(longAgo.getTime() + 12 * HOUR),
      },
      { id: 'b', principle: 'PERSISTENCE', plannedAt: longAgo, completedAt: null, pivotedAt: null },
    ];
    const r = calcDefeatPivotStats(tasks);
    expect(r.defeats).toBe(2);
    expect(r.pivots).toBe(1);
    expect(r.conversionRate).toBe(0.5);
    expect(r.medianHoursToPivot).toBeCloseTo(12, 1);
  });

  it('ignores completed tasks', () => {
    const longAgo = new Date(Date.now() - 72 * HOUR);
    const tasks: PlannedTask[] = [
      { id: 'a', principle: 'DECISION', plannedAt: longAgo, completedAt: new Date(), pivotedAt: null },
    ];
    expect(calcDefeatPivotStats(tasks).defeats).toBe(0);
  });
});

describe('calcSentimentTrend', () => {
  it('returns zeros for no samples', () => {
    expect(calcSentimentTrend([])).toEqual({
      average: 0,
      slopePerDay: 0,
      latest: 0,
      sampleCount: 0,
    });
  });

  it('computes an improving slope for rising sentiment', () => {
    const now = new Date('2026-05-11T00:00:00Z');
    const samples: SentimentSample[] = [
      { date: new Date('2026-05-01T00:00:00Z'), score: -0.5 },
      { date: new Date('2026-05-05T00:00:00Z'), score: 0 },
      { date: new Date('2026-05-09T00:00:00Z'), score: 0.5 },
    ];
    const t = calcSentimentTrend(samples, 60, now);
    expect(t.slopePerDay).toBeGreaterThan(0);
    expect(t.latest).toBe(0.5);
    expect(t.sampleCount).toBe(3);
  });

  it('respects the day window cutoff', () => {
    const now = new Date('2026-05-11T00:00:00Z');
    const samples: SentimentSample[] = [
      { date: new Date('2024-01-01T00:00:00Z'), score: 1 }, // outside window
      { date: new Date('2026-05-10T00:00:00Z'), score: 0.2 },
    ];
    const t = calcSentimentTrend(samples, 60, now);
    expect(t.sampleCount).toBe(1);
    expect(t.average).toBeCloseTo(0.2);
  });
});
