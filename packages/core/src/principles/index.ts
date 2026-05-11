import type { Fear, FearType, Principle, PrincipleId } from '../types/index.js';

// ─── The 13 Principles ────────────────────────────────────────────────────────

export const PRINCIPLES: readonly Principle[] = [
  {
    id: 1,
    name: 'Desire',
    subtitle: 'The Starting Point of All Achievement',
    category: 'foundation',
    summary:
      'Desire is not a wish — it is an obsession, a burning hunger that commands the subconscious to work ceaselessly toward its fulfillment. All achievement begins with a definite, passionate desire.',
    keyInsight:
      'A weak desire produces weak results. A burning, obsessive desire becomes the unstoppable fuel of achievement.',
    steps: [
      { order: 1, description: 'Fix in your mind the exact amount of money or goal you desire.' },
      { order: 2, description: 'Determine exactly what you intend to give in return.' },
      { order: 3, description: 'Establish a definite date by which you will possess your desire.' },
      { order: 4, description: 'Create a definite plan and begin at once, ready or not.' },
      {
        order: 5,
        description: 'Write out a clear, concise statement of your goal, plan, date, and exchange.',
      },
      {
        order: 6,
        description: 'Read your written statement aloud twice daily — upon rising and retiring.',
      },
    ],
    affirmation: 'I have a burning desire that grows stronger every day and guides all my actions.',
    relatedPrinciples: [2, 3, 8],
  },
  {
    id: 2,
    name: 'Faith',
    subtitle: 'Visualization and Belief in Attainment',
    category: 'mental',
    summary:
      'Faith is a state of mind that may be induced by affirmation and auto-suggestion. It bridges the conscious and subconscious mind, converting thought impulses into their spiritual equivalent.',
    keyInsight:
      'Faith is not passive belief — it is an active state of mind cultivated through repeated affirmations until the subconscious accepts the goal as reality.',
    steps: [
      { order: 1, description: 'Write a definite chief aim and read it daily with conviction.' },
      { order: 2, description: 'Use positive emotion to saturate all thoughts of your desire.' },
      {
        order: 3,
        description: 'Practice acting as though your goal is already achieved — embody the feeling.',
      },
      {
        order: 4,
        description:
          'Counter every negative thought immediately with its positive counterpart.',
      },
    ],
    affirmation:
      'I have absolute faith in my ability to achieve my definite chief aim. The universe conspires in my favor.',
    relatedPrinciples: [1, 3, 11],
  },
  {
    id: 3,
    name: 'Auto-Suggestion',
    subtitle: 'The Medium for Influencing the Subconscious Mind',
    category: 'mental',
    summary:
      'Auto-suggestion is self-administered stimulus. Through controlled, emotionalized repetition of thought, you influence the subconscious to act on your behalf as a creative force.',
    keyInsight:
      'The subconscious responds to feelings, not words alone. Combine vivid visualization with deep emotion for maximum subconscious programming.',
    steps: [
      {
        order: 1,
        description: 'Read your written desire statement aloud in a quiet, concentrated state.',
      },
      { order: 2, description: 'See yourself already in possession of the money or goal.' },
      { order: 3, description: 'Feel the emotions of already having it — gratitude, joy, certainty.' },
      {
        order: 4,
        description: 'Repeat this ritual morning and night, never skipping, until it is automatic.',
      },
    ],
    affirmation:
      'My subconscious mind is a faithful servant that works night and day to bring my desires into reality.',
    relatedPrinciples: [2, 11, 4],
  },
  {
    id: 4,
    name: 'Specialized Knowledge',
    subtitle: 'Personal Experiences or Observations',
    category: 'foundation',
    summary:
      'General knowledge is of little value in the accumulation of money or achievement. Specialized knowledge — organized and directed toward a specific end — is the true source of power.',
    keyInsight:
      'You do not need to possess all the knowledge yourself. Knowing where to find specialized knowledge and how to organize it into plans is the key.',
    steps: [
      { order: 1, description: 'Identify the specific knowledge required to achieve your goal.' },
      {
        order: 2,
        description:
          'Find reliable sources: schools, books, mastermind allies, online courses, mentors.',
      },
      { order: 3, description: 'Organize your knowledge acquisition into a disciplined schedule.' },
      {
        order: 4,
        description:
          'Immediately apply new knowledge — unused knowledge is merely potential, not power.',
      },
    ],
    affirmation:
      'I continuously acquire, organize, and apply specialized knowledge that compounds my effectiveness.',
    relatedPrinciples: [5, 6, 9],
  },
  {
    id: 5,
    name: 'Imagination',
    subtitle: 'The Workshop of the Mind',
    category: 'mental',
    summary:
      'Imagination is the workshop where all plans are fashioned. It operates in two modes: synthetic imagination (rearranging existing concepts) and creative imagination (receiving flashes of insight from Infinite Intelligence).',
    keyInsight:
      'Ideas are the beginning of all achievement. A single well-nurtured idea, acted upon with persistence, can transform into an empire.',
    steps: [
      {
        order: 1,
        description:
          'Daily practice synthetic imagination: combine existing ideas into novel solutions.',
      },
      {
        order: 2,
        description: 'Create a "dream space" — a daily session of uninterrupted imaginative thinking.',
      },
      { order: 3, description: 'Record every idea immediately — the subconscious delivers on its own schedule.' },
      { order: 4, description: 'Develop creative imagination through silence, meditation, and solitude.' },
    ],
    affirmation:
      'My imagination is boundless. I see solutions where others see problems and opportunities where others see obstacles.',
    relatedPrinciples: [4, 6, 13],
  },
  {
    id: 6,
    name: 'Organized Planning',
    subtitle: 'The Crystallization of Desire into Action',
    category: 'planning',
    summary:
      'Desire must be transmuted into organized plans of action. A Master Mind alliance — coordination of knowledge and effort in harmony — is the cornerstone of every great achievement.',
    keyInsight:
      'No individual has sufficient knowledge, energy, or skill alone to succeed greatly. Allied with others in a Master Mind, you access compound intelligence.',
    steps: [
      {
        order: 1,
        description: 'Form your Master Mind: select allies whose skills complement your weaknesses.',
      },
      {
        order: 2,
        description: 'Arrange to meet regularly with your Master Mind group for mutual encouragement.',
      },
      { order: 3, description: 'Create written, concrete plans with milestones and deadlines.' },
      {
        order: 4,
        description: 'When a plan fails, replace it immediately — never accept permanent defeat.',
      },
      { order: 5, description: 'Select a "QQS" approach: Quality, Quantity, Spirit in all work.' },
    ],
    affirmation:
      'I have a clear, written plan of action and a Master Mind alliance that accelerates my progress.',
    relatedPrinciples: [7, 8, 9],
  },
  {
    id: 7,
    name: 'Decision',
    subtitle: 'The Mastery of Procrastination',
    category: 'execution',
    summary:
      'Analysis of thousands of successful people revealed that prompt, definite decision-making is a common trait. Successful people decide quickly and change rarely; failures decide slowly and change often.',
    keyInsight:
      'Procrastination is the opposite of decision. Every day you delay a necessary decision, you feed the enemy of achievement.',
    steps: [
      {
        order: 1,
        description: 'Cultivate the habit of reaching a decision promptly when all the facts are available.',
      },
      {
        order: 2,
        description: 'Once a decision is made, defend it against all who would undermine it.',
      },
      {
        order: 3,
        description: 'Keep your plans private — opinions of others plant seeds of doubt.',
      },
      {
        order: 4,
        description:
          'Review your decision only when new evidence demands it — not from emotional wavering.',
      },
    ],
    affirmation:
      'I am a decisive person. I gather the facts, trust my judgment, decide promptly, and act with conviction.',
    relatedPrinciples: [6, 8, 1],
  },
  {
    id: 8,
    name: 'Persistence',
    subtitle: 'The Sustained Effort Necessary to Induce Faith',
    category: 'execution',
    summary:
      'Persistence is the direct result of will-power applied to desire. It is the fundamental prerequisite for converting desire into its monetary or physical equivalent.',
    keyInsight:
      'Most people who fail do so because they quit when temporary defeat strikes. "Three feet from gold" is the greatest lesson in persistence in all literature.',
    steps: [
      { order: 1, description: 'Build a definite purpose backed by burning desire.' },
      { order: 2, description: 'Develop a definite plan, expressed in continuous action.' },
      {
        order: 3,
        description: 'Close your mind to all negative and discouraging influences.',
      },
      {
        order: 4,
        description:
          'Form a friendly alliance with at least one person who encourages your purpose.',
      },
    ],
    affirmation:
      'I persist through every obstacle. Defeat is a signal to learn and adjust, never to abandon.',
    relatedPrinciples: [7, 1, 9],
  },
  {
    id: 9,
    name: 'Power of the Master Mind',
    subtitle: 'The Driving Force',
    category: 'planning',
    summary:
      'Power is organized knowledge expressed through intelligent effort. The Master Mind — the coordinated effort of two or more people working in perfect harmony — creates a superconscious entity greater than the sum of its parts.',
    keyInsight:
      'Andrew Carnegie attributed his entire fortune to his Master Mind. No one becomes great through isolated effort alone.',
    steps: [
      {
        order: 1,
        description: 'Identify five to seven people whose skills, character, and ambition align with your goal.',
      },
      { order: 2, description: 'Structure regular meetings with a clear agenda and purpose.' },
      {
        order: 3,
        description:
          'Foster absolute harmony — conflict destroys the Master Mind\'s creative intelligence.',
      },
      {
        order: 4,
        description:
          'Provide mutual value to all members — the alliance must benefit everyone.',
      },
    ],
    affirmation:
      'I am surrounded by brilliant, positive allies who amplify my power and multiply my results.',
    relatedPrinciples: [6, 4, 8],
  },
  {
    id: 10,
    name: 'The Mystery of Sex Transmutation',
    subtitle: 'The Tenth Step Toward Riches',
    category: 'mastery',
    summary:
      'Sex transmutation is the switching of mental and creative energy from physical expression to thought, creativity, and achievement. This redirection of the most potent human emotion is the secret behind many great creative geniuses.',
    keyInsight:
      'The emotion of sex is the most powerful human emotion. When it is harnessed and redirected, it becomes an inexhaustible creative force.',
    steps: [
      {
        order: 1,
        description: 'Recognize sexual energy as creative power, not merely physical impulse.',
      },
      {
        order: 2,
        description: 'Channel periods of heightened energy immediately into your primary creative work.',
      },
      {
        order: 3,
        description: 'Use physical vitality as fuel for mental and artistic productivity.',
      },
    ],
    affirmation:
      'I direct my creative energy with purpose, fueling my highest work and deepest achievements.',
    relatedPrinciples: [5, 13, 11],
  },
  {
    id: 11,
    name: 'The Subconscious Mind',
    subtitle: 'The Connecting Link',
    category: 'mastery',
    summary:
      'The subconscious mind is the connecting link between the finite mind of man and Infinite Intelligence. It works continuously, transmuting your dominant thoughts into their physical equivalents.',
    keyInsight:
      'The subconscious does not distinguish between thoughts of fear and thoughts of faith. You choose which to feed it.',
    steps: [
      {
        order: 1,
        description:
          'Feed the subconscious daily through auto-suggestion, affirmation, and visualization.',
      },
      {
        order: 2,
        description: 'Saturate your thoughts with the seven positive emotions: desire, faith, love, sex, enthusiasm, romance, hope.',
      },
      {
        order: 3,
        description:
          'Actively block the seven negative emotions: fear, jealousy, hatred, revenge, greed, superstition, anger.',
      },
    ],
    affirmation:
      'My subconscious mind works day and night to transform my desires into reality. I feed it only thoughts of power, love, and abundance.',
    relatedPrinciples: [2, 3, 12],
  },
  {
    id: 12,
    name: 'The Brain',
    subtitle: 'A Broadcasting and Receiving Station for Thought',
    category: 'mastery',
    summary:
      'The brain is a broadcasting and receiving station for thought. Through the stimulation of the Master Mind, the brain can be elevated to a higher rate of vibration, accessing the creative intelligence of other minds.',
    keyInsight:
      'Creative imagination is the receiver of thoughts broadcast from other minds. The more stimulated and disciplined the brain, the clearer the reception.',
    steps: [
      {
        order: 1,
        description: 'Stimulate your brain through strong emotion, particularly desire and faith.',
      },
      { order: 2, description: 'Engage regularly with brilliant, stimulating minds through your Master Mind.' },
      {
        order: 3,
        description: 'Practice focused attention — a scattered mind is a poor receiver of inspiration.',
      },
    ],
    affirmation:
      'My mind is a powerful transmitter and receiver of creative intelligence. I am open to inspiration from every source.',
    relatedPrinciples: [11, 9, 13],
  },
  {
    id: 13,
    name: 'The Sixth Sense',
    subtitle: 'The Door to the Temple of Wisdom',
    category: 'mastery',
    summary:
      'The Sixth Sense is the apex of the philosophy — the "receiving set" of the mind through which Infinite Intelligence communicates voluntarily in the form of hunches, inspirations, and premonitions. It cannot be willed; it must be cultivated.',
    keyInsight:
      'The Sixth Sense reveals itself only after years of applying all prior principles. It is the ultimate reward of a disciplined, purpose-driven mind.',
    steps: [
      {
        order: 1,
        description: 'Master all twelve preceding principles as prerequisite to awakening the Sixth Sense.',
      },
      {
        order: 2,
        description: 'Cultivate daily silence, meditation, and reflection to hear the whisper of Infinite Intelligence.',
      },
      {
        order: 3,
        description: 'Act immediately on inspired hunches before the rational mind dismisses them.',
      },
    ],
    affirmation:
      'I am connected to Infinite Intelligence. Inspired guidance flows to me freely and I act upon it with courage.',
    relatedPrinciples: [11, 12, 5],
  },
] as const;

// ─── The Six Ghosts of Fear ───────────────────────────────────────────────────

export const SIX_FEARS: readonly Fear[] = [
  {
    type: 'poverty',
    label: 'Fear of Poverty',
    description:
      'The most destructive fear. It paralyzes reason, destroys imagination, and makes failure inevitable by attracting what it fears.',
    antidote: 'Replace every thought of lack with a burning, definite desire. Focus on giving.',
  },
  {
    type: 'criticism',
    label: 'Fear of Criticism',
    description:
      'Destroys initiative and discourages individuality. Often expressed as conformity, hesitance, and excessive dependence on others\' approval.',
    antidote: 'Decide your own worth. What others think of you is none of your business.',
  },
  {
    type: 'ill_health',
    label: 'Fear of Ill Health',
    description:
      'Closely linked to hypochondria. Thinking of symptoms creates them; worrying about disease creates receptivity to it.',
    antidote: 'Direct thoughts from fear of ill health to gratitude for vitality. Exercise and nourish the body.',
  },
  {
    type: 'loss_of_love',
    label: 'Fear of Loss of Love',
    description:
      'Results in jealousy, fault-finding, and emotional dependency. Ironically drives away the love it fears losing.',
    antidote: 'Cultivate love from a place of wholeness, not need. Give love freely without demand.',
  },
  {
    type: 'old_age',
    label: 'Fear of Old Age',
    description:
      'Produces the slowing down of initiative, imagination, and action. Often tied to financial insecurity.',
    antidote: 'Reframe: wisdom and experience are assets. Begin building your definite chief aim now.',
  },
  {
    type: 'death',
    label: 'Fear of Death',
    description:
      'The cruelest of all fears. Often linked to religious uncertainty and lack of purpose.',
    antidote: 'A life of purpose dissolves fear of death. Commit to a cause greater than yourself.',
  },
] as const;

// ─── Utility Functions ────────────────────────────────────────────────────────

/**
 * Retrieve a principle by its numeric ID (1–13).
 */
export function getPrincipleById(id: PrincipleId): Principle {
  const principle = PRINCIPLES.find((p) => p.id === id);
  if (!principle) throw new Error(`Principle with id ${id} not found`);
  return principle;
}

/**
 * Retrieve all principles within a given category.
 */
export function getPrinciplesByCategory(category: Principle['category']): readonly Principle[] {
  return PRINCIPLES.filter((p) => p.category === category);
}

/**
 * Get a fear definition by its type.
 */
export function getFearByType(type: FearType): Fear {
  const fear = SIX_FEARS.find((f) => f.type === type);
  if (!fear) throw new Error(`Fear of type "${type}" not found`);
  return fear;
}

/**
 * Returns the percentage of steps completed for a principle.
 */
export function calcStepCompletion(principleId: PrincipleId, completedSteps: readonly number[]): number {
  const principle = getPrincipleById(principleId);
  if (principle.steps.length === 0) return 0;
  return Math.round((completedSteps.length / principle.steps.length) * 100);
}
