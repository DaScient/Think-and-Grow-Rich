'use client';

import { useState } from 'react';
import type { PrincipleId, PrincipleProgress } from '@tagr/core';
import { PRINCIPLES, buildSystemMessage, createAssistantMessage, createUserMessage } from '@tagr/core';
import type { Message } from '@tagr/core';
import styles from './AgentChat.module.css';

interface Props {
  userProgress: PrincipleProgress[];
  activePrinciple: PrincipleId | null;
}

const dashboardBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const configuredChatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL?.trim();
const chatApiUrl =
  configuredChatApiUrl && configuredChatApiUrl.length > 0
    ? configuredChatApiUrl
    : process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'github-pages'
      ? null
      : `${dashboardBasePath}/api/chat`;

const STATIC_DEPLOYMENT_MESSAGE =
  '⚠ Live AI coaching is disabled in the static GitHub Pages build. Set `NEXT_PUBLIC_CHAT_API_URL` to a hosted chat endpoint to enable it there. In the meantime, reflect on this: *"Whatever the mind can conceive and believe, it can achieve."* — Napoleon Hill';

const TEMPORARY_UNAVAILABLE_MESSAGE =
  '⚠ The mentor is unavailable right now. Configure your OpenAI API key in the environment to enable live AI coaching. In the meantime, reflect on this: *"Whatever the mind can conceive and believe, it can achieve."* — Napoleon Hill';

const STARTER_PROMPTS = [
  'What is my first step toward achieving a burning desire?',
  'How do I develop unshakeable faith in my goals?',
  'Explain the Master Mind concept and how to form one.',
  'How do I outwit the fear of poverty?',
  'What separates persistent people from those who quit?',
  'Give me a daily practice plan for auto-suggestion.',
];

export function AgentChat({ userProgress, activePrinciple }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const context = {
    messages,
    activePrinciple,
    userProgress,
  };

  const systemPrompt = buildSystemMessage(context);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const activeChatApiUrl = chatApiUrl;
    const userMsg = createUserMessage(content.trim(), activePrinciple ?? undefined);
    setMessages((prev) => [...prev, userMsg]);

    if (!activeChatApiUrl) {
      const assistantMsg = createAssistantMessage(
        STATIC_DEPLOYMENT_MESSAGE,
        activePrinciple ?? undefined,
      );
      setMessages((prev) => [...prev, assistantMsg]);
      return;
    }

    setInput('');
    setIsLoading(true);

    try {
      // Build the payload for the AI API
      const payload = {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: content.trim() },
        ],
      };

      const res = await fetch(activeChatApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = (await res.json()) as { content: string };
      const assistantMsg = createAssistantMessage(data.content, activePrinciple ?? undefined);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg = createAssistantMessage(
        TEMPORARY_UNAVAILABLE_MESSAGE,
        activePrinciple ?? undefined,
      );
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className={styles.root}>
      {/* Context bar */}
      <div className={styles.contextBar}>
        <span className={styles.contextLabel}>
          {activePrinciple
            ? `Discussing: Principle #${activePrinciple} — ${PRINCIPLES.find((p) => p.id === activePrinciple)?.name}`
            : 'General Mentoring Session'}
        </span>
        <span className={styles.modelBadge}>GPT-4o Mini</span>
      </div>

      {/* Messages */}
      <div className={styles.messages} aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <div className={styles.welcome}>
            <div className={styles.welcomeIcon}>◈</div>
            <h2 className={styles.welcomeTitle}>Your AI Mentor Awaits</h2>
            <p className={styles.welcomeText}>
              Ask anything about the 13 Principles, your progress, or how to apply them today.
            </p>
            <div className={styles.starters}>
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  className={styles.starter}
                  onClick={() => void sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageAssistant}`}
          >
            <div className={styles.messageRole}>
              {msg.role === 'user' ? 'You' : '◈ Mentor'}
            </div>
            <div className={styles.messageContent}>{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className={`${styles.message} ${styles.messageAssistant}`}>
            <div className={styles.messageRole}>◈ Mentor</div>
            <div className={styles.thinking}>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void sendMessage(input);
            }
          }}
          placeholder="Ask your mentor anything… (Enter to send, Shift+Enter for new line)"
          rows={2}
          disabled={isLoading}
          aria-label="Message input"
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          ↑
        </button>
      </form>
    </div>
  );
}
