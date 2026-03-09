/**
 * Parse Pass 2 Falcon response into an array of agent configs.
 * Handles:
 * - Delimiter format: --- Agent N --- with Name, Type, Purpose, ## Instructions, ## Demo Script, ## Business Value, ## Transition
 * - JSON array or fenced code blocks
 * - Single raw block fallback
 * - Enforces max 5 Anvi steps per agent (truncates and sets truncated: true)
 */

const MAX_ANVI_STEPS = 5
const FENCED_BLOCK = /```(?:json)?\s*\n?([\s\S]*?)```/gi

/** Matches --- Agent N --- or --- Agent N --- (optional trailing/leading dashes) */
const AGENT_BLOCK_DELIMITER = /^---\s*Agent\s+(\d+)\s*---/im

function tryParseJson(str) {
  if (!str?.trim()) return null
  try {
    return JSON.parse(str.trim())
  } catch {
    return null
  }
}

function trimBlock(s) {
  return (s ?? '').trim()
}

/**
 * Split instructions string into individual steps (Anvi chat prompts).
 * Handles numbered list (1. ... 2. ...), paragraph breaks, or line-separated.
 */
function getSteps(instructions) {
  if (!instructions?.trim()) return []
  const trimmed = instructions.trim()
  const byNumber = trimmed.split(/^\s*\d+\.\s+/m).map((s) => s.trim()).filter(Boolean)
  if (byNumber.length > 1) return byNumber
  const byPara = trimmed.split(/\n\n+/).map((s) => s.trim()).filter(Boolean)
  if (byPara.length > 1) return byPara
  const byLine = trimmed.split(/\n/).map((s) => s.trim()).filter(Boolean)
  return byLine.length > 0 ? byLine : [trimmed]
}

/**
 * If agent has more than MAX_ANVI_STEPS, truncate to first 5 and set truncated: true.
 * Rebuilds instructions and raw so stored/copied content is the truncated version.
 */
function applyStepCap(agent) {
  if (agent == null) return agent
  const steps = getSteps(agent.instructions)
  if (steps.length <= MAX_ANVI_STEPS) return agent
  const kept = steps.slice(0, MAX_ANVI_STEPS)
  const newInstructions = kept.map((s, i) => `${i + 1}. ${s}`).join('\n\n')
  agent.instructions = newInstructions
  agent.truncated = true
  if (typeof agent.raw === 'string' && agent.raw.includes('## Instructions')) {
    agent.raw = agent.raw.replace(
      /(^##\s*Instructions\s*\n)[\s\S]*?(?=^##\s|$)/im,
      (_, head) => `${head}${newInstructions}\n\n`
    )
  } else {
    agent.raw = agent.raw ?? newInstructions
  }
  return agent
}

/**
 * Parse a single agent block in delimiter format:
 * --- Agent N ---
 * Name: ...
 * Type: ...
 * Purpose: ...
 * [opening paragraphs...]
 * ## Instructions / ## Steps
 * ## Demo Script
 * ## Business Value / ## Implementation Notes / ## Transition
 */
function parseDelimiterBlock(block, index) {
  const raw = trimBlock(block)
  if (!raw) return null

  const nameMatch = raw.match(/^Name:\s*(.+?)(?=\n[A-Za-z#]|$)/ims)
  const typeMatch = raw.match(/^Type:\s*(.+?)(?=\n[A-Za-z#]|$)/ims)
  const explicitPurposeMatch = raw.match(/^Purpose:\s*(.+?)(?=\n##|\n[A-Z][a-z]+:\s|$)/ims)

  const name = trimBlock(nameMatch?.[1] ?? '')
  const type = trimBlock(typeMatch?.[1] ?? '')

  // Split into intro (before first ## heading) and sections (## Heading)
  const headingRe = /^##\s*(.+?)\s*$/gm
  const headings = []
  let m
  while ((m = headingRe.exec(raw)) !== null) {
    headings.push({ title: m[1].trim(), index: m.index })
  }

  let intro = ''
  const sections = {}

  if (headings.length === 0) {
    intro = raw
  } else {
    intro = raw.slice(0, headings[0].index)
    for (let i = 0; i < headings.length; i++) {
      const { title, index: start } = headings[i]
      const end = i + 1 < headings.length ? headings[i + 1].index : raw.length
      const body = raw.slice(start + raw.slice(start).indexOf('\n') + 1, end)
      const key = title.toLowerCase()
      sections[key] = trimBlock(body)
    }
  }

  const openingPurpose = trimBlock(intro)
  const purpose = trimBlock(explicitPurposeMatch?.[1] ?? openingPurpose) || null

  const instructionsSection =
    sections['instructions'] ??
    sections['steps'] ??
    ''

  const demoScript = sections['demo script'] ?? sections['demoscript'] ?? ''

  const businessValue = sections['business value'] ?? sections['businessvalue'] ?? ''
  const implementationNotes = sections['implementation notes'] ?? sections['implementationnotes'] ?? ''
  const transition = sections['transition'] ?? ''

  const notesParts = []
  if (businessValue) notesParts.push('## Business Value\n' + businessValue)
  if (implementationNotes) notesParts.push('## Implementation Notes\n' + implementationNotes)
  if (transition) notesParts.push('## Transition\n' + transition)
  const notes = notesParts.join('\n\n')

  return {
    id: `agent-${index + 1}`,
    name: name || `Agent ${index + 1}`,
    type: type || null,
    purpose,
    instructions: instructionsSection || raw,
    demoScript: demoScript || '',
    businessValue: businessValue || '',
    transition: transition || '',
    notes,
    raw,
  }
}

/**
 * Split response by --- Agent N --- and parse each block.
 * Returns array of parsed agents or null if no delimiter blocks found.
 */
function tryParseDelimiterFormat(text) {
  const parts = text.split(AGENT_BLOCK_DELIMITER)
  // parts[0] may be preamble (warning, intro); parts[1] = "1", parts[2] = block1, parts[3] = "2", parts[4] = block2, ...
  if (typeof console !== 'undefined') {
    console.log('[agentParser] tryParseDelimiterFormat: split produced', parts.length, 'parts')
    if (parts.length > 1) {
      const delimitersFound = []
      for (let i = 1; i < parts.length; i += 2) delimitersFound.push(parts[i])
      console.log('[agentParser] Delimiter numbers detected (Agent N):', delimitersFound)
      parts.forEach((p, i) => {
        const preview = typeof p === 'string' ? p.slice(0, 120).replace(/\n/g, '↵') : String(p)
        console.log(`[agentParser] parts[${i}] (${p?.length ?? 0} chars):`, preview + (p?.length > 120 ? '...' : ''))
      })
    }
  }
  if (parts.length < 2) return null
  const agents = []
  for (let i = 1; i < parts.length; i += 2) {
    const num = parts[i]?.trim()
    const block = parts[i + 1]?.trim()
    if (block) agents.push(parseDelimiterBlock(block, agents.length))
  }
  return agents.length > 0 ? agents : null
}

function normalizeAgent(entry, index) {
  if (entry == null) return null
  if (typeof entry === 'string') {
    return {
      id: `agent-${index + 1}`,
      name: `Agent ${index + 1}`,
      type: null,
      purpose: null,
      instructions: entry,
      demoScript: '',
      businessValue: '',
      transition: '',
      raw: entry,
    }
  }
  if (typeof entry !== 'object') return null
  return {
    id: entry.id ?? entry.agent_id ?? `agent-${index + 1}`,
    name: entry.name ?? entry.agent_name ?? `Agent ${index + 1}`,
    type: entry.type ?? entry.agent_type ?? null,
    purpose: entry.purpose ?? null,
    instructions: entry.instructions ?? entry.prompt ?? entry.content ?? entry.body ?? '',
    demoScript: entry.demoScript ?? entry.demo_script ?? '',
    businessValue: entry.businessValue ?? entry.business_value ?? '',
    transition: entry.transition ?? '',
    raw: typeof entry.raw === 'string' ? entry.raw : JSON.stringify(entry, null, 2),
  }
}

export function parseAgentConfigs(responseText) {
  if (!responseText?.trim()) return []

  const text = responseText.trim()

  if (typeof console !== 'undefined') {
    console.log('[agentParser] parseAgentConfigs: raw input length', text.length)
    console.log('[agentParser] Raw input (first 800 chars):', text.slice(0, 800))
    console.log('[agentParser] Raw input (last 400 chars):', text.slice(-400))
    const delimCount = (text.match(new RegExp(AGENT_BLOCK_DELIMITER.source, 'gm')) || []).length
    if (delimCount > 0) {
      console.log('[agentParser] AGENT_BLOCK_DELIMITER matches in raw text:', delimCount, '- sample contexts:')
      let count = 0
      const re = new RegExp(AGENT_BLOCK_DELIMITER.source, 'gim')
      let m
      while ((m = re.exec(text)) !== null && count < 5) {
        const start = Math.max(0, m.index - 40)
        const end = Math.min(text.length, m.index + m[0].length + 60)
        console.log(`  [${m[1]}]: "...${text.slice(start, end).replace(/\n/g, '↵')}..."`)
        count++
      }
    }
  }

  // 1) Delimiter format: --- Agent N --- with ## sections
  const delimiterAgents = tryParseDelimiterFormat(text)
  if (delimiterAgents?.length) {
    if (typeof console !== 'undefined') {
      console.log('[agentParser] Using delimiter path: produced', delimiterAgents.length, 'agents')
      delimiterAgents.forEach((a, i) => {
        console.log(`[agentParser] Agent ${i + 1}: id=${a.id} name=${JSON.stringify(a.name)} instructionsLen=${a.instructions?.length ?? 0} preview=${(a.instructions ?? '').slice(0, 80).replace(/\n/g, '↵')}...`)
      })
    }
    return delimiterAgents.map(applyStepCap)
  }

  // 2) Try single top-level JSON array
  const parsed = tryParseJson(text)
  if (Array.isArray(parsed)) {
    if (typeof console !== 'undefined') {
      console.log('[agentParser] Using JSON array path: parsed length', parsed.length)
      parsed.slice(0, 3).forEach((item, i) => console.log(`[agentParser] JSON item ${i}:`, typeof item, JSON.stringify(item)?.slice(0, 100)))
    }
    return parsed.map((item, i) => applyStepCap(normalizeAgent(item, i))).filter(Boolean)
  }
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.agents)) {
    if (typeof console !== 'undefined') console.log('[agentParser] Using JSON.agents path: agents length', parsed.agents.length)
    return parsed.agents.map((item, i) => applyStepCap(normalizeAgent(item, i))).filter(Boolean)
  }

  // 3) Extract fenced code blocks
  const blocks = []
  let m
  FENCED_BLOCK.lastIndex = 0
  while ((m = FENCED_BLOCK.exec(text)) !== null) {
    const content = m[1].trim()
    if (content) blocks.push(content)
  }

  if (blocks.length === 0) {
    // 4) No blocks: treat whole response as one agent
    if (typeof console !== 'undefined') console.log('[agentParser] Using fallback path: no fenced blocks, treating whole as 1 agent')
    return [applyStepCap(normalizeAgent(text, 0))]
  }

  if (typeof console !== 'undefined') console.log('[agentParser] Using fenced blocks path:', blocks.length, 'blocks')

  const agents = []
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const parsedBlock = tryParseJson(block)
    if (Array.isArray(parsedBlock)) {
      parsedBlock.forEach((item, j) => agents.push(normalizeAgent(item, agents.length)))
    } else if (parsedBlock && typeof parsedBlock === 'object') {
      agents.push(normalizeAgent(parsedBlock, agents.length))
    } else {
      // Try delimiter format within block
      const fromDelim = tryParseDelimiterFormat(block)
      if (fromDelim?.length) fromDelim.forEach((a) => agents.push(a))
      else agents.push(normalizeAgent(block, agents.length))
    }
  }
  const result = agents.map(applyStepCap)
  if (typeof console !== 'undefined') console.log('[agentParser] Final result:', result.length, 'agents')
  return result
}
