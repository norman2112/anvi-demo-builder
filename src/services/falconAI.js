const API_URL = import.meta.env.VITE_FALCON_API_URL || 'https://falconai.planview-prod.io/api/v1/chat/completions'
const MODEL = import.meta.env.VITE_FALCON_MODEL || 'us.anthropic.claude-sonnet-4-5-20250929-v1:0'

/** Hardcoded fallback when nothing is set in Settings (from legacy HTML build). */
const FALCON_API_KEY_DEFAULT = 'sk-fe8c2012d8a642819d70a8f59c3367ac'

export function getFalconApiKeyDefault() {
  return FALCON_API_KEY_DEFAULT || ''
}

function getApiKey() {
  const fromStorage = typeof localStorage !== 'undefined' ? localStorage.getItem('anvi-falcon-api-key') : null
  if (fromStorage && fromStorage.trim()) return fromStorage
  if (FALCON_API_KEY_DEFAULT && FALCON_API_KEY_DEFAULT.trim()) return FALCON_API_KEY_DEFAULT
  return null
}

const DEBUG = true // set to false to silence console

function log(...args) {
  if (DEBUG && typeof console !== 'undefined') console.log('[Falcon IA]', ...args)
}

export async function fetchPlan(payload) {
  const key = getApiKey()
  if (!key || !API_URL) {
    log('Aborted: API key or URL not set. Key present:', !!key, 'URL:', API_URL || '(empty)')
    throw new Error('Falcon API key or URL not set')
  }
  const body = {
    model: MODEL,
    messages: [{ role: 'user', content: JSON.stringify(payload) }],
  }
  log('Sending Pass 1 (plan) request to', API_URL, '| payload keys:', Object.keys(payload))
  if (typeof console !== 'undefined') {
    console.log('[Falcon IA] Full request body sent to Falcon API:', JSON.stringify(body, null, 2))
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  })
  const responseText = await res.text()
  if (typeof console !== 'undefined') {
    console.log('[Falcon IA] Raw response body from fetch (exactly what Falcon returned):', responseText)
  }
  if (!res.ok) {
    log('Pass 1 failed:', res.status, res.statusText, '| body:', responseText?.slice(0, 500))
    throw new Error(`Falcon error: ${res.status}${responseText ? ` — ${responseText.slice(0, 200)}` : ''}`)
  }
  let data
  try {
    data = JSON.parse(responseText)
  } catch (e) {
    log('Pass 1 response was not JSON:', responseText?.slice(0, 300))
    throw new Error('Falcon returned invalid JSON')
  }
  const rawContent = data?.choices?.[0]?.message?.content
  const text = typeof rawContent === 'string'
    ? rawContent
    : Array.isArray(rawContent)
      ? (rawContent.map((p) => (p && typeof p.text === 'string' ? p.text : '')).join(''))
      : rawContent != null && typeof rawContent === 'object'
        ? JSON.stringify(rawContent)
        : ''
  log('Pass 1 success, response has content length:', text?.length ?? 0)
  if (typeof console !== 'undefined') {
    console.log('[Falcon IA] Content passed to plan parser (choices[0].message.content):', text?.slice(0, 500))
  }
  return { plan: parsePlanResponse(text), rawResponseText: text }
}

export async function generateAgents(pass2Payload) {
  const key = getApiKey()
  if (!key || !API_URL) {
    log('Aborted: API key or URL not set. Key present:', !!key, 'URL:', API_URL || '(empty)')
    throw new Error('Falcon API key or URL not set')
  }
  const body = {
    model: MODEL,
    messages: [{ role: 'user', content: JSON.stringify(pass2Payload) }],
  }
  log('Sending Pass 2 (generate agents) request to', API_URL, '| payload keys:', Object.keys(pass2Payload))
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  })
  const responseText = await res.text()
  if (!res.ok) {
    log('Pass 2 failed:', res.status, res.statusText, '| body:', responseText?.slice(0, 500))
    throw new Error(`Falcon error: ${res.status}${responseText ? ` — ${responseText.slice(0, 200)}` : ''}`)
  }
  let data
  try {
    data = JSON.parse(responseText)
  } catch (e) {
    log('Pass 2 response was not JSON:', responseText?.slice(0, 300))
    throw new Error('Falcon returned invalid JSON')
  }
  const content = data?.choices?.[0]?.message?.content ?? ''
  log('Pass 2 success, response content length:', content?.length ?? 0)
  return content
}

/** Strip #, *, \, leading/trailing whitespace (no regex) */
function cleanHeaderText(s) {
  if (typeof s !== 'string') return ''
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c !== '#' && c !== '*' && c !== '\\') out += c
  }
  return out.trim()
}

/** Strip leading/trailing double-quote characters from name */
function stripQuotes(s) {
  if (typeof s !== 'string') return ''
  let start = 0
  let end = s.length
  while (start < end && s[start] === '"') start++
  while (end > start && s[end - 1] === '"') end--
  return s.slice(start, end).trim()
}

/** True if line is an agent header: starts with # (after trim) and contains "Agent" followed by a digit */
function lineIsAgentHeader(line) {
  const t = line.trim()
  if (t.length === 0 || t[0] !== '#') return false
  const idx = t.indexOf('Agent')
  if (idx === -1) return false
  const after = t.slice(idx + 5)
  for (let i = 0; i < after.length; i++) {
    if (after[i] >= '0' && after[i] <= '9') return true
  }
  return false
}

/** Get agent number: digits immediately after "Agent" (skip spaces first) */
function getAgentNumberFromLine(line) {
  const idx = line.indexOf('Agent')
  if (idx === -1) return 0
  let pos = idx + 5
  while (pos < line.length && line[pos] === ' ') pos++
  let numStr = ''
  while (pos < line.length && line[pos] >= '0' && line[pos] <= '9') {
    numStr += line[pos]
    pos++
  }
  return numStr ? parseInt(numStr, 10) : 0
}

/** Extract name from header line: after last colon, or after digit and period; then clean and strip quotes */
function getNameFromHeaderLine(line) {
  const cleaned = cleanHeaderText(line)
  const lastColon = cleaned.lastIndexOf(':')
  if (lastColon !== -1) {
    return stripQuotes(cleanHeaderText(cleaned.slice(lastColon + 1)))
  }
  const idx = cleaned.indexOf('Agent')
  if (idx === -1) return stripQuotes(cleaned)
  let pos = idx + 5
  while (pos < cleaned.length && cleaned[pos] === ' ') pos++
  while (pos < cleaned.length && cleaned[pos] >= '0' && cleaned[pos] <= '9') pos++
  if (pos < cleaned.length && cleaned[pos] === '.') pos++
  while (pos < cleaned.length && cleaned[pos] === ' ') pos++
  return stripQuotes(cleanHeaderText(cleaned.slice(pos)))
}

/**
 * Dead-simple plan parser: split into lines, find "Agent" + digit headers, extract name from that line only,
 * content block = until next header. Purpose from first "Purpose"/"Description" line; bullets = key actions; rest = details.
 */
function parsePlanResponseFromMarkdown(text) {
  const agents = []
  if (!text || typeof text !== 'string') return { agents }

  const lines = text.split(/\r?\n/)

  let cut = lines.length
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('Ready for Pass 2') !== -1) {
      cut = i
      break
    }
  }
  const toParse = lines.slice(0, cut)

  const headerIndices = []
  for (let i = 0; i < toParse.length; i++) {
    if (lineIsAgentHeader(toParse[i])) headerIndices.push(i)
  }

  if (headerIndices.length === 0) return { agents }

  for (let k = 0; k < headerIndices.length; k++) {
    const start = headerIndices[k]
    const end = k + 1 < headerIndices.length ? headerIndices[k + 1] : toParse.length
    const headerLine = toParse[start]
    const contentLines = toParse.slice(start + 1, end)

    const agentNumber = getAgentNumberFromLine(headerLine)
    let name = getNameFromHeaderLine(headerLine)
    let purpose = ''
    let purposeFromLabel = false
    const keyActions = []
    const detailsParts = []

    for (let i = 0; i < contentLines.length; i++) {
      const line = contentLines[i]
      const lower = line.toLowerCase()
      const hasPurpose = lower.indexOf('purpose') !== -1
      const hasDescription = lower.indexOf('description') !== -1
      if (hasPurpose || hasDescription) {
        const colonIdx = line.indexOf(':')
        if (colonIdx !== -1) {
          purpose = cleanHeaderText(line.slice(colonIdx + 1))
          if (purpose) {
            purposeFromLabel = true
            break
          }
        }
      }
    }

    for (let i = 0; i < contentLines.length; i++) {
      const line = contentLines[i]
      const t = line.trim()
      if (!t) continue
      const first = t[0]
      if (first === '-' || first === '*') {
        const bullet = cleanHeaderText(t.slice(1).trim())
        if (bullet) keyActions.push(bullet)
      } else {
        const purposeOrDesc = (line.toLowerCase().indexOf('purpose') !== -1 || line.toLowerCase().indexOf('description') !== -1) && line.indexOf(':') !== -1
        if (!purposeOrDesc) detailsParts.push(line)
      }
    }

    const details = detailsParts.join('\n').trim()

    if (!name) name = cleanHeaderText(headerLine) || `Agent ${agentNumber}`
    if (!purpose) purpose = cleanHeaderText((contentLines.find((l) => l.trim()) || '').trim())
    const keyActionsFinal = purposeFromLabel ? keyActions : []

    if (typeof console !== 'undefined') {
      console.log('[Plan parser] raw header line:', JSON.stringify(headerLine))
      console.log('[Plan parser] extracted name:', JSON.stringify(name))
      console.log('[Plan parser] extracted purpose:', JSON.stringify(purpose))
    }

    const fullDescription = [purpose, details].filter(Boolean).join('\n\n').trim() || (contentLines.join('\n').trim())
    const rationale = purpose || (keyActionsFinal.length ? keyActionsFinal[0] : '') || fullDescription

    // Skip "Agent Suite (5 Agents)" and any agent with invalid number
    const nameLower = (name || '').toLowerCase()
    if (nameLower.includes('suite')) continue
    if (agentNumber == null || Number.isNaN(Number(agentNumber))) continue

    agents.push({
      agent_number: agentNumber,
      name: stripQuotes(name),
      description: fullDescription || rationale,
      type: 'agent',
      rationale: rationale || fullDescription,
      key_actions: keyActionsFinal.length ? keyActionsFinal : (fullDescription ? [fullDescription] : []),
      estimated_time: '',
    })
  }

  return { agents }
}

/** Get agents array from parsed JSON (handles plan.agents, data.agents, agents, result.agents, etc.) */
function extractAgentsFromParsed(parsed) {
  if (!parsed || typeof parsed !== 'object') return null
  const raw =
    Array.isArray(parsed.agents) ? parsed.agents
    : Array.isArray(parsed.plan?.agents) ? parsed.plan.agents
    : Array.isArray(parsed.data?.agents) ? parsed.data.agents
    : Array.isArray(parsed.result?.agents) ? parsed.result.agents
    : Array.isArray(parsed.response?.agents) ? parsed.response.agents
    : findAgentsArray(parsed)
  if (!raw || raw.length === 0) return null
  const plan = parsed.plan ?? parsed.data ?? parsed.result ?? parsed.response ?? parsed
  return normalizePlan({ ...plan, agents: raw })
}

/** Recursively find an array of agent-like objects (have name, agent_number, or title) */
function findAgentsArray(obj, depth = 0) {
  if (depth > 3 || !obj || typeof obj !== 'object') return null
  if (Array.isArray(obj)) {
    const looksLikeAgents = obj.length > 0 && obj.every(
      (item) => item && typeof item === 'object' && (item.name != null || item.agent_number != null || item.title != null)
    )
    return looksLikeAgents ? obj : null
  }
  for (const key of ['agents', 'plan', 'data', 'result', 'response']) {
    const found = findAgentsArray(obj[key], depth + 1)
    if (found) return found
  }
  return null
}

export function parsePlanResponse(text) {
  if (text == null) return { agents: [] }
  const str = typeof text === 'string' ? text : (typeof text === 'object' ? JSON.stringify(text) : String(text))
  let trimmed = str.trim()
  if (!trimmed) return { agents: [] }

  // Strip optional markdown code fence so we can parse inner JSON
  const codeFence = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (codeFence) trimmed = codeFence[1].trim()

  // 1) Try JSON: whole string first, then first { ... } object
  try {
    const parsedWhole = JSON.parse(trimmed)
    const result = extractAgentsFromParsed(parsedWhole)
    if (result && result.agents.length > 0) return result
  } catch (_) {}

  try {
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0])
      const result = extractAgentsFromParsed(parsed)
      if (result && result.agents.length > 0) return result
    }
  } catch (_) {}

  // 2) Resilient markdown: any ##/### Agent N starts a block; extract name, purpose, key actions; never 0 agents if headers found
  const fromMarkdown = parsePlanResponseFromMarkdown(trimmed)
  if (fromMarkdown.agents.length > 0) return normalizePlan(fromMarkdown)

  // 3) Last resort: lines like "Agent N: Name", "1. Name" — minimal agent list
  const minimal = parsePlanResponseMinimal(trimmed)
  if (minimal.agents.length > 0) return normalizePlan(minimal)

  return { agents: [] }
}

/** Fallback: extract agent titles from lines like "Agent 1: Name", "1. Name"; capture block content for description/key_actions */
function parsePlanResponseMinimal(text) {
  const lines = text.split(/\r?\n/)
  const headerIndices = []
  for (let i = 0; i < lines.length; i++) {
    const m =
      lines[i].match(/\bAgent\s+(\d+):\s*(.+?)(?:\s*\*\*)?$/i) ||
      lines[i].match(/^\s*#{1,6}\s*\*?\*?Agent\s+(\d+):\s*(.+?)(?:\s*\*\*)?/i) ||
      lines[i].match(/^\s*(\d+)[.)]\s*(.+?)(?:\s*\*\*)?$/m) ||
      lines[i].match(/^\s*[-*]\s*(\d+)[.)]?\s*(.+?)$/m)
    if (m) headerIndices.push({ index: i, num: parseInt(m[1], 10), nameRaw: (m[2] || '').replace(/\*\*/g, '').trim() })
  }
  const agents = []
  for (let k = 0; k < headerIndices.length; k++) {
    const start = headerIndices[k].index
    const end = k + 1 < headerIndices.length ? headerIndices[k + 1].index : lines.length
    const blockLines = lines.slice(start + 1, end)
    const blockText = blockLines.join('\n').trim()
    const name = stripQuotes(headerIndices[k].nameRaw || `Agent ${headerIndices[k].num}`)
    let description = ''
    const descLine = blockLines.find((l) => /(?:Description|Purpose|Role):\s*(.+)/i.test(l))
    if (descLine) {
      const match = descLine.match(/(?:Description|Purpose|Role):\s*(.+)/i)
      description = (match && match[1] ? match[1] : '').replace(/\*\*/g, '').trim()
    } else if (blockLines.length) {
      description = blockLines.slice(0, 3).filter(Boolean).join(' ').replace(/\*\*/g, '').trim()
    }
    const keyActionLines = blockLines
      .filter((l) => /^\s*[-*•]/.test(l))
      .map((l) => l.replace(/^\s*[-*•]\s*/, '').replace(/\*\*/g, '').trim())
      .filter(Boolean)
    const key_actions = keyActionLines.length > 0 ? keyActionLines : (blockText ? [blockText] : [])
    const num = headerIndices[k].num
    if (num == null || Number.isNaN(Number(num))) continue
    if ((name || '').toLowerCase().includes('suite')) continue

    agents.push({
      agent_number: num,
      name,
      description: description || blockText,
      type: 'agent',
      rationale: description || (key_actions[0] || '') || blockText,
      key_actions,
      estimated_time: '',
    })
  }
  return { agents }
}

function normalizeKeyActions(v) {
  if (Array.isArray(v)) return v.filter((x) => x != null && String(x).trim())
  if (typeof v === 'string' && v.trim()) {
    return v
      .split(/[\n,;]+/)
      .map((s) => s.replace(/^\s*[-*•]\s*/, '').trim())
      .filter(Boolean)
  }
  return []
}

function getAgentRationale(a) {
  const raw =
    a.rationale ?? a.purpose ?? a.Purpose ?? a.summary ?? a.role ?? a.description ?? a.role_description ?? ''
  return (typeof raw === 'string' ? raw : String(raw ?? '')).trim()
}

function getAgentKeyActions(a) {
  const raw =
    a.key_actions ?? a.keyActions ?? a['Key Actions'] ?? a.KeyActions ?? a.key_actions_list ?? a.actions ?? []
  return normalizeKeyActions(Array.isArray(raw) ? raw : raw)
}

function getAgentEstimatedTime(a) {
  const raw = a.estimated_time ?? a.estimatedTime ?? a['Estimated Time'] ?? a.EstimatedTime ?? a.duration ?? ''
  const s = (typeof raw === 'string' ? raw : String(raw ?? '')).trim()
  return s || '—'
}

/** Reject junk names from demo flow / non-agent lines (e.g. "s 1-5)", ")", "2."). Real names are Title Case phrases. */
function isValidAgentName(name) {
  const s = String(name ?? '').trim()
  if (s.length < 3) return false
  const first = s[0]
  if (first && first >= 'a' && first <= 'z') return false
  let hasLetter = false
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
      hasLetter = true
      break
    }
  }
  return hasLetter
}

export function normalizePlan(plan) {
  let agents = Array.isArray(plan.agents) ? plan.agents : []
  // Filter out "Suite" pseudo-agents, invalid agent_number, and junk names from demo flow
  agents = agents.filter((a) => {
    const name = String(a.name ?? a.title ?? '').toLowerCase()
    const num = a.agent_number ?? a.agentNumber
    if (name.includes('suite')) return false
    if (num == null || Number.isNaN(Number(num))) return false
    if (!isValidAgentName(a.name ?? a.title ?? '')) return false
    return true
  })
  return {
    ...plan,
    agents: agents.map((a, i) => {
      const rationale = getAgentRationale(a)
      const keyActions = getAgentKeyActions(a)
      const description = (a.description ?? '').trim() || rationale
      const rawName = (a.name ?? a.title ?? `Agent ${i + 1}`).trim()
      return {
        ...a,
        agent_number: a.agent_number ?? a.agentNumber ?? i + 1,
        name: stripQuotes(rawName),
        description: description || rationale,
        type: a.type ?? 'agent',
        rationale: rationale || (description ? description.split(/\n/)[0] : ''),
        key_actions: keyActions,
        estimated_time: getAgentEstimatedTime(a),
      }
    }),
  }
}
