import type { AgentContext, MasteryLevel, Message, PrincipleId } from '../types/index.js';
import { getPrincipleById } from '../principles/index.js';

// ─── Mastery Scoring ──────────────────────────────────────────────────────────

const MASTERY_LEVEL_SCORE: Record<MasteryLevel, number> = {
  unstarted: 0,
  awareness: 1,
  practice: 2,
  integration: 3,
  mastery: 4,
};

export const MAX_MASTERY_SCORE = 4 * 13; // 52

/**
 * Calculate an overall dashboard score (0–100) based on progress across all
 * 13 principles.
 */
export function calcOverallScore(
  progress: AgentContext['userProgress'],
): number {
  const totalScore = progress.reduce(
    (acc, p) => acc + MASTERY_LEVEL_SCORE[p.masteryLevel],
    0,
  );
  return Math.round((totalScore / MAX_MASTERY_SCORE) * 100);
}

/**
 * Determine the next recommended principle to focus on.
 * Returns the first unstarted principle, or the lowest-mastery active one.
 */
export function getNextRecommendedPrinciple(
  progress: AgentContext['userProgress'],
): PrincipleId {
  const unstarted = progress.find((p) => p.masteryLevel === 'unstarted');
  if (unstarted) return unstarted.principleId;

  const sorted = [...progress].sort(
    (a, b) => MASTERY_LEVEL_SCORE[a.masteryLevel] - MASTERY_LEVEL_SCORE[b.masteryLevel],
  );
  return sorted[0]?.principleId ?? 1;
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an agentic mentor embodying the philosophy of Napoleon Hill's Think and Grow Rich. Your role is to guide the user through the 13 Steps to Riches with clarity, precision, and transformative insight.

Rules:
- Always ground your responses in one or more of the 13 principles.
- Ask powerful questions that force deep self-reflection.
- Be direct, concise, and actionable — no empty motivation.
- Refer to the user's current progress to personalize your guidance.
- When relevant, cite specific principles, affirmations, or exercises.`;

let messageIdCounter = 0;

function createMessageId(): string {
  const globalCrypto = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (typeof globalCrypto?.randomUUID === 'function') {
    return globalCrypto.randomUUID();
  }

  messageIdCounter += 1;
  return `msg-${Date.now().toString(36)}-${messageIdCounter.toString(36)}`;
}

/**
 * Build the system message for the agentic assistant, personalized to the
 * user's active principle and progress.
 */
export function buildSystemMessage(context: AgentContext): string {
  if (!context.activePrinciple) return SYSTEM_PROMPT;

  const principle = getPrincipleById(context.activePrinciple);
  const userProgress = context.userProgress.find(
    (p) => p.principleId === context.activePrinciple,
  );

  const progressContext = userProgress
    ? `\nThe user is currently at mastery level "${userProgress.masteryLevel}" for this principle with ${userProgress.completedSteps.length} of ${principle.steps.length} steps completed.`
    : '';

  return `${SYSTEM_PROMPT}

Current Focus Principle: #${principle.id} — ${principle.name}
Key Insight: "${principle.keyInsight}"${progressContext}
Affirmation to reinforce: "${principle.affirmation}"`;
}

/**
 * Create a new user message object.
 */
export function createUserMessage(content: string, principleId?: PrincipleId): Message {
  const base = {
    id: createMessageId(),
    role: 'user' as const,
    content,
    timestamp: new Date(),
  };
  return principleId !== undefined ? { ...base, relatedPrinciple: principleId } : base;
}

/**
 * Create a new assistant message object.
 */
export function createAssistantMessage(content: string, principleId?: PrincipleId): Message {
  const base = {
    id: createMessageId(),
    role: 'assistant' as const,
    content,
    timestamp: new Date(),
  };
  return principleId !== undefined ? { ...base, relatedPrinciple: principleId } : base;
}
