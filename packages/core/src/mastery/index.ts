// ─── Mastery: Rank Progression, XP, Streaks ───────────────────────────────────
//
// Implements the Masonic-inspired progression and Vibrational Points (XP)
// system from the spec (Sections 3.1 & 4.1). All functions are pure so they
// can be reused by the dashboard, n8n ETL workflows, and tests.

import type {
  AffirmationEntry,
  HillPrincipleKey,
  MasteryRank,
  PlannedTask,
  PrincipleMastery,
  UserMasteryProfile,
} from '../types/os.js';

// ─── XP → Level ───────────────────────────────────────────────────────────────
//
// Logarithmic curve so each level costs more XP than the last. Level 1 starts
// at 0 XP. The level field is capped at `MAX_LEVEL` so it stays in [1, 100]
// regardless of how much XP a user accumulates.

const XP_PER_LEVEL_BASE = 100;
const MAX_LEVEL = 100;

/**
 * Compute the level (1–100) corresponding to a given XP total.
 * Level grows with `floor(log2(exp / base + 1)) + 1`, then clamped.
 */
export function xpToLevel(exp: number): number {
  if (!Number.isFinite(exp) || exp <= 0) return 1;
  const raw = Math.floor(Math.log2(exp / XP_PER_LEVEL_BASE + 1)) + 1;
  return Math.min(MAX_LEVEL, Math.max(1, raw));
}

/**
 * Inverse of `xpToLevel`: minimum XP required to reach the given level.
 */
export function levelToMinXp(level: number): number {
  if (level <= 1) return 0;
  const clamped = Math.min(MAX_LEVEL, Math.max(1, Math.floor(level)));
  return Math.ceil((Math.pow(2, clamped - 1) - 1) * XP_PER_LEVEL_BASE);
}

// ─── Vibrational Points (XP awards per action) ────────────────────────────────

export const VIBRATIONAL_POINTS = {
  /** Reciting the daily auto-suggestion script. */
  autoSuggestion: 10,
  /** Completing a planned task tied to the Definite Chief Aim. */
  chiefAimTask: 25,
  /** Attending a Mastermind session. */
  masterMindSession: 40,
  /** Logging a journal entry / reflection. */
  journalEntry: 15,
  /** Pivoting after a Temporary Defeat (rewards Persistence). */
  defeatPivot: 30,
} as const;

export type VibrationalAction = keyof typeof VIBRATIONAL_POINTS;

// ─── Rank Progression (Apprentice → Builder → Master) ─────────────────────────

const RANK_THRESHOLDS: readonly { rank: MasteryRank; minAvgLevel: number }[] = [
  { rank: 'Master', minAvgLevel: 70 },
  { rank: 'Builder', minAvgLevel: 30 },
  { rank: 'Apprentice', minAvgLevel: 0 },
];

/**
 * Derive the user's current rank from the average level across all 13
 * principles. Averaging ensures rank reflects breadth, not a single
 * over-developed principle — true to Hill's holistic "Master Builder" ideal.
 */
export function computeRank(
  principles: Readonly<Record<HillPrincipleKey, PrincipleMastery>>,
): MasteryRank {
  const values = Object.values(principles);
  if (values.length === 0) return 'Apprentice';
  const avg = values.reduce((s, p) => s + p.level, 0) / values.length;
  const threshold = RANK_THRESHOLDS.find((t) => avg >= t.minAvgLevel);
  return threshold?.rank ?? 'Apprentice';
}

// ─── Streak Decay (Flow State Controller) ─────────────────────────────────────

export const STREAK_DECAY_DAYS = 3;

/**
 * Return true when a principle's last action is older than the decay window
 * and the user has therefore "missed three days" in spec terminology. The
 * Adaptive Difficulty policy (simplifying tasks) lives in the Council layer.
 */
export function hasStreakLapsed(
  lastAction: Date | null,
  now: Date = new Date(),
  decayDays: number = STREAK_DECAY_DAYS,
): boolean {
  if (lastAction === null) return true;
  const elapsedMs = now.getTime() - lastAction.getTime();
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
  return elapsedDays > decayDays;
}

// ─── Consistency Score ────────────────────────────────────────────────────────

/**
 * Fraction (0–1) of planned tasks the user completed (excluding pivoted ones,
 * which are counted as "course corrections" rather than failures).
 */
export function calcConsistencyScore(tasks: readonly PlannedTask[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.completedAt !== null).length;
  return completed / tasks.length;
}

// ─── Affirmation Consistency Heatmap ──────────────────────────────────────────

export interface HeatmapCell {
  readonly date: string; // ISO YYYY-MM-DD
  readonly count: number;
  /** 0–4 intensity bucket suitable for a GitHub-style heatmap. */
  readonly intensity: 0 | 1 | 2 | 3 | 4;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Build a heatmap of Auto-Suggestion frequency. Intensity is bucketed against
 * the maximum count in the input so a user with a high baseline still sees a
 * meaningful gradient.
 */
export function buildAffirmationHeatmap(entries: readonly AffirmationEntry[]): HeatmapCell[] {
  if (entries.length === 0) return [];
  const max = entries.reduce((m, e) => Math.max(m, e.count), 0);
  if (max === 0) {
    return entries.map((e) => ({ date: isoDate(e.date), count: 0, intensity: 0 as const }));
  }

  return entries.map((e) => {
    const ratio = e.count / max;
    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    if (ratio > 0.75) intensity = 4;
    else if (ratio > 0.5) intensity = 3;
    else if (ratio > 0.25) intensity = 2;
    else if (ratio > 0) intensity = 1;
    return { date: isoDate(e.date), count: e.count, intensity };
  });
}

// ─── Profile Mutators ─────────────────────────────────────────────────────────

/**
 * Award Vibrational Points for an action, returning a new profile with the
 * targeted principle's mastery updated. Pure / immutable — callers compose
 * this into their state management.
 */
export function awardVibrationalPoints(
  profile: UserMasteryProfile,
  principle: HillPrincipleKey,
  action: VibrationalAction,
  now: Date = new Date(),
): UserMasteryProfile {
  const current = profile.principles[principle];
  const exp = current.exp + VIBRATIONAL_POINTS[action];
  const updated: PrincipleMastery = {
    level: xpToLevel(exp),
    exp,
    lastAction: now,
    consistencyScore: current.consistencyScore,
  };
  const principles = { ...profile.principles, [principle]: updated };
  return {
    ...profile,
    principles,
    currentRank: computeRank(principles),
  };
}
