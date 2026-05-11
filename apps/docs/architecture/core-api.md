# `@tagr/core` — API Reference

The `@tagr/core` package is the heart of the application. It exports all TypeScript types, the 13 Principles dataset, and agent utility functions.

## Installation

```bash
# Within the monorepo (workspace protocol)
pnpm add @tagr/core
```

## Principles

### `PRINCIPLES`

A read-only array of all 13 `Principle` objects.

```ts
import { PRINCIPLES } from '@tagr/core';

console.log(PRINCIPLES.length); // 13
console.log(PRINCIPLES[0].name); // "Desire"
```

### `getPrincipleById(id: PrincipleId): Principle`

Returns a single principle by its ID (1–13). Throws if the ID is invalid.

```ts
import { getPrincipleById } from '@tagr/core';

const desire = getPrincipleById(1);
// { id: 1, name: 'Desire', category: 'foundation', ... }
```

### `getPrinciplesByCategory(category): readonly Principle[]`

Returns all principles within a category: `'foundation' | 'mental' | 'planning' | 'execution' | 'mastery'`.

```ts
import { getPrinciplesByCategory } from '@tagr/core';

const mentalPrinciples = getPrinciplesByCategory('mental');
// [Faith, Auto-Suggestion, Imagination]
```

### `calcStepCompletion(principleId, completedSteps): number`

Returns the percentage of action steps completed for a given principle.

```ts
import { calcStepCompletion } from '@tagr/core';

calcStepCompletion(1, [1, 2, 3]); // 50 (principle 1 has 6 steps)
```

## Fears

### `SIX_FEARS`

A read-only array of the six `Fear` objects.

### `getFearByType(type: FearType): Fear`

Returns a fear definition by its type slug.

```ts
import { getFearByType } from '@tagr/core';

const poverty = getFearByType('poverty');
// { type: 'poverty', label: 'Fear of Poverty', description: '...', antidote: '...' }
```

## Agent Utilities

### `buildSystemMessage(context: AgentContext): string`

Constructs a personalized system prompt for the AI mentor, incorporating the active principle and user progress.

```ts
import { buildSystemMessage } from '@tagr/core';

const prompt = buildSystemMessage({
  messages: [],
  activePrinciple: 1,
  userProgress: myProgress,
});
```

### `calcOverallScore(progress): number`

Returns an overall mastery score (0–100) based on mastery levels across all 13 principles.

### `getNextRecommendedPrinciple(progress): PrincipleId`

Returns the ID of the next principle to focus on based on current progress.

## TypeScript Interfaces

```ts
// Core principle type
interface Principle {
  id: PrincipleId; // 1–13
  name: string;
  subtitle: string;
  category: PrincipleCategory;
  summary: string;
  keyInsight: string;
  steps: readonly PrincipleStep[];
  affirmation: string;
  relatedPrinciples: readonly PrincipleId[];
}

// User progress per principle
interface PrincipleProgress {
  principleId: PrincipleId;
  masteryLevel: MasteryLevel; // 'unstarted' | 'awareness' | 'practice' | 'integration' | 'mastery'
  completedSteps: readonly number[];
  reflections: readonly string[];
  startedAt: Date | null;
  lastPracticedAt: Date | null;
}
```
