'use client';

import type { MasteryLevel, Principle, PrincipleId, PrincipleProgress } from '@tagr/core';
import { CATEGORY_COLORS, MASTERY_COLORS, MASTERY_LABELS } from '@/lib/constants';
import styles from './PrincipleDetail.module.css';

const MASTERY_LEVELS: MasteryLevel[] = ['unstarted', 'awareness', 'practice', 'integration', 'mastery'];

interface Props {
  principle: Principle;
  progress: PrincipleProgress | undefined;
  onBack: () => void;
  onUpdateMastery: (id: PrincipleId, level: MasteryLevel) => void;
  onToggleStep: (id: PrincipleId, stepOrder: number) => void;
}

export function PrincipleDetail({
  principle,
  progress,
  onBack,
  onUpdateMastery,
  onToggleStep,
}: Props) {
  const mastery = progress?.masteryLevel ?? 'unstarted';
  const completedSteps = progress?.completedSteps ?? [];
  const categoryColor = CATEGORY_COLORS[principle.category];

  return (
    <div className={styles.root}>
      <button className={styles.back} onClick={onBack}>
        ← Back to All Principles
      </button>

      <div className={styles.hero} style={{ borderColor: categoryColor }}>
        <div className={styles.heroMeta}>
          <span className={styles.heroNumber}>Principle #{principle.id}</span>
          <span
            className={styles.masteryBadge}
            style={{ background: MASTERY_COLORS[mastery] }}
          >
            {MASTERY_LABELS[mastery]}
          </span>
        </div>
        <h1 className={styles.heroTitle} style={{ color: categoryColor }}>
          {principle.name}
        </h1>
        <p className={styles.heroSubtitle}>{principle.subtitle}</p>
        <p className={styles.heroCopy}>{principle.summary}</p>
      </div>

      <div className={styles.body}>
        {/* Key Insight */}
        <section className={styles.insightBox}>
          <span className={styles.insightLabel}>💡 Key Insight</span>
          <p className={styles.insightText}>{principle.keyInsight}</p>
        </section>

        {/* Mastery Level Selector */}
        <section className={styles.masterySection}>
          <h2 className={styles.sectionTitle}>Your Mastery Level</h2>
          <div className={styles.masteryOptions}>
            {MASTERY_LEVELS.map((level) => (
              <button
                key={level}
                className={`${styles.masteryOption} ${mastery === level ? styles.masteryOptionActive : ''}`}
                style={mastery === level ? { background: MASTERY_COLORS[level], color: '#0a0a0f' } : {}}
                onClick={() => onUpdateMastery(principle.id, level)}
              >
                {MASTERY_LABELS[level]}
              </button>
            ))}
          </div>
        </section>

        {/* Action Steps */}
        <section className={styles.stepsSection}>
          <h2 className={styles.sectionTitle}>Action Steps</h2>
          <ol className={styles.stepsList}>
            {principle.steps.map((step) => {
              const done = completedSteps.includes(step.order);
              return (
                <li key={step.order} className={`${styles.step} ${done ? styles.stepDone : ''}`}>
                  <button
                    className={styles.stepCheck}
                    onClick={() => onToggleStep(principle.id, step.order)}
                    aria-label={done ? `Mark step ${step.order} incomplete` : `Mark step ${step.order} complete`}
                    style={done ? { background: categoryColor, borderColor: categoryColor } : {}}
                  >
                    {done ? '✓' : step.order}
                  </button>
                  <span className={styles.stepText}>{step.description}</span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Affirmation */}
        <section className={styles.affirmationBox} style={{ borderColor: categoryColor }}>
          <span className={styles.affirmationLabel}>Daily Affirmation</span>
          <blockquote className={styles.affirmationText}>
            &ldquo;{principle.affirmation}&rdquo;
          </blockquote>
        </section>

        {/* Related Principles */}
        <section className={styles.relatedSection}>
          <h2 className={styles.sectionTitle}>Related Principles</h2>
          <div className={styles.relatedList}>
            {principle.relatedPrinciples.map((relId) => (
              <span key={relId} className={styles.relatedBadge}>
                #{relId}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
