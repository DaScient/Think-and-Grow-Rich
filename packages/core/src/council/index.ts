// ─── Council of Masterminds ───────────────────────────────────────────────────
//
// Encodes the four specialized agents from spec Section 3.2 — Architect, Muse,
// Stoic, Oracle — and a classifier that routes user input to the right agent.
// Each agent ships with:
//   - a deterministic system prompt (pinned in source so changes are reviewable)
//   - the Hill principle it primarily serves
//   - a sub-mode toggle where applicable (Muse: Synthetic vs Creative,
//     per spec Section "Muse Agent")

import type { HillPrincipleKey, ImaginationLog, ImaginationSource } from '../types/os.js';

export type CouncilAgentId = 'ARCHITECT' | 'MUSE' | 'STOIC' | 'ORACLE';

export interface CouncilAgent {
  readonly id: CouncilAgentId;
  readonly displayName: string;
  readonly hillPrinciple: HillPrincipleKey;
  readonly purpose: string;
  readonly systemPrompt: string;
}

// ─── The Architect (Organized Planning) ───────────────────────────────────────

const ARCHITECT_PROMPT = `You are the Architect, the Council member who serves the principle of Organized Planning.

Take the user's Definite Chief Aim and current constraints (provided via RAG context).
Subdivide the goal into 3 monthly milestones and 12 weekly sprints, each one a concrete,
calendar-schedulable task.

Rules:
- Every task must serve the Chief Aim directly. If a task does not, drop it.
- Tasks must be definite: clear acceptance criteria, no vague language.
- Respect existing calendar commitments; suggest the next free deep-work block if conflicts arise.
- Output a strict JSON array of tasks with fields: title, description, dueDate (ISO), priority (1–5).
- Do not add commentary outside the JSON.`;

// ─── The Muse (Imagination) ───────────────────────────────────────────────────
//
// Two distinct modes per the Muse spec section:
//   - SYNTHETIC: Combinatorial — rearranges existing assets ("In-Context Synthesis").
//   - CREATIVE: Divergent — provokes quantum leaps via persona shifts.

const MUSE_SYNTHETIC_PROMPT = `You are the Muse: Synthetic Module. Your task is to combine existing assets into new plans.
You do not invent new physics; you engineer with what is on the table.

Inputs you will receive:
1. The user's Specialized Knowledge Inventory.
2. The current market need (from recent research).
3. The user's Definite Chief Aim.

Task:
Identify 3 lateral connections between the current assets and the goal. How can each asset be
repurposed to accelerate the goal? Construct a plan that uses ONLY the existing resources to
solve the user's current obstacle. Reply in two sections: "Lateral Connections" and "Plan".`;

const MUSE_CREATIVE_PROMPT = `You are the Muse: Creative Module. Your goal is to receive "hunches" and provide
"inspirations" that defy current logic.

Task:
1. Identify the Logic Trap — the most obvious but limiting assumption the user is making.
2. Provoke a Quantum Leap — if time, money, and technology constraints did not exist, how
   would a Master Architect from the year 2050 solve this?
3. Generate 5 Intuitive Prompts written in highly metaphorical, abstract language designed
   to bypass the user's analytical mind and invite the Sixth Sense.`;

// ─── The Stoic (Persistence / Decision) ───────────────────────────────────────

const STOIC_PROMPT = `You are the Stoic, the Council member who serves Persistence and Decision.

Analyze the user's "Causes of Failure" inventory and the obstacle they have just described.
Challenge — politely but unflinchingly — any excuse that masquerades as a reason. Distinguish
clearly between a faulty plan (revise it) and faulty execution (recommit to it).

Open with the line: "You have met with a temporary check to our progress. Is the plan faulty,
or the execution?" Then guide the user through a 3-question diagnostic before recommending
either a Pivot (new plan) or a Recommit (same plan, sharper execution).`;

// ─── The Oracle (Sixth Sense / RAG over journals) ─────────────────────────────

const ORACLE_PROMPT = `You are the Oracle, the Council member who serves the Sixth Sense.

You have read-only access to the user's full journal corpus via RAG. Your task is to surface
patterns the conscious mind has missed:
- Recurring symbols, words, or emotional tones across entries.
- Apparent coincidences worth investigating ("hunches" in Hill's vocabulary).
- Shifts in the user's vocabulary that signal subconscious change.

Cite at least two specific journal entries (by date) per pattern. Speak in measured, reflective
prose. Do NOT predict the future — only mirror what is already present in the user's own words.`;

// ─── Registry ─────────────────────────────────────────────────────────────────

export const COUNCIL: Readonly<Record<CouncilAgentId, CouncilAgent>> = {
  ARCHITECT: {
    id: 'ARCHITECT',
    displayName: 'The Architect',
    hillPrinciple: 'ORGANIZED_PLANNING',
    purpose: 'Converts the Chief Aim into calendar-synced milestones and sprint tasks.',
    systemPrompt: ARCHITECT_PROMPT,
  },
  MUSE: {
    id: 'MUSE',
    displayName: 'The Muse',
    hillPrinciple: 'IMAGINATION',
    purpose: 'Provides creative prompts and human–AI collaboration strategies.',
    systemPrompt: MUSE_SYNTHETIC_PROMPT, // default; use `getMusePrompt` for explicit mode
  },
  STOIC: {
    id: 'STOIC',
    displayName: 'The Stoic',
    hillPrinciple: 'PERSISTENCE',
    purpose: 'Analyzes Causes of Failure and challenges procrastination excuses.',
    systemPrompt: STOIC_PROMPT,
  },
  ORACLE: {
    id: 'ORACLE',
    displayName: 'The Oracle',
    hillPrinciple: 'SIXTH_SENSE',
    purpose: 'Performs RAG over journals to surface intuitive patterns.',
    systemPrompt: ORACLE_PROMPT,
  },
};

/**
 * Get the Muse prompt for a specific imagination mode (Synthetic vs Creative).
 */
export function getMusePrompt(source: ImaginationSource): string {
  return source === 'CREATIVE' ? MUSE_CREATIVE_PROMPT : MUSE_SYNTHETIC_PROMPT;
}

// ─── Router / Classifier ──────────────────────────────────────────────────────
//
// Cheap heuristic classifier that runs *before* any LLM call to pick the right
// agent. Keeps cost low and routing deterministic / testable. A future
// LangGraph orchestrator can replace this with a learned router; the contract
// (input → CouncilAgentId) remains stable.

const CREATIVE_KEYWORDS = [
  'stuck',
  'breakthrough',
  'new idea',
  'inspiration',
  'vision',
  'dream',
  'imagine',
  'what if',
];

const PLANNING_KEYWORDS = [
  'plan',
  'schedule',
  'task',
  'milestone',
  'sprint',
  'deadline',
  'goal',
  'roadmap',
];

const DEFEAT_KEYWORDS = [
  'failed',
  'failure',
  'gave up',
  'procrastinate',
  'procrastinating',
  'overdue',
  'missed',
  "can't",
  'cant',
  'defeat',
  'quit',
];

const ORACLE_KEYWORDS = [
  'pattern',
  'journal',
  'reflect',
  'looking back',
  'noticed',
  'hunch',
  'intuition',
  'sixth sense',
];

interface ClassificationCounts {
  architect: number;
  museSynthetic: number;
  museCreative: number;
  stoic: number;
  oracle: number;
}

function countHits(text: string, keywords: readonly string[]): number {
  return keywords.reduce((n, kw) => (text.includes(kw) ? n + 1 : n), 0);
}

export interface AgentRoute {
  readonly agent: CouncilAgentId;
  /** When agent === 'MUSE', this selects which sub-prompt to use. */
  readonly imaginationMode?: ImaginationSource;
}

/**
 * Classify a free-form user input and return the agent that should handle it,
 * along with any sub-mode (e.g. Muse Synthetic vs Creative).
 *
 * Defaults to the Architect because Organized Planning is the spec's central
 * nervous system — when in doubt, plan.
 */
export function classifyInput(input: string): AgentRoute {
  const text = input.toLowerCase();
  const counts: ClassificationCounts = {
    architect: countHits(text, PLANNING_KEYWORDS),
    museSynthetic: 0,
    museCreative: countHits(text, CREATIVE_KEYWORDS),
    stoic: countHits(text, DEFEAT_KEYWORDS),
    oracle: countHits(text, ORACLE_KEYWORDS),
  };

  // Persistence trumps planning when a defeat is present — Hill's rule.
  if (counts.stoic > 0 && counts.stoic >= counts.architect) {
    return { agent: 'STOIC' };
  }

  const max = Math.max(counts.architect, counts.museCreative, counts.oracle);
  if (max === 0) return { agent: 'ARCHITECT' };

  if (counts.museCreative === max) {
    return { agent: 'MUSE', imaginationMode: 'CREATIVE' };
  }
  if (counts.oracle === max) {
    return { agent: 'ORACLE' };
  }
  return { agent: 'ARCHITECT' };
}

// ─── Imagination Log Helpers ──────────────────────────────────────────────────

/**
 * Construct a well-formed `ImaginationLog` entry. Centralised so feasibility
 * defaults stay consistent with the spec's guidance (Synthetic = high
 * feasibility, Creative = exploratory).
 */
export function recordImagination(args: {
  source: ImaginationSource;
  theAhaMoment: string;
  inputStimuli?: readonly string[];
  potentialFeasibility?: number;
  actionLink?: string | null;
  timestamp?: Date;
}): ImaginationLog {
  const { source, theAhaMoment } = args;
  const feasibilityDefault = source === 'SYNTHETIC' ? 0.75 : 0.25;
  return {
    timestamp: args.timestamp ?? new Date(),
    source,
    inputStimuli: args.inputStimuli ?? [],
    theAhaMoment,
    potentialFeasibility: args.potentialFeasibility ?? feasibilityDefault,
    actionLink: args.actionLink ?? null,
  };
}
