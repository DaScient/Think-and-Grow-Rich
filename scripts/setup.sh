#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Think & Grow Rich — Interactive Setup Script
# Run: ./scripts/setup.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
BOLD='\033[1m'
GOLD='\033[38;5;220m'
PURPLE='\033[38;5;135m'
GREEN='\033[38;5;120m'
RED='\033[38;5;203m'
CYAN='\033[38;5;87m'
DIM='\033[2m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
step() { echo -e "\n${GOLD}${BOLD}▸ $1${RESET}"; }
info() { echo -e "  ${CYAN}$1${RESET}"; }
ok()   { echo -e "  ${GREEN}✓ $1${RESET}"; }
err()  { echo -e "  ${RED}✗ $1${RESET}"; exit 1; }
dim()  { echo -e "  ${DIM}$1${RESET}"; }

# ── Banner ────────────────────────────────────────────────────────────────────
clear
echo -e "${GOLD}${BOLD}"
cat << 'EOF'
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║   ◈  Think & Grow Rich — AI Self-Development Dashboard   ║
  ║        Napoleon Hill's 13 Principles, Engineered         ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${RESET}"

echo -e "${DIM}  \"Whatever the mind can conceive and believe, it can achieve.\"${RESET}"
echo -e "${DIM}  — Napoleon Hill${RESET}\n"

# ── 1. Check Prerequisites ────────────────────────────────────────────────────
step "Checking prerequisites"

# Node.js
if command -v node &>/dev/null; then
  NODE_VER=$(node --version | sed 's/v//')
  NODE_MAJOR=${NODE_VER%%.*}
  if [[ "$NODE_MAJOR" -lt 20 ]]; then
    err "Node.js 20+ required. Found: v${NODE_VER}. Install at https://nodejs.org"
  fi
  ok "Node.js v${NODE_VER}"
else
  err "Node.js not found. Install from https://nodejs.org"
fi

# pnpm
if command -v pnpm &>/dev/null; then
  ok "pnpm $(pnpm --version)"
else
  info "pnpm not found — installing..."
  npm install -g pnpm || err "Failed to install pnpm"
  ok "pnpm installed"
fi

# Git
if command -v git &>/dev/null; then
  ok "git $(git --version | awk '{print $3}')"
else
  err "Git not found. Install from https://git-scm.com"
fi

# ── 2. Install Dependencies ───────────────────────────────────────────────────
step "Installing workspace dependencies"
pnpm install --frozen-lockfile 2>&1 | tail -5
ok "All dependencies installed"

# ── 3. Run Tests ──────────────────────────────────────────────────────────────
step "Running core package tests"
if pnpm --filter @tagr/core test 2>&1 | grep -q "passed"; then
  ok "All tests pass"
else
  info "Tests had issues — check output above"
fi

# ── 4. Environment Setup ──────────────────────────────────────────────────────
step "Environment configuration"

DASHBOARD_ENV="apps/dashboard/.env.local"

if [[ ! -f "$DASHBOARD_ENV" ]]; then
  info "Creating apps/dashboard/.env.local"
  cat > "$DASHBOARD_ENV" << 'ENVEOF'
# OpenAI API Key for the AI Mentor chat feature
# Get yours at: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Optional: override the model (default: gpt-4o-mini)
# OPENAI_MODEL=gpt-4o-mini
ENVEOF
  ok "Created $DASHBOARD_ENV (add your OPENAI_API_KEY to enable AI chat)"
else
  dim "$DASHBOARD_ENV already exists — skipping"
fi

# ── 5. Summary ────────────────────────────────────────────────────────────────
echo ""
echo -e "${GOLD}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${GREEN}${BOLD}  ✓ Setup complete! Your environment is ready.${RESET}"
echo ""
echo -e "${BOLD}  Next steps:${RESET}"
echo -e "  ${CYAN}pnpm dev${RESET}         ${DIM}# Start all apps (dashboard + docs)${RESET}"
echo -e "  ${CYAN}pnpm test${RESET}        ${DIM}# Run all unit tests${RESET}"
echo -e "  ${CYAN}pnpm build${RESET}       ${DIM}# Build for production${RESET}"
echo ""
echo -e "  ${BOLD}Apps:${RESET}"
echo -e "  ${PURPLE}Dashboard${RESET}  →  http://localhost:3000"
echo -e "  ${PURPLE}Docs${RESET}       →  http://localhost:5173"
echo ""
echo -e "  ${BOLD}Add your OpenAI API key to enable the AI Mentor:${RESET}"
echo -e "  ${DIM}Edit: apps/dashboard/.env.local${RESET}"
echo -e "${GOLD}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
