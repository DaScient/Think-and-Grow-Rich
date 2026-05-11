import type { Principle } from '@tagr/core';

export const CATEGORY_COLORS: Record<Principle['category'], string> = {
  foundation: '#f59e0b',
  mental: '#7c5cfc',
  planning: '#22d3a0',
  execution: '#f43f5e',
  mastery: '#f5c518',
};

export const CATEGORY_LABELS: Record<Principle['category'], string> = {
  foundation: 'Foundation',
  mental: 'Mental',
  planning: 'Planning',
  execution: 'Execution',
  mastery: 'Mastery',
};

export const MASTERY_COLORS: Record<string, string> = {
  unstarted: '#2a2a3a',
  awareness: '#3b5998',
  practice: '#22d3a0',
  integration: '#7c5cfc',
  mastery: '#f5c518',
};

export const MASTERY_LABELS: Record<string, string> = {
  unstarted: 'Not Started',
  awareness: 'Awareness',
  practice: 'Practice',
  integration: 'Integration',
  mastery: 'Mastery',
};
