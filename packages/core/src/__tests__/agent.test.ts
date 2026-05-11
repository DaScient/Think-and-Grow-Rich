import { describe, expect, it } from 'vitest';
import {
  buildSystemMessage,
  calcOverallScore,
  createAssistantMessage,
  createUserMessage,
  getNextRecommendedPrinciple,
  MAX_MASTERY_SCORE,
} from '../agent/index.js';
import type { AgentContext, PrincipleProgress } from '../types/index.js';

function makeProgress(
  principleId: PrincipleProgress['principleId'],
  masteryLevel: PrincipleProgress['masteryLevel'],
): PrincipleProgress {
  return {
    principleId,
    masteryLevel,
    completedSteps: [],
    reflections: [],
    startedAt: null,
    lastPracticedAt: null,
  };
}

const allUnstarted: PrincipleProgress[] = Array.from({ length: 13 }, (_, i) =>
  makeProgress((i + 1) as PrincipleProgress['principleId'], 'unstarted'),
);

describe('calcOverallScore', () => {
  it('returns 0 when all principles are unstarted', () => {
    expect(calcOverallScore(allUnstarted)).toBe(0);
  });

  it('returns 100 when all principles are at mastery level', () => {
    const allMastery = allUnstarted.map((p) => ({ ...p, masteryLevel: 'mastery' as const }));
    expect(calcOverallScore(allMastery)).toBe(100);
  });

  it('returns a value between 0 and 100 for mixed progress', () => {
    const mixed = allUnstarted.map((p, i) => ({
      ...p,
      masteryLevel: (i < 3 ? 'practice' : 'unstarted') as PrincipleProgress['masteryLevel'],
    }));
    const score = calcOverallScore(mixed);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it('MAX_MASTERY_SCORE equals 52 (4 × 13)', () => {
    expect(MAX_MASTERY_SCORE).toBe(52);
  });
});

describe('getNextRecommendedPrinciple', () => {
  it('returns principle 1 when all are unstarted', () => {
    expect(getNextRecommendedPrinciple(allUnstarted)).toBe(1);
  });

  it('returns the first unstarted principle when some are started', () => {
    const progress = allUnstarted.map((p, i) => ({
      ...p,
      masteryLevel: (i < 3 ? 'practice' : 'unstarted') as PrincipleProgress['masteryLevel'],
    }));
    // First unstarted is index 3 → principleId 4
    expect(getNextRecommendedPrinciple(progress)).toBe(4);
  });

  it('returns the lowest-mastery principle when none are unstarted', () => {
    const progress = allUnstarted.map((p, i) => ({
      ...p,
      masteryLevel: (i === 0 ? 'awareness' : 'practice') as PrincipleProgress['masteryLevel'],
    }));
    // principle 1 has awareness (lowest)
    expect(getNextRecommendedPrinciple(progress)).toBe(1);
  });
});

describe('buildSystemMessage', () => {
  it('returns a non-empty system prompt with no active principle', () => {
    const context: AgentContext = {
      messages: [],
      activePrinciple: null,
      userProgress: allUnstarted,
    };
    const msg = buildSystemMessage(context);
    expect(msg.length).toBeGreaterThan(0);
    expect(msg).toContain('Napoleon Hill');
  });

  it('includes principle name when an active principle is set', () => {
    const context: AgentContext = {
      messages: [],
      activePrinciple: 1,
      userProgress: allUnstarted,
    };
    const msg = buildSystemMessage(context);
    expect(msg).toContain('Desire');
  });

  it('includes user mastery level in the prompt when progress exists', () => {
    const progress = allUnstarted.map((p, i) =>
      i === 0 ? { ...p, masteryLevel: 'practice' as const } : p,
    );
    const context: AgentContext = {
      messages: [],
      activePrinciple: 1,
      userProgress: progress,
    };
    const msg = buildSystemMessage(context);
    expect(msg).toContain('practice');
  });
});

describe('createUserMessage / createAssistantMessage', () => {
  it('creates a user message with role "user"', () => {
    const msg = createUserMessage('Hello');
    expect(msg.role).toBe('user');
    expect(msg.content).toBe('Hello');
    expect(msg.id).toBeTruthy();
    expect(msg.timestamp).toBeInstanceOf(Date);
  });

  it('creates an assistant message with role "assistant"', () => {
    const msg = createAssistantMessage('Here is my guidance.');
    expect(msg.role).toBe('assistant');
    expect(msg.content).toBe('Here is my guidance.');
  });

  it('assigns related principle when provided', () => {
    const msg = createUserMessage('Tell me about desire', 1);
    expect(msg.relatedPrinciple).toBe(1);
  });

  it('generates unique IDs for each message', () => {
    const msg1 = createUserMessage('First');
    const msg2 = createUserMessage('Second');
    expect(msg1.id).not.toBe(msg2.id);
  });
});
