'use client';

import type { Principle, PrincipleProgress } from '@tagr/core';
import { CATEGORY_COLORS, CATEGORY_LABELS, MASTERY_COLORS, MASTERY_LABELS } from '@/lib/constants';
import styles from './PrincipleCard.module.css';

interface Props {
  principle: Principle;
  progress: PrincipleProgress | undefined;
  onSelect: () => void;
}

export function PrincipleCard({ principle, progress, onSelect }: Props) {
  const mastery = progress?.masteryLevel ?? 'unstarted';
  const completedSteps = progress?.completedSteps.length ?? 0;
  const totalSteps = principle.steps.length;
  const stepPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const categoryColor = CATEGORY_COLORS[principle.category];

  return (
    <button
      className={styles.card}
      onClick={onSelect}
      aria-label={`Open principle ${principle.id}: ${principle.name}`}
      style={{ '--category-color': categoryColor } as React.CSSProperties}
    >
      {/* Step indicator */}
      <div className={styles.header}>
        <span className={styles.number}>#{principle.id}</span>
        <span
          className={styles.masteryBadge}
          style={{ background: MASTERY_COLORS[mastery] }}
        >
          {MASTERY_LABELS[mastery]}
        </span>
      </div>

      {/* Category */}
      <div className={styles.category} style={{ color: categoryColor }}>
        {CATEGORY_LABELS[principle.category]}
      </div>

      {/* Title */}
      <h2 className={styles.title}>{principle.name}</h2>
      <p className={styles.subtitle}>{principle.subtitle}</p>

      {/* Summary excerpt */}
      <p className={styles.summary}>
        {principle.summary.slice(0, 100)}…
      </p>

      {/* Progress bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>Steps</span>
          <span>{completedSteps}/{totalSteps}</span>
        </div>
        <div className={styles.progressBar} role="progressbar" aria-valuenow={stepPct} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={styles.progressFill}
            style={{ width: `${stepPct}%`, background: categoryColor }}
          />
        </div>
      </div>

      {/* Caret */}
      <div className={styles.caret}>View Principle →</div>
    </button>
  );
}
