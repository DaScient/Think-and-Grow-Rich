import { describe, expect, it } from 'vitest';
import { classifyInput, COUNCIL, getMusePrompt, recordImagination } from '../council/index.js';

describe('COUNCIL registry', () => {
  it('exposes all four agents with non-empty prompts', () => {
    for (const id of ['ARCHITECT', 'MUSE', 'STOIC', 'ORACLE'] as const) {
      const agent = COUNCIL[id];
      expect(agent.id).toBe(id);
      expect(agent.systemPrompt.length).toBeGreaterThan(50);
      expect(agent.purpose.length).toBeGreaterThan(0);
    }
  });

  it('maps each agent to its primary Hill principle', () => {
    expect(COUNCIL.ARCHITECT.hillPrinciple).toBe('ORGANIZED_PLANNING');
    expect(COUNCIL.MUSE.hillPrinciple).toBe('IMAGINATION');
    expect(COUNCIL.STOIC.hillPrinciple).toBe('PERSISTENCE');
    expect(COUNCIL.ORACLE.hillPrinciple).toBe('SIXTH_SENSE');
  });
});

describe('getMusePrompt', () => {
  it('returns the Synthetic prompt by default', () => {
    expect(getMusePrompt('SYNTHETIC')).toContain('Synthetic Module');
  });

  it('returns the Creative prompt when asked', () => {
    expect(getMusePrompt('CREATIVE')).toContain('Creative Module');
  });
});

describe('classifyInput', () => {
  it('defaults to the Architect when no signal is present', () => {
    expect(classifyInput('hello').agent).toBe('ARCHITECT');
  });

  it('routes planning-flavoured input to the Architect', () => {
    expect(classifyInput('Help me build a plan with weekly milestones').agent).toBe('ARCHITECT');
  });

  it('routes defeat-flavoured input to the Stoic', () => {
    expect(classifyInput("I keep procrastinating and my task is overdue").agent).toBe('STOIC');
  });

  it('routes visionary input to the Muse in CREATIVE mode', () => {
    const r = classifyInput('I feel stuck — I need a breakthrough');
    expect(r.agent).toBe('MUSE');
    expect(r.imaginationMode).toBe('CREATIVE');
  });

  it('routes journal-pattern input to the Oracle', () => {
    expect(classifyInput('Looking back at my journal, what pattern do you notice?').agent).toBe(
      'ORACLE',
    );
  });

  it('prefers Stoic over Architect when defeat and planning words both appear', () => {
    expect(classifyInput('My plan failed and the deadline is overdue').agent).toBe('STOIC');
  });
});

describe('recordImagination', () => {
  it('defaults feasibility higher for Synthetic than Creative', () => {
    const s = recordImagination({ source: 'SYNTHETIC', theAhaMoment: 'idea' });
    const c = recordImagination({ source: 'CREATIVE', theAhaMoment: 'idea' });
    expect(s.potentialFeasibility).toBeGreaterThan(c.potentialFeasibility);
  });

  it('preserves explicit overrides', () => {
    const log = recordImagination({
      source: 'CREATIVE',
      theAhaMoment: 'metaphor',
      inputStimuli: ['journal-2026-05-01'],
      potentialFeasibility: 0.9,
      actionLink: 'task-42',
    });
    expect(log.potentialFeasibility).toBe(0.9);
    expect(log.actionLink).toBe('task-42');
    expect(log.inputStimuli).toEqual(['journal-2026-05-01']);
  });

  it('populates a timestamp', () => {
    const t = new Date('2026-05-11T00:00:00Z');
    expect(recordImagination({ source: 'SYNTHETIC', theAhaMoment: 'x', timestamp: t }).timestamp).toEqual(
      t,
    );
  });
});
