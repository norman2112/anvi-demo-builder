# Anvi Agent Builder — React Migration Architecture

## Overview

Migrate the Anvi Agent Builder from a single 7500-line HTML file to a React SPA. The Claude MCP Prompt workspace and all associated code is being dropped entirely — only the Anvi Agent Builder flow carries forward.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18+ (Vite) | Fast builds, simple config, static output for GitHub Pages |
| Styling | Tailwind CSS + custom Planview theme | Utility-first, dark theme native, no CSS files to manage |
| Components | shadcn/ui (Radix primitives) | Copy-paste components, dark mode, accessible |
| Animation | Framer Motion | Page transitions, card reveals, scroll animations |
| State | Zustand | Lightweight, no boilerplate, perfect for this scale |
| Toasts | Sonner | Clean notifications for copy/save/error feedback |
| Command | CMDK | ⌘K palette for power users (stretch goal) |
| Hosting | GitHub Pages via `gh-pages` | Zero infrastructure, one-command deploy |

---

## Tailwind Theme (Planview Palette)

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary
        'pv-red': '#B60001',
        'scarlet': '#780009',
        'flash-red': '#E2251B',
        'steel-blue': '#6A94AA',

        // Secondary
        'pv-black': '#000000',
        'charcoal': '#1E1E1E',
        'stone': '#333232',
        'primer': '#474746',
        'concrete': '#686868',
        'ash': '#CCCCCC',

        // CTA
        'cta-steel': '#527A8E',
        'cta-steel-hover': '#4A7082',
        'cta-ice': '#9EBAC7',
        'cta-ice-hover': '#ABC2CF',

        // Charting / Accent
        'pv-gold': '#FFAC47',
        'pv-blue': '#023779',
        'pv-grass': '#09AA61',
        'pv-turquoise': '#12D8E2',
        'pv-violet': '#451F55',

        // Neutrals
        'grey': '#D6D6D6',
        'med-grey': '#DFDEDD',
        'light-grey': '#EBEBEB',
        'not-white': '#F5F5F5',
      }
    }
  }
}
```

---

## File Structure

```
src/
├── App.jsx                     # Root layout + routing (no react-router needed, single page)
├── main.jsx                    # Vite entry
├── index.css                   # Tailwind imports + global dark styles
│
├── stores/
│   ├── connectionStore.js      # AgilePlace connection state (url, token, boards, discoveredData)
│   ├── contextStore.js         # Company context, objectives, ref files, custom instructions
│   ├── boardStore.js           # Selected boards, card types, lanes (derived from connection)
│   ├── libraryStore.js         # Context library files (capabilities, limitations, planview.me)
│   ├── planStore.js            # Plan review state (Pass 1 response, agent decisions, SC notes)
│   ├── resultsStore.js         # Generated agents, demo script, validation (Pass 2 response)
│   └── uiStore.js              # Current step, active tab, tips visible, sidebar state
│
├── config/
│   ├── settings.json           # Falcon AI endpoint, model, defaults
│   ├── falcon-plan-prompt.md   # Pass 1 plan mode instructions
│   ├── falcon-gen-prompt.md    # Pass 2 full generation instructions (base)
│   └── capabilities/           # Stored markdown capability files
│       ├── ANVI_CAPABILITIES_v1.0.md
│       ├── ANVI_LIMITATIONS_v1.0.md
│       └── ANVI_KNOWLEDGE_PLANVIEW_ME_v1.0.md
│
├── services/
│   ├── falconAI.js             # Falcon AI API calls (plan + generate)
│   ├── agileplace.js           # AgilePlace API via proxy (discover, boards, cards)
│   ├── payloadBuilder.js       # Build context payload from all inputs
│   ├── pass2Builder.js         # Build Pass 2 payload from approved plan + notes
│   ├── validation.js           # Validate Falcon AI responses (agent format, IDs)
│   ├── agentParser.js          # Parse agent configs from response text
│   ├── scriptGenerator.js      # Generate demo script from agents + context
│   └── proxy.js                # Proxy server fetch wrapper (localhost:3000)
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx          # App logo, connection chip, tips toggle, settings gear
│   │   ├── Sidebar.jsx         # Stepper, payload preview, validation, token count
│   │   └── StepNav.jsx         # Back / Continue / Generate buttons
│   │
│   ├── connection/
│   │   ├── ConnectionModal.jsx # URL + token form, connect button, status
│   │   └── ConnectionChip.jsx  # Header connection status indicator
│   │
│   ├── steps/
│   │   ├── Step1_CompanyContext.jsx    # Company context + demo objectives textareas
│   │   ├── Step2_ReferenceFiles.jsx   # File upload (PDF, DOCX, TXT, MD, images)
│   │   ├── Step3_LiveData.jsx         # Board selection + live data toggle
│   │   ├── Step4_ContextLibrary.jsx   # Capability files + custom instructions
│   │   ├── Step5_Review.jsx           # Summary of all inputs + live payload preview
│   │   └── Step6_Results.jsx          # Results container with tab switching
│   │
│   ├── results/
│   │   ├── ResultsTabs.jsx            # Tab bar (Payload | Plan Review | Generated Agents | Demo Script)
│   │   ├── PayloadTab.jsx             # Raw payload display
│   │   ├── PlanReviewTab.jsx          # Interactive plan review (toggles, notes, add agent)
│   │   ├── GeneratedAgentsTab.jsx     # Agent cards with copy buttons (output styling)
│   │   ├── DemoScriptTab.jsx          # Presenter script (teleprompter styling)
│   │   └── StatsBar.jsx               # Shared stats bar (agent count, ops, time)
│   │
│   ├── plan-review/
│   │   ├── PlanAgentCard.jsx          # Single agent in plan review (toggle, notes, expand)
│   │   ├── AddedAgentCard.jsx         # SC-added agent card
│   │   ├── StrategyNotes.jsx          # Global strategy notes textarea
│   │   └── PlanActions.jsx            # Approve & Generate / Regenerate / Back buttons
│   │
│   ├── agents/
│   │   ├── AgentCard.jsx              # Output agent card (collapsed, expandable, copy button)
│   │   ├── AgentInstructions.jsx      # Monospace code block with ID highlighting
│   │   └── AgentTypePill.jsx          # Colored type badge (Create, Link, Risk, OKR)
│   │
│   ├── script/
│   │   ├── ScriptSection.jsx          # Single script section (opening, agent, closing)
│   │   ├── CalloutBox.jsx             # 💡 Business value / call out highlight box
│   │   └── ScriptActions.jsx          # Copy full script / download / print buttons
│   │
│   └── shared/
│       ├── FileUpload.jsx             # Drag & drop file upload zone
│       ├── ToggleSwitch.jsx           # Styled toggle (tips, live data)
│       ├── LoadingBar.jsx             # Falcon AI loading indicator
│       └── CopyButton.jsx            # Copy to clipboard with "Copied!" feedback
│
└── utils/
    ├── escapeHtml.js
    ├── tokenEstimator.js       # Rough token count for payload preview
    └── fileReader.js           # Read uploaded files as text/base64
```

---

## State Architecture (Zustand)

### connectionStore
```js
{
  url: '',
  token: '',
  isConnected: false,
  boards: [],           // Full board objects with details (cardTypes, lanes, cardCount)
  connect: async () => {},
  disconnect: () => {},
}
```

### contextStore
```js
{
  companyContext: '',     // Textarea value
  demoObjectives: '',    // Textarea value
  refFiles: [],          // { id, name, size, type, content (text or base64) }
  customInstructions: '',
  setCompanyContext: (val) => {},
  setDemoObjectives: (val) => {},
  addRefFile: (file) => {},
  removeRefFile: (id) => {},
  setCustomInstructions: (val) => {},
}
```

### boardStore
```js
{
  selectedBoardIds: new Set(),
  toggleBoard: (id) => {},
  getSelectedBoards: () => [],  // Derived from connectionStore.boards
}
```

### libraryStore
```js
{
  files: {},            // { [id]: { name, content, required, selected, lastUpdated } }
  loadDefaults: () => {},
  toggleFile: (id) => {},
  addFile: (file) => {},
  deleteFile: (id) => {},
}
```

### planStore
```js
{
  originalPlan: null,           // PlanResponse from Pass 1
  strategyNotes: '',
  agentDecisions: [],           // { agent_number, included, notes, sort_order }
  addedAgents: [],              // { id, name, description, sort_order }
  isLoading: false,

  // Actions
  initFromPlan: (plan) => {},
  toggleAgent: (agentNumber) => {},
  setAgentNotes: (agentNumber, notes) => {},
  setStrategyNotes: (notes) => {},
  addAgent: (name, description) => {},
  removeAddedAgent: (id) => {},
  getApprovedAgents: () => [],
  getExcludedAgents: () => [],
}
```

### resultsStore
```js
{
  agents: [],                   // Parsed agent configs from Pass 2
  validation: null,             // Validation result
  demoScript: null,             // Generated script object
  isLoading: false,
  error: null,

  setAgents: (agents, validation) => {},
  setDemoScript: (script) => {},
}
```

### uiStore
```js
{
  currentStep: 1,               // 1-6
  activeResultsTab: 'plan',     // 'payload' | 'plan' | 'agents' | 'script'
  tipsVisible: true,
  sidebarCollapsed: false,

  setStep: (step) => {},
  setResultsTab: (tab) => {},
  toggleTips: () => {},
}
```

---

## Data Flow

```
Step 1-4: User fills inputs
    → contextStore, boardStore, libraryStore updated in real-time
    → Sidebar shows live payload preview + validation

Step 5: Review
    → payloadBuilder.js assembles full payload from all stores
    → Preview rendered in review panel

Step 5 → "Send to Falcon AI":
    → falconAI.fetchPlan(payload + planPrompt)
    → Response parsed → planStore.initFromPlan(plan)
    → Navigate to Step 6, Plan Review tab

Plan Review tab:
    → SC toggles agents, adds notes
    → planStore updated in real-time
    → Stats bar recalculates

"Approve & Generate":
    → pass2Builder.js assembles Pass 2 payload (original context + approved plan + SC notes)
    → falconAI.generate(pass2Payload)
    → agentParser.parseAgentConfigs(response)
    → validation.validateResponse(response)
    → resultsStore.setAgents(agents, validation)
    → scriptGenerator.generateDemoScript(agents, context, validation)
    → resultsStore.setDemoScript(script)
    → Switch to Generated Agents tab
```

---

## What's Being Dropped (from HTML prototype)

### Claude MCP Prompt Workspace (entire section)
- `claude-workspace` div and all contents (~400 lines of HTML)
- `selectWorkspace()`, `showWorkspaceSwitcher()` functions
- Workspace switcher grid, workspace cards, workspace pills
- `generatePrompt()` — the Claude MCP prompt builder
- All form fields inside `claude-workspace`: company name, industry, demo persona, board strategy radio buttons, card type rename/remove/level UI, work hierarchy volume controls, OKR paste fields, realism settings (status distribution, dependencies, financial planning, resource planning), tags & metadata, execution preferences
- `collectFormData()`, `saveConfig()`, `loadConfig()`, `applyFormData()` — config save/load for Claude workspace
- `refreshCardTypes()`, `refreshDemoDataDropdowns()`, `getLevelAssignments()`, `getNewCardTypes()`, `getCardTypeMappings()` — Claude workspace form helpers
- `toggleBoardDetails()`, `toggleFinancial()`, `toggleResource()`, `updateCardEstimate()`, `updateStatusTotal()` — Claude workspace UI toggles
- `applyCardTypeMappings()`, `applyNewCardTypes()` — config restore helpers
- Header link to "Claude MCP Prompt"
- `currentWorkspacePill`, `currentWorkspaceLabel` workspace switching UI

### Dead / Unused Code
- `workspace-card` CSS and card selection UI (workspace switcher is bypassed — auto-selects Anvi)
- `pendingLoadConfig` and config file load/save flow (Claude workspace only)
- `getAvailableCardTypes()` (Claude workspace form helper)
- `populateForm()` — populates Claude workspace board list (Anvi has its own `populateAnviBoardList`)
- `startOver()` — resets Claude workspace form
- `renderAnviCapabilities()`, `saveAnviCapabilities()`, `loadAnviCapabilitiesFromStorage()` — old capability system (replaced by context library)
- `addAnviCapability()`, `parseMarkdownCapabilities()`, `handleAnviFileUpload()` — old capability file parsing

### What Stays (port to React)
Everything in the Anvi workspace flow:
- Connection modal + proxy fetch + board discovery
- 6-step stepper with sidebar
- Company context + demo objectives (Step 1)
- Reference file upload (Step 2)
- Live data sources / board selection (Step 3)
- Context library + custom instructions (Step 4)
- Review + payload preview (Step 5)
- Results: Payload tab, Plan Review tab, Generated Agents tab, Demo Script tab (Step 6)
- Falcon AI integration (Pass 1 plan, Pass 2 generation)
- Plan review state management (toggle, notes, add agent, approve)
- Agent parsing, validation, display
- Demo script generation + rendering
- Copy/download functionality

---

## Component Migration Map

| HTML Section | React Component | Notes |
|---|---|---|
| `header` + connection chip | `Header.jsx` + `ConnectionChip.jsx` | Drop workspace switcher |
| `connectionSection` modal | `ConnectionModal.jsx` | Keep as-is |
| `anvi-sidebar` | `Sidebar.jsx` | Stepper + preview + validation |
| `anviStepPanel1` | `Step1_CompanyContext.jsx` | Two textareas |
| `anviStepPanel2` | `Step2_ReferenceFiles.jsx` | File upload zone |
| `anviStepPanel3` | `Step3_LiveData.jsx` | Board list with toggle |
| `anviStepPanel4` + custom instructions | `Step4_ContextLibrary.jsx` | Files + collapsible instructions |
| `anviStepPanel5` | `Step5_Review.jsx` | Summary cards + payload preview |
| `anviStepPanel6` | `Step6_Results.jsx` + results/* | Tab container |
| `resultsPlanReviewPanel` | `PlanReviewTab.jsx` + plan-review/* | Interactive review |
| `resultsGeneratedAgentsPanel` | `GeneratedAgentsTab.jsx` + agents/* | Output display (redesigned) |
| `demoScriptPanel` | `DemoScriptTab.jsx` + script/* | Teleprompter style (redesigned) |
| `anvi-step-nav` | `StepNav.jsx` | Back / Continue / Generate |

---

## Key Functions Migration Map

| HTML Function | React Location | Notes |
|---|---|---|
| `proxyFetch()` | `services/proxy.js` | Unchanged |
| `discoverEnvironment()` | `services/agileplace.js` | Returns data, store handles state |
| `populateAnviBoardList()` | `Step3_LiveData.jsx` | Renders from boardStore |
| `generateAnviContextPayload()` | `services/payloadBuilder.js` | Pure function, no DOM |
| `buildPlanRequestPayload()` | `services/payloadBuilder.js` | Appends plan instructions |
| `fetchPlanFromFalcon()` | `services/falconAI.js` → `fetchPlan()` | Returns parsed plan |
| `parsePlanResponse()` | `services/falconAI.js` | JSON extraction |
| `normalizePlan()` | `services/falconAI.js` | Field normalization |
| `initPlanReviewStateFromPlan()` | `planStore.initFromPlan()` | Zustand action |
| `renderPlanReviewUI()` | `PlanReviewTab.jsx` | React renders from store |
| `updatePlanReviewSelections()` | `planStore` actions | Direct state updates |
| `buildPass2Payload()` | `services/pass2Builder.js` | Pure function |
| `runPass2Generate()` | `services/falconAI.js` → `generateAgents()` | Returns raw text |
| `generateWithFalconAI()` | `services/falconAI.js` → `generateAgents()` | Consolidated |
| `validateFalconAIResponse()` | `services/validation.js` | Pure function |
| `parseAgentConfigs()` | `services/agentParser.js` | Pure function |
| `generateDemoScript()` | `services/scriptGenerator.js` | Pure function + all helpers |
| `displayGeneratedAgents()` | `GeneratedAgentsTab.jsx` | React renders from store |
| `switchResultsTab()` | `uiStore.setResultsTab()` | State-driven tab switching |
| `highlightInstructionsForIds()` | `agents/AgentInstructions.jsx` | Inline highlighting |
| `copyAgentToClipboard()` | `shared/CopyButton.jsx` | Reusable component |
| `downloadAllAgents()` | `GeneratedAgentsTab.jsx` | Keep as utility |
| `getDemoScriptMarkdown()` | `services/scriptGenerator.js` | Export function |

---

## Migration Order

### Phase 1: Scaffold (Day 1)
1. `npm create vite@latest anvi-agent-builder -- --template react`
2. Install deps: `tailwind`, `zustand`, `framer-motion`, `sonner`
3. Configure `tailwind.config.js` with Planview theme
4. Create file structure (empty shells)
5. Get dark shell rendering with Header component

### Phase 2: Core Stores + Services (Day 1-2)
1. Port `connectionStore` + `proxy.js` + `agileplace.js`
2. Port `contextStore`, `boardStore`, `libraryStore`
3. Port `payloadBuilder.js` (the big pure function)
4. Port `falconAI.js` (plan + generate calls)
5. Verify stores work with console logging

### Phase 3: Stepper Flow (Day 2-3)
1. Build `Sidebar.jsx` with stepper + validation
2. Build Steps 1-5 components
3. Wire up to stores
4. Verify payload preview works end-to-end

### Phase 4: Falcon AI + Plan Review (Day 3-4)
1. Port `planStore` + `pass2Builder.js`
2. Build `PlanReviewTab.jsx` with toggle/notes/add agent
3. Wire up Approve & Generate flow
4. Test full Pass 1 → Review → Pass 2 cycle

### Phase 5: Results Display — Redesigned (Day 4-5)
1. Build `GeneratedAgentsTab.jsx` with new visual treatment
   - Agent number badges, type pills, collapsed-by-default
   - Monospace code blocks with ID highlighting
   - Copy per agent + Copy All
2. Build `DemoScriptTab.jsx` with teleprompter design
   - Larger font, warmer tone, callout boxes
   - Color-coded sections per agent
   - Copy full script + download
3. Port `agentParser.js`, `validation.js`, `scriptGenerator.js`

### Phase 6: Polish + Deploy (Day 5-6)
1. Framer Motion: page transitions, card animations
2. Sonner: toast notifications for copy/save/errors
3. Responsive tweaks
4. GitHub Pages deploy via `gh-pages`
5. Test full flow end-to-end

---

## Proxy Server

The existing `proxy-server.js` (localhost:3000) stays unchanged. It handles CORS for AgilePlace API calls. In production, consider:
- Hosting proxy as a simple Cloudflare Worker or Vercel Edge Function
- Or running proxy alongside GitHub Pages with a separate deployment

---

## Environment Variables

```env
VITE_FALCON_API_URL=https://falconai.planview-prod.io/api/v1/chat/completions
VITE_FALCON_MODEL=us.anthropic.claude-sonnet-4-5-20250929-v1:0
VITE_PROXY_URL=http://localhost:3000
```

API keys should NOT be in env vars for a GitHub Pages app. Use a settings panel (localStorage) where SCs enter their own Falcon AI key on first use.

---

## Notes

- No react-router needed — this is a single-page stepper, not a multi-page app
- localStorage for: connection creds, context library, custom instructions, tips preference, Falcon API key
- The proxy server is required for local dev; production hosting strategy TBD
- shadcn/ui components are copy-pasted into `src/components/ui/` — no package dependency
- Capability markdown files live in `src/config/capabilities/` and are imported as raw strings
