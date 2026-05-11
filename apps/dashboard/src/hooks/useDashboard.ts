'use client';

import { useState, useCallback } from 'react';
import type { MasteryLevel, PrincipleId, PrincipleProgress } from '@tagr/core';
import { PRINCIPLES } from '@tagr/core';

const MASTERY_LEVELS: MasteryLevel[] = ['unstarted', 'awareness', 'practice', 'integration', 'mastery'];

function createInitialProgress(): PrincipleProgress[] {
  return PRINCIPLES.map((p) => ({
    principleId: p.id,
    masteryLevel: 'unstarted' as MasteryLevel,
    completedSteps: [],
    reflections: [],
    startedAt: null,
    lastPracticedAt: null,
  }));
}

export function useDashboard() {
  const [progress, setProgress] = useState<PrincipleProgress[]>(createInitialProgress);
  const [activePrinciple, setActivePrinciple] = useState<PrincipleId | null>(null);

  const updateMastery = useCallback((principleId: PrincipleId, level: MasteryLevel) => {
    setProgress((prev) =>
      prev.map((p) =>
        p.principleId === principleId
          ? {
              ...p,
              masteryLevel: level,
              startedAt: p.startedAt ?? (level !== 'unstarted' ? new Date() : null),
              lastPracticedAt: level !== 'unstarted' ? new Date() : p.lastPracticedAt,
            }
          : p,
      ),
    );
  }, []);

  const toggleStep = useCallback((principleId: PrincipleId, stepOrder: number) => {
    setProgress((prev) =>
      prev.map((p) => {
        if (p.principleId !== principleId) return p;
        const has = p.completedSteps.includes(stepOrder);
        return {
          ...p,
          completedSteps: has
            ? p.completedSteps.filter((s) => s !== stepOrder)
            : [...p.completedSteps, stepOrder],
          lastPracticedAt: new Date(),
        };
      }),
    );
  }, []);

  const getProgress = useCallback(
    (principleId: PrincipleId) => progress.find((p) => p.principleId === principleId),
    [progress],
  );

  const overallScore = Math.round(
    (progress.reduce((acc, p) => {
      const idx = MASTERY_LEVELS.indexOf(p.masteryLevel);
      return acc + idx;
    }, 0) /
      (MASTERY_LEVELS.length - 1) /
      13) *
      100,
  );

  return {
    progress,
    activePrinciple,
    setActivePrinciple,
    updateMastery,
    toggleStep,
    getProgress,
    overallScore,
  };
}
