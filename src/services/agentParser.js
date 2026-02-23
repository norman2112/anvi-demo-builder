/**
 * Parse Pass 2 Falcon response into an array of agent configs.
 * Handles:
 * - Delimiter format: --- Agent N --- with Name, Type, Purpose, ## Instructions, ## Demo Script, ## Business Value, ## Transition
 * - JSON array or fenced code blocks
 * - Single raw block fallback
 */

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
 * Parse a single agent block in delimiter format:
 * --- Agent N ---
 * Name: ...
 * Type: ...
 * Purpose: ...
 * ## Instructions
 * ...
 * ## Demo Script
 * ...
 * ## Business Value
 * ...
 * ## Transition
 * ...
 */
function parseDelimiterBlock(block, index) {
  const raw = trimBlock(block)
  if (!raw) return null

  const nameMatch = raw.match(/^Name:\s*(.+?)(?=\n[A-Za-z#]|$)/ims)
  const typeMatch = raw.match(/^Type:\s*(.+?)(?=\n[A-Za-z#]|$)/ims)
  const purposeMatch = raw.match(/^Purpose:\s*(.+?)(?=\n##|\n[A-Z][a-z]+:\s|$)/ims)

  const section = (title) => {
    const re = new RegExp(`^##\\s*${title}\\s*\\n([\\s\\S]*?)(?=^##\\s|$)`, 'im')
    const m = raw.match(re)
    return m ? trimBlock(m[1]) : ''
  }

  const name = trimBlock(nameMatch?.[1] ?? '')
  const type = trimBlock(typeMatch?.[1] ?? '')
  const purpose = trimBlock(purposeMatch?.[1] ?? '')
  const instructions = section('Instructions')
  const demoScript = section('Demo Script')
  const businessValue = section('Business Value')
  const transition = section('Transition')

  return {
    id: `agent-${index + 1}`,
    name: name || `Agent ${index + 1}`,
    type: type || null,
    purpose: purpose || null,
    instructions: instructions || raw,
    demoScript: demoScript || '',
    businessValue: businessValue || '',
    transition: transition || '',
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

  // 1) Delimiter format: --- Agent N --- with ## sections
  const delimiterAgents = tryParseDelimiterFormat(text)
  if (delimiterAgents?.length) return delimiterAgents

  // 2) Try single top-level JSON array
  const parsed = tryParseJson(text)
  if (Array.isArray(parsed)) {
    return parsed.map((item, i) => normalizeAgent(item, i)).filter(Boolean)
  }
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.agents)) {
    return parsed.agents.map((item, i) => normalizeAgent(item, i)).filter(Boolean)
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
    return [normalizeAgent(text, 0)]
  }

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
  return agents
}
