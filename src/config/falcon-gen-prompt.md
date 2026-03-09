# Pass 2 — Full generation

## Core principle

Do **not** hardcode any specific actions (e.g. "Create card", "Move card"). Instead, read the **capability files included in the payload** and use **only** actions documented in those files. The context library / capability files define what the AI assistant (Anvi) can do — treat them as the **only valid action vocabulary**. Do not invent actions that are not documented there.

---

## CRITICAL: Instructions are Anvi chat prompts, not pseudo-code

Each agent's **Instructions** must be **actual Anvi chat prompts** — the exact text a Solution Consultant (SC) would **paste into Anvi's chat panel** to execute. Anvi is a **chat-based AI assistant**, not a code interpreter. Instructions must be **natural language prompts** that Anvi can understand and execute.

- **Do NOT output:** bracket notation, arrows, pseudo-operations, "operation" labels, or API-style key-value blocks. Anvi cannot execute those.
- **Do output:** complete sentences that an SC can copy-paste into Anvi's chat. Use real board IDs, card type names, and lane names from the payload. Anvi understands natural language.

**Example of WRONG output:**
```
[Create card operation] → New card:
- Title: "Account Balance API v3"
- Type: Epic (cardTypeId: 2410445152)
```

**Example of CORRECT output:**
```
Create a new Epic card titled "Account Balance API v3" on board 2398231743 in the Inbound lane. Set the description to "API modernization for real-time balance checks across mobile and web channels."
```

Each step in **## Instructions** must be a **complete sentence** (or short paragraph) that an SC can copy-paste into Anvi's chat. Include real board IDs, card type names, and lane names from the payload. Anvi understands natural language — **do not use bracket notation, arrows, or pseudo-code.**

---

## Instructions

1. **Read the context library files in the payload.**  
   These define what actions Anvi can perform. Treat these as the **only** valid action vocabulary. Do not invent actions not documented in the capability files.

2. **Generate one complete agent per approved agent in the plan.**  
   Each agent must be a separate block with a clear delimiter: `--- Agent N ---`. Include the agent name, number, and purpose from the approved plan.

3. **Use only documented operations, expressed as chat prompts.**  
   Each agent's instructions must be **natural language chat prompts** (complete sentences) that an SC can paste into Anvi's chat, using **only** capabilities documented in the capability files.  
   - If the capability files describe card creation (e.g. AgilePlace), write prompts like: "Create a new Epic card titled '…' on board X in the Inbound lane." Use **real** board IDs, card type names, and lane names from the payload.  
   - If the capability files describe read/query operations (e.g. Portfolios), write prompts that ask Anvi to run those queries in plain language, referencing specific strategy themes, initiatives, and projects from the Portfolios context in the payload. At least one agent should explicitly highlight alignment between board-level work and organizational strategy.
   **No bracket notation, arrows, or pseudo-code** — only copy-pasteable chat text.

4. **Reference real IDs from the payload.**  
   Use actual board IDs, card type IDs, lane IDs, project IDs, etc. from `selectedBoards` or other data in the payload. **Never** use placeholder or example IDs.

5. **Include a demo script section per agent:**  
   - What the Solution Consultant (SC) should say while the agent runs  
   - Business value callout  
   - Transition to the next agent  

6. **Honor SC notes.**  
   If the SC added notes to an agent during plan review, treat those notes as the **highest-priority** instruction for that agent — they override the original plan's description.

7. **Honor excluded agents.**  
   If agents were excluded during plan review, do **not** generate them. The approved agent list is the source of truth.

---

## CRITICAL EXECUTION CONSTRAINTS

### 5-Step Hard Limit
Each agent MUST have a maximum of 5 Anvi chat prompts (steps). No exceptions. Anvi has a 5-prompt session limit. If a workflow needs more actions, combine related operations into fewer steps.

### Anvi Context Model
Anvi has a 200K token context window. All tool responses persist in context for the entire conversation. This means:
- Steps can reference data from ANY previous step without re-fetching
- Use phrasing like "Using the cards retrieved in Step 1..." or "From the template extracted in Step 2..."
- NEVER re-fetch data that was already retrieved in an earlier step
- Each tool call costs ~7K tokens (request + response). 5 steps = ~35K tokens, well within budget.
- Anvi does not have memory across conversations — only within a single session

### One Tool Call Per Step
Anvi executes one tool call per prompt. Do not ask Anvi to make multiple API calls in a single step. Design each step around ONE primary tool action. Analysis, formatting, and referencing previous data do not require tool calls and can be combined freely with a tool call in the same step.

### Speed Optimization
Demos run live in front of customers. Every step must be optimized:

1. BROAD FETCHES OVER FILTERED FETCHES: Fetch all cards from a lane rather than asking for "the most recent" or "highest priority." Anvi cannot filter during fetch — it fetches all then analyzes. Asking it to filter during fetch causes hangs. Fetch all, then sort/filter in analysis.

2. COMBINE ANALYSIS WITH ACTION: A single step can fetch data AND perform analysis on it AND take an action based on the analysis. These are not separate tool calls — only the fetch is a tool call. Analysis and action decisions happen in Anvi's reasoning.

3. REFERENCE, DON'T RE-FETCH: Since all tool responses persist in context, subsequent steps should reference previous results. "Using the card IDs from Step 1, create parent-child relationships" — not "Retrieve the cards again and then create relationships."

4. STRATEGIC DATA RETRIEVAL: Only fetch data you will actually use. Prefer fetching with full details in one call over multiple narrow calls, since re-fetching costs more tokens than storing unused fields.

### Output Brevity
Anvi tends to produce large data dumps and status summaries after each step. This slows demos and clutters the screen. Every step MUST end with an explicit brevity instruction:

- For data retrieval: "Keep response brief — list only card titles and IDs."
- For action steps: "Confirm with a one-line summary only."
- For analysis: "Present as a short bullet list, max 5 items."
- For final summaries: "Present a concise summary table. No explanatory prose."

Always end each step with a variation of: "Keep response brief." This is critical for demo pacing.

### Step Format
STEP N: ACTION TITLE (in caps)
- Dash-prefixed bullet instructions
- One clear tool action per step
- Reference previous step data where applicable
- End with brevity instruction

---

## Output format (per agent)

Use this structure for each agent block:

```
--- Agent N ---
Name: [agent name]
Type: [inferred from actions: Create | Query | Analysis | OKR | Mixed]
Purpose: [from approved plan]

## Instructions
[One prompt per line or step — complete sentences the SC can copy-paste into Anvi's chat. Natural language only; no brackets, arrows, or pseudo-code. Use real IDs/names from the payload.]

## Demo Script
[What to say while running this agent]

## Business Value
[Key value callout for the audience]

## Transition
[Handoff to next agent]
```

---

## No capability files

If **no** capability files are present in the payload, respond with a **warning** that no action vocabulary was provided and that agents cannot be generated without capability context. Do not generate agent blocks in that case.
