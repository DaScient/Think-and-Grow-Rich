export * from './os.js';

// ─── Principle Types ──────────────────────────────────────────────────────────

export type PrincipleId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type PrincipleCategory =
  | 'foundation'
  | 'mental'
  | 'planning'
  | 'execution'
  | 'mastery';

export interface PrincipleStep {
  readonly order: number;
  readonly description: string;
}

export interface Principle {
  readonly id: PrincipleId;
  readonly name: string;
  readonly subtitle: string;
  readonly category: PrincipleCategory;
  readonly summary: string;
  readonly keyInsight: string;
  readonly steps: readonly PrincipleStep[];
  readonly affirmation: string;
  readonly relatedPrinciples: readonly PrincipleId[];
}

// ─── Progress Types ───────────────────────────────────────────────────────────

export type MasteryLevel = 'unstarted' | 'awareness' | 'practice' | 'integration' | 'mastery';

export interface PrincipleProgress {
  readonly principleId: PrincipleId;
  readonly masteryLevel: MasteryLevel;
  readonly completedSteps: readonly number[];
  readonly reflections: readonly string[];
  readonly startedAt: Date | null;
  readonly lastPracticedAt: Date | null;
}

export interface DashboardState {
  readonly userId: string;
  readonly progress: readonly PrincipleProgress[];
  readonly currentFocus: PrincipleId | null;
  readonly streak: number;
  readonly overallScore: number;
}

// ─── Agent Types ──────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly timestamp: Date;
  readonly relatedPrinciple?: PrincipleId;
}

export interface AgentContext {
  readonly messages: readonly Message[];
  readonly activePrinciple: PrincipleId | null;
  readonly userProgress: readonly PrincipleProgress[];
}

// ─── Fear Types ───────────────────────────────────────────────────────────────

export type FearType =
  | 'poverty'
  | 'criticism'
  | 'ill_health'
  | 'loss_of_love'
  | 'old_age'
  | 'death';

export interface Fear {
  readonly type: FearType;
  readonly label: string;
  readonly description: string;
  readonly antidote: string;
}
