'use client';

import { useState } from 'react';
import { PRINCIPLES } from '@tagr/core';
import { useDashboard } from '@/hooks/useDashboard';
import { PrincipleCard } from './PrincipleCard';
import { PrincipleDetail } from './PrincipleDetail';
import { AgentChat } from './AgentChat';
import { ScoreRing } from './ScoreRing';
import styles from './Dashboard.module.css';

type Tab = 'principles' | 'chat' | 'fears';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('principles');
  const dashboard = useDashboard();

  const { activePrinciple, setActivePrinciple, getProgress, overallScore } = dashboard;

  const activePrincipleData = activePrinciple
    ? PRINCIPLES.find((p) => p.id === activePrinciple)
    : null;

  const masteredCount = dashboard.progress.filter((p) => p.masteryLevel === 'mastery').length;
  const inProgressCount = dashboard.progress.filter(
    (p) => p.masteryLevel !== 'unstarted' && p.masteryLevel !== 'mastery',
  ).length;

  return (
    <div className={styles.root}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>◈</span>
            <div>
              <h1 className={styles.brandTitle}>Think &amp; Grow Rich</h1>
              <p className={styles.brandSubtitle}>AI Self-Development Dashboard</p>
            </div>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{masteredCount}</span>
              <span className={styles.statLabel}>Mastered</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{inProgressCount}</span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
            <ScoreRing score={overallScore} size={64} />
          </div>
        </div>
      </header>

      {/* ── Nav Tabs ────────────────────────────────────────────────── */}
      <nav className={styles.tabs} role="tablist">
        {(['principles', 'chat', 'fears'] as Tab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => {
              setActiveTab(tab);
              if (tab !== 'principles') setActivePrinciple(null);
            }}
          >
            {tab === 'principles' && '⬡ 13 Principles'}
            {tab === 'chat' && '◉ AI Mentor'}
            {tab === 'fears' && '⚔ Outwit the 6 Fears'}
          </button>
        ))}
      </nav>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className={styles.main}>
        {activeTab === 'principles' && !activePrincipleData && (
          <section className={styles.grid} aria-label="13 Principles">
            {PRINCIPLES.map((principle) => (
              <PrincipleCard
                key={principle.id}
                principle={principle}
                progress={getProgress(principle.id)}
                onSelect={() => setActivePrinciple(principle.id)}
              />
            ))}
          </section>
        )}

        {activeTab === 'principles' && activePrincipleData && (
          <PrincipleDetail
            principle={activePrincipleData}
            progress={getProgress(activePrincipleData.id)}
            onBack={() => setActivePrinciple(null)}
            onUpdateMastery={dashboard.updateMastery}
            onToggleStep={dashboard.toggleStep}
          />
        )}

        {activeTab === 'chat' && (
          <AgentChat
            userProgress={dashboard.progress}
            activePrinciple={activePrinciple}
          />
        )}

        {activeTab === 'fears' && <FearsPanel />}
      </main>
    </div>
  );
}

// ── Fears Panel ───────────────────────────────────────────────────────────────
function FearsPanel() {
  const fears = [
    {
      icon: '💸',
      label: 'Poverty',
      description: 'The most destructive fear — paralyzes reason and imagination.',
      antidote: 'Replace every thought of lack with a burning, definite desire. Focus on giving.',
    },
    {
      icon: '🗣',
      label: 'Criticism',
      description: 'Destroys initiative and discourages individuality.',
      antidote: "Decide your own worth. What others think of you is none of your business.",
    },
    {
      icon: '🩺',
      label: 'Ill Health',
      description: 'Thinking of symptoms creates them; worrying about disease invites it.',
      antidote: 'Direct thoughts to gratitude for vitality. Exercise and nourish the body.',
    },
    {
      icon: '💔',
      label: 'Loss of Love',
      description: 'Results in jealousy, fault-finding, and emotional dependency.',
      antidote: 'Cultivate love from a place of wholeness, not need.',
    },
    {
      icon: '⏳',
      label: 'Old Age',
      description: 'Produces slowing of initiative, imagination, and action.',
      antidote: 'Wisdom and experience are assets. Begin building your chief aim now.',
    },
    {
      icon: '☠',
      label: 'Death',
      description: 'The cruelest of all fears, often linked to lack of purpose.',
      antidote: 'A life of purpose dissolves the fear of death.',
    },
  ];

  return (
    <section className={styles.fearsSection}>
      <div className={styles.fearsHeader}>
        <h2 className={styles.fearsTitle}>Outwit the Six Ghosts of Fear</h2>
        <p className={styles.fearsSubtitle}>
          The mind must be cleared of these fears before the philosophy can be fully applied.
        </p>
      </div>
      <div className={styles.fearsGrid}>
        {fears.map((fear) => (
          <div key={fear.label} className={styles.fearCard}>
            <span className={styles.fearIcon}>{fear.icon}</span>
            <h3 className={styles.fearLabel}>Fear of {fear.label}</h3>
            <p className={styles.fearDescription}>{fear.description}</p>
            <div className={styles.fearAntidote}>
              <span className={styles.fearAntidoteLabel}>Antidote</span>
              <p>{fear.antidote}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
