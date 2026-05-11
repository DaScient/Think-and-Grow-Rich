// ─── Insight Metrics ──────────────────────────────────────────────────────────
//
// Quantitative tracking of qualitative mindset shifts (spec Section 3.3).
// Designed to feed Apache Superset / Grafana-style dashboards via n8n ETL.

import type { PlannedTask, SentimentSample } from '../types/os.js';

// ─── Defeat-to-Pivot Ratio ────────────────────────────────────────────────────

export interface DefeatPivotStats {
  /** Number of tasks the user marked as a Temporary Defeat (pivotedAt set). */
  readonly defeats: number;
  /** Tasks that produced a Revised Plan B within the pivot window. */
  readonly pivots: number;
  /** Median hours between failure recognition and pivot, across all defeats. */
  readonly medianHoursToPivot: number;
  /** 0–1: how often a defeat is converted into a pivot (Hill's persistence). */
  readonly conversionRate: number;
}

/**
 * Compute the "Defeat-to-Pivot" metric. A task is a defeat when it is both
 * overdue (`plannedAt < pivotedAt`) and `completedAt` is null at pivot time.
 * A pivot is any defeated task with a non-null `pivotedAt`.
 *
 * Edge case: with no defeats, conversionRate is 0 and medianHoursToPivot is 0.
 */
export function calcDefeatPivotStats(
  tasks: readonly PlannedTask[],
  hoursWindow = 48,
): DefeatPivotStats {
  const defeated = tasks.filter((t) => {
    if (t.completedAt !== null) return false;
    // A task counts as defeated if it has been overdue past the window OR has
    // been explicitly pivoted (the user already named it as such).
    if (t.pivotedAt !== null) return true;
    const ageHours = (Date.now() - t.plannedAt.getTime()) / 36e5;
    return ageHours > hoursWindow;
  });

  const pivots = defeated.filter((t) => t.pivotedAt !== null);
  const hoursToPivot = pivots
    .map((t) =>
      t.pivotedAt !== null ? (t.pivotedAt.getTime() - t.plannedAt.getTime()) / 36e5 : 0,
    )
    .sort((a, b) => a - b);

  const median = (() => {
    if (hoursToPivot.length === 0) return 0;
    const mid = Math.floor(hoursToPivot.length / 2);
    if (hoursToPivot.length % 2 === 1) return hoursToPivot[mid] ?? 0;
    const a = hoursToPivot[mid - 1] ?? 0;
    const b = hoursToPivot[mid] ?? 0;
    return (a + b) / 2;
  })();

  return {
    defeats: defeated.length,
    pivots: pivots.length,
    medianHoursToPivot: median,
    conversionRate: defeated.length === 0 ? 0 : pivots.length / defeated.length,
  };
}

// ─── Sentiment Trend ──────────────────────────────────────────────────────────

export interface SentimentTrend {
  /** Simple moving average of sentiment across the window. */
  readonly average: number;
  /** Slope per day (positive = mood improving). */
  readonly slopePerDay: number;
  /** -1..+1 latest sample, or 0 if no samples in window. */
  readonly latest: number;
  /** Number of samples used (after window filter). */
  readonly sampleCount: number;
}

/**
 * Compute a sentiment trend over the last `days` days (spec default: 60).
 * Slope is calculated via least-squares against day-offset to give a stable
 * direction even with sparse samples.
 */
export function calcSentimentTrend(
  samples: readonly SentimentSample[],
  days = 60,
  now: Date = new Date(),
): SentimentTrend {
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  const recent = samples
    .filter((s) => s.date.getTime() >= cutoff)
    .slice()
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (recent.length === 0) {
    return { average: 0, slopePerDay: 0, latest: 0, sampleCount: 0 };
  }

  const average = recent.reduce((s, p) => s + p.score, 0) / recent.length;
  const latest = recent[recent.length - 1]?.score ?? 0;

  // Least-squares slope against days-from-first-sample.
  const first = recent[0]?.date.getTime() ?? cutoff;
  const xs = recent.map((s) => (s.date.getTime() - first) / (24 * 60 * 60 * 1000));
  const ys = recent.map((s) => s.score);
  const n = recent.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = (xs[i] ?? 0) - meanX;
    num += dx * ((ys[i] ?? 0) - meanY);
    den += dx * dx;
  }
  const slopePerDay = den === 0 ? 0 : num / den;

  return { average, slopePerDay, latest, sampleCount: n };
}
