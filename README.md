# Anvi Agent Builder

A modern React application that generates AI-powered demo agents for Planview AgilePlace and Portfolios demonstrations. Built for Solution Consultants to rapidly create compelling, context-aware demos without deep technical expertise.

## What It Does

1. **Capture context** — Company details, demo objectives, supporting files, live board data
2. **Generate a plan** — Falcon AI analyzes your context and proposes a sequence of demo agents
3. **Review & customize** — Toggle agents on/off, add notes, adjust the strategy
4. **Generate agents** — Each agent contains copy-paste Anvi chat prompts with real board IDs, card types, and lane references
5. **Present with confidence** — Auto-generated demo script with talk track, business value callouts, and transitions

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS (custom Planview dark theme) |
| State | Zustand |
| Animation | Framer Motion |
| Font | Inter |
| Hosting | Vercel (static + serverless proxy) |

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

### AgilePlace Proxy (Local Dev)

For local development, the proxy server forwards API calls to AgilePlace:

```bash
node proxy-server.js
```

Proxy runs at `http://localhost:3000`

In production (Vercel), the proxy is handled by `/api/proxy.js` serverless function — no local proxy needed.

### Falcon AI Key

Set your Falcon AI API key in the Settings panel (gear icon), or via browser console:

```js
localStorage.setItem('anvi-falcon-api-key', 'your-key-here')
```

## Architecture

```
src/
├── stores/          # Zustand state (connection, context, board, plan, results, UI)
├── services/        # Pure functions (Falcon AI, AgilePlace API, payload builder, parsers)
├── components/      # React components (37 total)
│   ├── layout/      # Header, Sidebar, StepNav
│   ├── steps/       # 8-step wizard (Steps 1-8)
│   ├── plan-review/ # Agent cards, detail panel, strategy notes
│   ├── agents/      # Generated agent display
│   ├── script/      # Demo script sections, callouts
│   ├── connection/  # Connection modal, status chip
│   └── shared/      # Buttons, toggles, file upload, loading states
├── config/          # Prompts, settings, capability files
│   └── capabilities/  # Anvi capability docs (AgilePlace, Portfolios)
└── utils/           # Token estimator, file reader, helpers
```

## 8-Step Workflow

1. **Demo Context** — Describe the company, product, and audience
2. **Supporting Files** — Upload RFPs, workflow guides, org charts
3. **Planview Live Data** — Connect to AgilePlace, select boards
4. **Anvi Context** — Select Anvi capability files (AgilePlace / Portfolios)
5. **Review & Send** — Review payload, send to Falcon AI (Pass 1)
6. **Plan Review** — Review proposed agents, toggle, add notes, approve
7. **Generated Agents** — Copy-paste ready Anvi chat prompts (Pass 2)
8. **Demo Script** — Presenter talk track with transitions and callouts

## Key Concepts

**Context-primacy architecture** — The same company gets different demos based on uploaded materials, not generic industry templates. Board IDs, card types, and lane structures drive agent generation.

**Two-pass generation** — Pass 1 generates a plan (agent names + purposes). The SC reviews and customizes. Pass 2 generates full executable agents based on the approved plan.

**Capability-agnostic** — AgilePlace capability files produce card-creation agents. Portfolios capability files produce query/analysis agents. The system adapts to whatever capabilities are loaded.

## Deployment

Hosted on Vercel. Push to `main` triggers auto-deploy.

```bash
git add .
git commit -m "your message"
git push
```

## Environment

| Service | URL |
|---------|-----|
| Falcon AI | `https://falconai.planview-prod.io/api/v1/chat/completions` |
| Model | `us.anthropic.claude-sonnet-4-5-20250929-v1:0` |
| AgilePlace | Via `/api/proxy` serverless function |

---

Built with 🏍️ by the Planview SC team.
