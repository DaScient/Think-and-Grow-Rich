# Contributing to Think & Grow Rich

## Getting Started

### Prerequisites

| Tool | Minimum Version | Install |
|------|----------------|---------|
| Node.js | 20.x | [nodejs.org](https://nodejs.org) |
| pnpm | 9.x | `npm install -g pnpm` |
| Git | 2.40+ | [git-scm.com](https://git-scm.com) |

### Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/Think-and-Grow-Rich.git
cd Think-and-Grow-Rich

# 2. Run the setup script (installs deps, validates environment)
./scripts/setup.sh

# 3. Start all apps in dev mode
pnpm dev
```

### Services

| App | URL | Description |
|-----|-----|-------------|
| Dashboard | http://localhost:3000 | Next.js AI Dashboard |
| Docs | http://localhost:5173 | VitePress documentation |

## Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feat/your-feature-name
```

### Running Tests

```bash
# All tests
pnpm test

# Watch mode (core package)
cd packages/core && pnpm test:watch

# With coverage
cd packages/core && pnpm test:coverage
```

### Linting

```bash
pnpm lint
pnpm typecheck
```

## Submitting a Pull Request

1. Ensure all tests pass: `pnpm test`
2. Ensure linting passes: `pnpm lint && pnpm typecheck`
3. Write a clear PR description using the provided template
4. Reference any related issues with `Closes #123`

## Issue Templates

Use the GitHub Issue Templates for:
- 🐛 **Bug Report** — reproducible problems
- ✨ **Feature Request** — new capabilities
- ⚙ **Technical Debt** — refactoring and code quality improvements
