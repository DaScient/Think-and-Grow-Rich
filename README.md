<div align="center">

# ◈ Think & Grow Rich
### AI-Driven Professional Self-Development Dashboard

[![CI](https://github.com/DaScient/Think-and-Grow-Rich/actions/workflows/ci.yml/badge.svg)](https://github.com/DaScient/Think-and-Grow-Rich/actions/workflows/ci.yml)
[![Deploy](https://github.com/DaScient/Think-and-Grow-Rich/actions/workflows/deploy-docs.yml/badge.svg)](https://github.com/DaScient/Think-and-Grow-Rich/actions/workflows/deploy-docs.yml)
[![Tests](https://img.shields.io/badge/tests-33%20passing-22d3a0?style=flat-square)](https://github.com/DaScient/Think-and-Grow-Rich/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9-f69220?style=flat-square&logo=pnpm)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

**[Launch Dashboard](https://dascient.github.io/Think-and-Grow-Rich/dashboard/)** · **[Documentation](https://dascient.github.io/Think-and-Grow-Rich/)** · **[Report Bug](https://github.com/DaScient/Think-and-Grow-Rich/issues/new?template=bug_report.yml)** · **[Request Feature](https://github.com/DaScient/Think-and-Grow-Rich/issues/new?template=feature_request.yml)**

> *"Whatever the mind can conceive and believe, it can achieve."* -- Napoleon Hill

</div>

---

## What Is This?

**Think & Grow Rich** is an open-source, AI-powered self-development platform that transforms Napoleon Hill's 13 Principles of Success into an interactive, data-driven coaching system. It combines:

- A **fully-typed TypeScript core package** encoding all 13 principles with action steps, mastery levels, and affirmations
- A **Next.js 15 dashboard** for tracking your progress through each principle
- An **agentic AI mentor** (GPT-4o) that personalizes coaching to your current mastery level
- A **VitePress documentation site** with Mermaid.js architecture diagrams
- A **fully automated CI/CD pipeline** deploying to GitHub Pages

---

## Architecture

```
Think-and-Grow-Rich/
├── apps/
│   ├── dashboard/        # Next.js 15 — AI self-development dashboard
│   └── docs/             # VitePress — interactive documentation
├── packages/
│   └── core/             # @tagr/core — 13 Principles engine (TypeScript)
├── .github/
│   ├── ISSUE_TEMPLATE/   # Bug, Feature, Technical Debt templates
│   └── workflows/        # CI (lint+test+build) + Deploy to GitHub Pages
└── scripts/
    └── setup.sh          # Interactive Getting Started CLI
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20.x |
| pnpm | >= 9.x |
| Git | >= 2.40 |

### Quick Start

```bash
# 1. Clone
git clone https://github.com/DaScient/Think-and-Grow-Rich.git
cd Think-and-Grow-Rich

# 2. Run the interactive setup script
./scripts/setup.sh

# 3. Start all apps in parallel
pnpm dev
```

The setup script will:
- Verify all prerequisites
- Install all workspace dependencies
- Run the core package test suite
- Create `.env.local` files with placeholder configuration

### Manual Setup

```bash
pnpm install          # Install all workspace dependencies
pnpm test             # Run all unit tests (33 tests)
pnpm build            # Build all packages and apps
pnpm dev              # Start dev servers for all apps
```

### Access the Apps

| App | Dev URL | Description |
|-----|---------|-------------|
| Dashboard | http://localhost:3000 | AI Self-Development Dashboard |
| Docs | http://localhost:5173 | VitePress Documentation Site |

### Enable the AI Mentor

Add your OpenAI API key to `apps/dashboard/.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

> Without an API key, the chat interface falls back to static Hill quotations.
>
> For the static GitHub Pages deployment, set `NEXT_PUBLIC_CHAT_API_URL` to a hosted chat endpoint if you want live AI responses there. Otherwise the deployed dashboard keeps the mentor in offline fallback mode.

---

## The 13 Steps to Riches

| # | Principle | Category |
|---|-----------|----------|
| 1 | **Desire** -- The starting point of all achievement | Foundation |
| 2 | **Faith** -- Visualization and belief in attainment | Mental |
| 3 | **Auto-Suggestion** -- Programming the subconscious | Mental |
| 4 | **Specialized Knowledge** -- Organized knowledge = power | Foundation |
| 5 | **Imagination** -- The workshop of the mind | Mental |
| 6 | **Organized Planning** -- Desire crystallized into action | Planning |
| 7 | **Decision** -- Mastery of procrastination | Execution |
| 8 | **Persistence** -- The "three feet from gold" principle | Execution |
| 9 | **Power of the Master Mind** -- Compound intelligence | Planning |
| 10 | **Sex Transmutation** -- Redirecting creative energy | Mastery |
| 11 | **The Subconscious Mind** -- The connecting link | Mastery |
| 12 | **The Brain** -- Broadcasting station for thought | Mastery |
| 13 | **The Sixth Sense** -- Door to Infinite Intelligence | Mastery |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces + Turborepo |
| Core | TypeScript 5 (ESM), Vitest |
| Dashboard | Next.js 15, React 19, CSS Modules |
| AI | OpenAI API (GPT-4o-mini) |
| Docs | VitePress 1.x, Mermaid.js |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages (static export) |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feat/your-feature`
3. **Install dependencies**: `pnpm install`
4. **Make your changes** and add tests
5. **Verify**: `pnpm test && pnpm typecheck`
6. **Submit a PR** with a clear description

### Issue Types

| Template | Use For |
|----------|---------|
| [Bug Report](https://github.com/DaScient/Think-and-Grow-Rich/issues/new?template=bug_report.yml) | Reproducible problems |
| [Feature Request](https://github.com/DaScient/Think-and-Grow-Rich/issues/new?template=feature_request.yml) | New capabilities |
| [Technical Debt](https://github.com/DaScient/Think-and-Grow-Rich/issues/new?template=technical_debt.yml) | Refactoring and code quality |

### Scripts Reference

```bash
pnpm build          # Build all packages
pnpm dev            # Start all apps in watch mode
pnpm test           # Run all unit tests
pnpm typecheck      # TypeScript type checking
pnpm format         # Prettier formatting
pnpm clean          # Remove all build artifacts
```

---

## CI/CD Pipeline

Every push to `main` triggers:

```
Lint + TypeCheck -> Unit Tests -> Build -> Deploy to GitHub Pages
```

Deployment produces:
- `https://dascient.github.io/Think-and-Grow-Rich/` -- VitePress documentation
- `https://dascient.github.io/Think-and-Grow-Rich/dashboard/` -- Next.js dashboard

---

## License

Released under the [MIT License](./LICENSE).

---

<div align="center">

Built with ◈ by [DaScient](https://github.com/DaScient)

*"Three feet from gold." -- Never quit.*

</div>
