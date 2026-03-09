function safeArrayFromOData(raw) {
  if (!raw) return []
  // Common OData JSON shapes: { d: { results: [] } } or { value: [] }
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw.value)) return raw.value
  if (raw.d && Array.isArray(raw.d.results)) return raw.d.results
  if (raw.d && Array.isArray(raw.d)) return raw.d
  return []
}

export function formatStrategyHierarchy(raw) {
  const rawItems = safeArrayFromOData(raw)
  const byCode = new Map()

  for (const item of rawItems) {
    const code = String(item.strategy_code ?? '').trim()
    if (!code) continue
    if (!byCode.has(code)) byCode.set(code, item)
  }

  const items = Array.from(byCode.values())
  const lines = []

  for (const item of items.slice(0, 50)) {
    const depth = Number(item.depth ?? 0) || 0
    const indent = '  '.repeat(Math.max(0, depth - 1))
    const code = String(item.strategy_code ?? '').trim()

    let name = ''
    if (depth >= 1 && depth <= 7) {
      const key = `Strategy_L${depth}`
      name = String(item[key] ?? '').trim()
    }
    if (!name) {
      name = String(item.Strategy_Description ?? '').trim()
    }

    const overall = String(item.Overall_status_Assessment ?? '').trim()
    const scheduleStart = String(item.schedule_start ?? '').trim()
    const scheduleFinish = String(item.schedule_finish ?? '').trim()
    const targetStart = String(item.target_start ?? '').trim()
    const targetFinish = String(item.target_finish ?? '').trim()

    const parts = []
    if (code) parts.push(code)
    if (name) parts.push(name)
    const main = parts.join(' — ') || '(unnamed strategy item)'

    const meta = []
    if (overall) meta.push(`overall: ${overall}`)
    if (scheduleStart || scheduleFinish) {
      meta.push(`schedule: ${scheduleStart || '?'} → ${scheduleFinish || '?'}`)
    }
    if (targetStart || targetFinish) {
      meta.push(`target: ${targetStart || '?'} → ${targetFinish || '?'}`)
    }

    const line = meta.length ? `${indent}- ${main} (${meta.join(', ')})` : `${indent}- ${main}`
    lines.push(line)
  }

  return {
    text:
      lines.length > 0
        ? ['## Portfolios Strategy Context', '', '### Strategy Hierarchy', ...lines].join('\n')
        : '',
    count: items.length,
  }
}

export function formatProjectPortfolio(raw) {
  const rawItems = safeArrayFromOData(raw)
  const filtered = rawItems.filter((item) => {
    const wbs02 = String(item.WBS02 ?? '').toLowerCase()
    const name = String(item.Project_Name ?? '').toLowerCase()
    if (wbs02.includes('archived') || wbs02.includes('test data') || wbs02.includes('templates')) return false
    if (name.includes('test') || name.includes('template')) return false
    return true
  })

  const items = filtered
  const lines = []

  for (const item of items.slice(0, 30)) {
    const name = String(item.Project_Name ?? '').trim()
    const status = String(item.Project_Status ?? '').trim()
    const lifecycle = String(item.Lifecycle_Stage ?? '').trim()
    const overall = String(item.Overall_Status_Assessment ?? '').trim()
    const manager = String(item.Project_Manager ?? '').trim()
    const sponsor = String(item.Project_Sponsor ?? '').trim()
    const executionType = String(item.Execution_Type ?? '').trim()
    const workType = String(item.Work_Type ?? '').trim()
    const percentComplete = String(item.Percent_Complete ?? '').trim()
    const actualStart = String(item.Actual_Schedule_Start ?? '').trim()
    const actualFinish = String(item.Actual_Schedule_Finish ?? '').trim()
    const baselineStart = String(item.Baseline_Start ?? '').trim()
    const baselineFinish = String(item.Baseline_Finish ?? '').trim()
    const location = String(item.Location ?? '').trim()
    const wbs02 = String(item.WBS02 ?? '').trim()
    const wbs03 = String(item.WBS03 ?? '').trim()
    const wbs04 = String(item.WBS04 ?? '').trim()

    const parts = []
    if (name) parts.push(name)
    const meta = []
    if (status) meta.push(`status: ${status}`)
    if (lifecycle) meta.push(`lifecycle: ${lifecycle}`)
    if (overall) meta.push(`overall: ${overall}`)
    if (manager) meta.push(`PM: ${manager}`)
    if (sponsor) meta.push(`Sponsor: ${sponsor}`)
    if (percentComplete) meta.push(`% complete: ${percentComplete}`)
    if (executionType) meta.push(`Execution: ${executionType}`)
    if (workType) meta.push(`Work type: ${workType}`)
    if (location) meta.push(`Location: ${location}`)
    if (wbs02) meta.push(`WBS02: ${wbs02}`)
    if (wbs03) meta.push(`WBS03: ${wbs03}`)
    if (wbs04) meta.push(`WBS04: ${wbs04}`)
    if (actualStart || actualFinish) {
      meta.push(`actual: ${actualStart || '?'} → ${actualFinish || '?'}`)
    }
    if (baselineStart || baselineFinish) {
      meta.push(`baseline: ${baselineStart || '?'} → ${baselineFinish || '?'}`)
    }

    const main = parts.join(' — ') || '(unnamed project)'
    const line = meta.length ? `- ${main} (${meta.join(', ')})` : `- ${main}`
    lines.push(line)
  }

  return {
    text:
      lines.length > 0
        ? ['### Project Portfolio', ...lines].join('\n')
        : '',
    count: items.length,
  }
}

