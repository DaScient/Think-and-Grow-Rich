# Architecture Overview

The Think & Grow Rich project is built as a **pnpm monorepo** orchestrated by Turborepo, containing two applications and one shared package.

## High-Level System Diagram

```mermaid
graph TB
    subgraph Monorepo["Think-and-Grow-Rich Monorepo"]
        Core["📦 @tagr/core<br/>TypeScript Library<br/>13 Principles Engine<br/>Agent Logic<br/>Types"]
        Dashboard["🖥 @tagr/dashboard<br/>Next.js 15 App<br/>React UI<br/>AI Chat Frontend"]
        Docs["📖 @tagr/docs<br/>VitePress Site<br/>Mermaid Diagrams<br/>Architecture Docs"]
    end

    subgraph CI["GitHub Actions CI/CD"]
        Lint["ESLint + TypeCheck"]
        Test["Vitest Unit Tests"]
        Build["Turbo Build"]
        Deploy["GitHub Pages Deploy"]
    end

    subgraph External["External Services"]
        OpenAI["OpenAI API<br/>(GPT-4o)"]
        GHPages["GitHub Pages"]
    end

    Core --> Dashboard
    Core --> Docs
    Dashboard --> OpenAI
    Lint --> Test --> Build --> Deploy
    Build --> GHPages

    style Core fill:#7c5cfc,color:#fff
    style Dashboard fill:#22d3a0,color:#000
    style Docs fill:#f59e0b,color:#000
```

## Data Flow: AI Chat

```mermaid
sequenceDiagram
    participant User
    participant Dashboard as Next.js Dashboard
    participant Core as @tagr/core
    participant API as /api/chat
    participant OpenAI as OpenAI GPT-4o

    User->>Dashboard: Types message
    Dashboard->>Core: buildSystemMessage(context)
    Core-->>Dashboard: Personalized system prompt
    Dashboard->>API: POST {messages, model}
    API->>OpenAI: Chat completion request
    OpenAI-->>API: Streaming response
    API-->>Dashboard: JSON {content}
    Dashboard->>Core: createAssistantMessage(content)
    Core-->>Dashboard: Message object
    Dashboard-->>User: Renders response
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Monorepo | pnpm workspaces + Turborepo | Dependency management, build caching |
| Core Logic | TypeScript (ESM) | 13 Principles engine, type safety |
| Dashboard | Next.js 15 + React 19 | Interactive UI, static export |
| AI Chat | OpenAI API (GPT-4o) | Agentic mentor responses |
| Documentation | VitePress + Mermaid | Docs-as-code |
| Testing | Vitest | Unit tests for core package |
| CI/CD | GitHub Actions | Lint, test, build, deploy |
| Hosting | GitHub Pages | Static hosting |

## Build Pipeline

```mermaid
flowchart LR
    Push[Git Push] --> Trigger[CI Triggered]
    Trigger --> Checkout[Checkout Code]
    Checkout --> Install[pnpm install]
    Install --> Lint[pnpm lint]
    Lint --> Test[pnpm test]
    Test --> Build[pnpm build]
    Build --> DeployDocs[Deploy Docs → GitHub Pages]
    Build --> DeployDash[Deploy Dashboard → GitHub Pages]

    style Push fill:#2a2a3a
    style DeployDocs fill:#22d3a0,color:#000
    style DeployDash fill:#22d3a0,color:#000
```
