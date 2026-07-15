# AI Demo Prep Pipeline

An AI-powered tool that turns public company context and live platform data into customer-specific demo agents, talk tracks, and bench-ready demo environments — cutting enterprise demo prep from days to minutes.

## The Problem

Enterprise software demos are high-stakes and high-effort. Before a prospect meeting, a solutions consultant typically spends **3–5 days** manually:

- Researching the account (10-Ks, earnings, org structure, tooling)
- Hand-crafting AI agent prompts tailored to that company's language and pain
- Wiring those agents to real board/portfolio data in a demo tenant
- Writing a presenter script with transitions and business-value callouts

Most of that work is repetitive, fragile, and hard to reuse. The result is demos that either feel generic or take too long to build.

## The Solution

This app is a guided, eight-step pipeline that:

1. Captures **company context** and demo objectives (or uses fictional prefills for local testing)
2. Optionally pulls **live work-management / portfolio data** from a target tenant
3. Loads capability docs that teach the LLM what the target AI assistant can and cannot do
4. Runs a **two-pass LLM pipeline** — plan first, then full agent generation after human review
5. Emits **copy-paste-ready agents** plus a presenter **demo script**

Public company context (filings, org patterns, industry language) replaces the need for confidential customer-provided data during demo prep.

## Architecture

```
Discovery inputs
  → Company context + objectives (+ optional reference files)
  → Live board / portfolio context (optional)
  → Capability library (what the AI assistant can do)
  → LLM Pass 1: demo plan (agent names, purposes, key actions)
  → Human review (toggle agents, notes, strategy)
  → LLM Pass 2: full executable agents grounded in live IDs
  → Demo script generation
  → Bench test → Deliver
```

**Pass 1** optimizes for structure and reviewability. **Pass 2** optimizes for executable specificity (board IDs, card types, lane names, portfolio hierarchy). Separating them keeps humans in the loop before expensive, detailed generation.

Optional MCP / API proxy layers keep platform tokens server-side (Vercel serverless routes under `/api/*`).

## Tech Stack

| Layer | Choice |
|-------|--------|
| UI | React 18 + Vite |
| Styling | Tailwind CSS |
| State | Zustand (persisted where useful) |
| Animation | Framer Motion |
| Markdown | react-markdown |
| Hosting | Vercel (static SPA + serverless proxies) |
| LLM | Claude via a chat-completions-compatible API |
| Platform I/O | Serverless proxies for work boards + portfolio OData |

## Key Design Decisions

- **Two LLM passes instead of one** — Plans are cheap to review and revise. Full agents are large and brittle; generating them only after approval saves tokens and avoids regenerating junk.
- **Zustand over Redux** — Small surface area, no boilerplate, easy persistence for connection prefs and library selection. Enough structure without ceremony.
- **Server-side proxies for credentials** — API keys for the LLM and demo tenants stay in env vars / serverless handlers, not the client bundle.
- **Capability docs as context** — Shipping limitation + capability markdown into the prompt makes generation respect real platform constraints instead of inventing tools.
- **Public context over private data** — Demos are built from narrative company context and tenant demo data, not confidential customer exports.

## Setup

### Prerequisites

- Node 18+
- An LLM API key (chat-completions compatible)
- Optional: credentials for a demo work-management / portfolio tenant

### Local development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### Environment variables

**Client (Vite)** — never put secrets in `VITE_*` vars:

```bash
VITE_FALCON_API_URL=https://your-instance.example.com/api/v1/chat/completions
VITE_FALCON_MODEL=your-model-id
VITE_PROXY_URL=http://localhost:3000
VITE_PORTFOLIOS_HOST_TEMPLATE=https://demo{instance}.example.com
```

**Server (Vercel / local serverless)** — secrets stay here:

```bash
FALCON_API_KEY=your-key-here
FALCON_API_URL=https://your-instance.example.com/api/v1/chat/completions
PORTFOLIOS_HOST_TEMPLATE=https://demo{instance}.example.com
PORTFOLIOS_ODATA_USER=
PORTFOLIOS_ODATA_PASSWORD=
```

In local dev, you can also paste an LLM API key in the in-app Settings panel (stored in `localStorage` only on your machine).

### Production

```bash
npm run build
```

Deploy the `dist/` output plus `/api/*` serverless functions to Vercel. Set the server env vars in the Vercel project settings — do not commit them.

## Project structure

```
src/
├── stores/          # Zustand state
├── services/        # LLM client, payload builders, parsers, validation
├── components/      # Layout, 8-step wizard, plan review, agents, script
├── config/          # Prompts + capability markdown
├── hooks/           # Pass 1 / Pass 2 orchestration
└── utils/           # Storage helpers, estimators
api/
├── falcon.js        # LLM proxy (key server-side)
├── proxy.js         # Work-board API CORS proxy
└── portfolios.js    # Portfolio OData proxy
```

## Background

Built while supporting a presales / solutions consulting team that needed faster, more customer-specific AI demos. The goal was to productize the pattern of "research → plan → generate → bench" so consultants could ship higher-quality demos without writing prompts from scratch every time.

Qualitative impact: same-day demo turnaround for standard account prep, consistent agent quality across the team, and a repeatable human-in-the-loop review step before anything touched a demo tenant.

---

Built as a portfolio project documenting AI-assisted enterprise demo preparation.
