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
   - If the capability files describe read/query operations (e.g. Portfolios), write prompts that ask Anvi to run those queries in plain language.  
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
