# ANVI LIMITATIONS v1.0

## Purpose
This document catalogs known architectural limitations in Anvi (Planview's AI assistant) that impact agent building and execution. Use this when generating agent configurations to avoid common pitfalls.

---

## CRITICAL LIMITATION: Mode Ambiguity

### The Problem
Anvi cannot distinguish between three distinct contexts:
1. **Chat mode** - Normal conversational interaction
2. **Agent building** - Configuring a new agent via the builder modal
3. **Agent execution** - Running a saved agent

### Impact
- When building agents, Anvi may try to EXECUTE instructions instead of saving them as steps
- When running agents, Anvi may treat agent instructions as chat prompts
- No visual or system indication of which mode is active
- Users and Anvi itself cannot reliably tell what context they're operating in

### Workarounds
- Use the agent builder modal (★ → Manage favorites → Agents tab) - never build agents via chat
- Use explicit framing: "I am building an agent that will..." when describing steps
- Test agents in isolation after building (close modal, reopen, then execute)
- Keep agent steps simple and unambiguous

---

## Self-Awareness Gaps

### What Anvi Cannot Access
- ❌ Its own system prompt or agent configuration
- ❌ Agent instructions after they're saved
- ❌ Available tools/capabilities without explicit documentation
- ❌ Complete API response fields (some fields missing from responses)
- ❌ Reliable conversation history or context across turns

### Impact
Agents must be **fully self-contained** and **context-rich**:
- Cannot assume Anvi "remembers" previous instructions
- Cannot reference "the board we discussed" or "the card types from earlier"
- Must provide explicit IDs (board IDs, card type IDs, lane IDs) in every step
- Must document available operations in the agent instructions

---

## Performance Anti-Patterns

### What Anvi Does (Poorly)
- Does NOT use batch APIs by default - creates/updates items one-at-a-time
- Asks for confirmation on every individual action (even in bulk scenarios)
- Gets stuck in "Analyzing Question" → "Thinking..." loops
- Hits rate limits on repetitive operations
- Cannot parse markdown formatting (bullets become part of card titles)

### Execution Speed
- Expected: 15 cards created in ~2 seconds (batch API)
- Reality: 15 cards created in 5-10+ minutes (one-at-a-time with confirmations)

### Workarounds
- Explicitly call batch operation tools (batchCreateCards, bulkUpdateCards)
- Set "Automate: Yes" in agent builder to skip confirmations
- Use plain text or JSON formatting (not markdown bullets)
- Break complex operations into tested, atomic steps

---

## Context Payload Requirements

Because of the above limitations, every agent step MUST include:

### 1. Complete Environment Data
```
Board ID: 2372827607
Board Name: Digital Banking Initiatives

Card Types:
  Initiative (ID: 2372827610, Color: #B60001)
  Epic (ID: 2372827611, Color: #527A8E)
  Feature (ID: 2372827612, Color: #09AA61)

Lanes:
  Backlog (ID: 2372827620, Status: notStarted)
  In Progress (ID: 2372827621, Status: started)
  Done (ID: 2372827622, Status: finished)
```

### 2. Explicit Tool Instructions
```
Available MCP Tools:
- agileplace:batchCreateCards (creates up to 100 cards in one API call)
- agileplace:bulkUpdateCards (applies same update to multiple cards)

IMPORTANT: Use batch operations. Do NOT create cards one-at-a-time.
```

### 3. Step-by-Step Operations
```
Call agileplace:batchCreateCards with this payload:
{
  "boardId": "2372827607",
  "cards": [
    {"title": "Digital Account Opening", "cardTypeId": "2372827610"},
    {"title": "Mobile Banking App", "cardTypeId": "2372827610"}
  ]
}

Do NOT ask for confirmation. Execute immediately.
```

### 4. Plain Text Formatting
```
WRONG (will break - bullets become part of titles):
- Digital Account Opening
- Mobile Banking App

CORRECT:
Digital Account Opening
Mobile Banking App

Or use JSON arrays for structured data.
```

---

## Agent Building Best Practices

### Always Do This
- ✅ Provide complete context in every agent step
- ✅ Use explicit tool names (agileplace:batchCreateCards, not "create cards")
- ✅ Include all required IDs (board ID, card type ID, lane ID)
- ✅ Use plain text or JSON (never markdown formatting)
- ✅ Set "Automate: Yes" to prevent confirmation spam
- ✅ Test each step independently before combining into multi-step agents

### Never Do This
- ❌ Assume Anvi remembers context from previous steps
- ❌ Reference "the board we configured earlier" without providing the board ID again
- ❌ Use markdown bullets (-, •, *) in lists that will become data
- ❌ Create items one-at-a-time when batch operations exist
- ❌ Build complex agents without testing individual steps first
- ❌ Expect Anvi to discover information dynamically (provide everything explicitly)

---

## Known Failure Modes

### "Analyzing Question" Infinite Loop
**Symptoms:** Anvi shows "Analyzing Question" or "Thinking..." indefinitely  
**Causes:** Ambiguous prompt, missing required context, or API error  
**Solutions:** Simplify prompt, add explicit IDs for all resources, break into smaller atomic steps

### Confirmation Spam
**Symptoms:** Anvi asks "Should I create card 1? Card 2? Card 3?..." for every item  
**Causes:** "Automate" setting disabled, or not using batch operations  
**Solutions:** Enable "Automate: Yes" in agent builder, use batch tools explicitly

### Markdown Parsing Failures
**Symptoms:** Card titles include "- " or "• " prefixes  
**Causes:** Anvi doesn't strip markdown formatting before sending to API  
**Solutions:** Use plain text lists or JSON arrays for structured data

### Missing API Fields
**Symptoms:** "Cannot access scoreTotal" or similar field errors  
**Causes:** Not all fields available in standard API responses  
**Solutions:** Use specialized endpoints (/card/:id/statistics) or work with available fields

### Mode Confusion During Building
**Symptoms:** Anvi executes instructions when you're trying to save them as agent steps  
**Causes:** No distinction between chat and agent building modes  
**Solutions:** Only build agents via the modal UI (★ → Manage favorites → Agents), never via chat

---

## Integration with Agent Builder Tool

When generating agent configurations, this document informs:

1. **Context Payload Structure** - What must be included in every step
2. **Tool Selection** - Which operations to use (batch vs individual)
3. **Formatting Guidelines** - How to structure instructions (plain text vs markdown)
4. **Validation Rules** - What to check before generating output
5. **User Warnings** - What limitations to communicate to users

---

## Document Version
- **Version:** 1.0
- **Last Updated:** 2026-02-19
- **Maintainer:** Big fella (Sales Consultant, Planview)
- **Source:** Direct observation and testing of Anvi behavior, plus self-reported limitations from Anvi itself

---

## Related Documents
- `ANVI_CAPABILITIES_AGILEPLACE_v1.0.md` - Available operations for AgilePlace
- `ANVI_CAPABILITIES_PORTFOLIOS_v1.0.md` - Available operations for Portfolios
- `ANVI_KNOWLEDGE_PLANVIEW_ME_v1.0.md` - Planview.me dashboard guidance
- `ANVI_AGENT_BUILDER_SKILL.md` - Comprehensive skill documentation
