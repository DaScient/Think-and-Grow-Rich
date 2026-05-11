// ─── TAGR OS Types (Spec v1.0) ────────────────────────────────────────────────
//
// Encodes the "21st-Century OS" data model from the project spec, mapped onto
// the existing `@tagr/core` conventions. These are pure data shapes — no I/O,
// no framework coupling — so they can be consumed equally by the Next.js
// dashboard, future SwiftUI clients, and n8n workflow nodes.

import type { PrincipleId } from './index.js';

// ─── Hill Principle Enum ──────────────────────────────────────────────────────
//
// Mirrors the spec's `HillPrinciple` enum (Section 4.1) using string keys so it
// can serialize cleanly into JSON payloads (n8n, RAG stores, etc.). The numeric
// `PrincipleId` (1–13) remains the canonical identifier within the engine;
// `HILL_PRINCIPLE_TO_ID` is the bridge.

export const HillPrinciple = {
  Desire: 'DESIRE',
  Faith: 'FAITH',
  AutoSuggestion: 'AUTOSUGGESTION',
  SpecializedKnowledge: 'SPECIALIZED_KNOWLEDGE',
  Imagination: 'IMAGINATION',
  OrganizedPlanning: 'ORGANIZED_PLANNING',
  Decision: 'DECISION',
  Persistence: 'PERSISTENCE',
  Mastermind: 'MASTERMIND',
  Transmutation: 'TRANSMUTATION',
  Subconscious: 'SUBCONSCIOUS',
  Brain: 'BRAIN',
  SixthSense: 'SIXTH_SENSE',
} as const;

export type HillPrincipleKey = (typeof HillPrinciple)[keyof typeof HillPrinciple];

export const HILL_PRINCIPLE_TO_ID: Readonly<Record<HillPrincipleKey, PrincipleId>> = {
  DESIRE: 1,
  FAITH: 2,
  AUTOSUGGESTION: 3,
  SPECIALIZED_KNOWLEDGE: 4,
  IMAGINATION: 5,
  ORGANIZED_PLANNING: 6,
  DECISION: 7,
  PERSISTENCE: 8,
  MASTERMIND: 9,
  TRANSMUTATION: 10,
  SUBCONSCIOUS: 11,
  BRAIN: 12,
  SIXTH_SENSE: 13,
};

export const ID_TO_HILL_PRINCIPLE: Readonly<Record<PrincipleId, HillPrincipleKey>> = {
  1: 'DESIRE',
  2: 'FAITH',
  3: 'AUTOSUGGESTION',
  4: 'SPECIALIZED_KNOWLEDGE',
  5: 'IMAGINATION',
  6: 'ORGANIZED_PLANNING',
  7: 'DECISION',
  8: 'PERSISTENCE',
  9: 'MASTERMIND',
  10: 'TRANSMUTATION',
  11: 'SUBCONSCIOUS',
  12: 'BRAIN',
  13: 'SIXTH_SENSE',
};

// ─── Mastery Rank (Masonic-Inspired Progression) ──────────────────────────────

export type MasteryRank = 'Apprentice' | 'Builder' | 'Master';

export interface PrincipleMastery {
  /** 1–100 — derived from XP via a logarithmic curve. */
  readonly level: number;
  /** Total Vibrational Points earned for this principle. */
  readonly exp: number;
  /** Timestamp of the most recent practice action (for streak/decay). */
  readonly lastAction: Date | null;
  /** Percentage (0–1) of planned tasks completed in the active window. */
  readonly consistencyScore: number;
}

export interface ChiefAim {
  readonly definition: string;
  readonly targetDate: Date;
  /** Monetary equivalent of the desire, per Hill's Desire principle, step 1. */
  readonly monetaryValue: number;
  /** 0–1 progress toward the chief aim. */
  readonly progressPercent: number;
}

export interface UserMasteryProfile {
  readonly userId: string;
  readonly currentRank: MasteryRank;
  readonly principles: Readonly<Record<HillPrincipleKey, PrincipleMastery>>;
  readonly masterMindGroupIds: readonly string[];
  readonly chiefAim: ChiefAim;
}

// ─── Imagination Log (Muse Agent Output) ──────────────────────────────────────

export type ImaginationSource = 'SYNTHETIC' | 'CREATIVE';

export interface ImaginationLog {
  readonly timestamp: Date;
  readonly source: ImaginationSource;
  /** RAG references / source materials that fed the synthesis. */
  readonly inputStimuli: readonly string[];
  /** The core idea ("a-ha" moment) produced by the Muse. */
  readonly theAhaMoment: string;
  /** 0–1 feasibility estimate (low for Creative, higher for Synthetic). */
  readonly potentialFeasibility: number;
  /** Optional UUID linking this idea to an Organized Plan task. */
  readonly actionLink: string | null;
}

// ─── Persistence / Defeat-to-Pivot Tracking ───────────────────────────────────

export interface PlannedTask {
  readonly id: string;
  readonly principle: HillPrincipleKey;
  readonly plannedAt: Date;
  readonly completedAt: Date | null;
  readonly pivotedAt: Date | null;
}

export interface AffirmationEntry {
  readonly date: Date;
  /** Number of times the user recited / acknowledged their auto-suggestion. */
  readonly count: number;
}

export interface SentimentSample {
  readonly date: Date;
  /** -1 (despair) → +1 (faith-charged). */
  readonly score: number;
}
