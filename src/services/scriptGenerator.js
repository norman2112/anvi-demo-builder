/**
 * Generate demo script from approved agents and context.
 * Returns { markdown, sections } for teleprompter-style display and export.
 */

function escapeForMarkdown(s) {
  if (s == null) return ''
  return String(s).trim()
}

export function generateDemoScript(agents, context, validation) {
  const companyContext = context?.companyContext ?? ''
  const demoObjectives = context?.demoObjectives ?? ''
  const agentList = Array.isArray(agents) ? agents : []

  const sections = []

  // Opening
  const openingLines = [
    'Welcome to this demo.',
    companyContext ? `Context: ${companyContext.slice(0, 300)}${companyContext.length > 300 ? '…' : ''}` : '',
    demoObjectives ? `Today’s objectives: ${demoObjectives.slice(0, 300)}${demoObjectives.length > 300 ? '…' : ''}` : '',
  ].filter(Boolean)
  sections.push({
    type: 'opening',
    title: 'Opening',
    content: openingLines.join('\n\n'),
  })

  // One section per agent
  agentList.forEach((agent, i) => {
    const name = agent?.name ?? `Agent ${i + 1}`
    const instructions = agent?.instructions ?? agent?.raw ?? (typeof agent === 'string' ? agent : '')
    const scriptContent =
      typeof instructions === 'string' ? instructions : JSON.stringify(instructions, null, 2)
    sections.push({
      type: 'agent',
      agentNumber: i + 1,
      name,
      content: scriptContent,
    })
    sections.push({
      type: 'callout',
      title: '💡 Business value',
      content: `Highlight the outcome and value of ${name} for the customer.`,
    })
  })

  // Closing
  sections.push({
    type: 'closing',
    title: 'Closing',
    content: [
      'Summarize what we showed and how it supports the objectives.',
      'Thank the audience and offer next steps or Q&A.',
    ].join('\n\n'),
  })

  const markdown = sectionsToMarkdown(sections)
  return { markdown, sections }
}

function sectionsToMarkdown(sections) {
  const lines = ['# Demo script', '']
  for (const s of sections) {
    if (s.type === 'opening' || s.type === 'closing') {
      lines.push(`## ${s.title}`, '')
      lines.push(escapeForMarkdown(s.content), '', '')
    } else if (s.type === 'agent') {
      lines.push(`## Agent ${s.agentNumber}: ${s.name}`, '')
      const code = escapeForMarkdown(s.content)
      const fence = code.includes('```') ? '````' : '```'
      lines.push(fence, code, fence, '', '')
    } else if (s.type === 'callout') {
      lines.push(`### ${s.title ?? '💡 Business value'}`, '')
      lines.push(escapeForMarkdown(s.content), '', '')
    }
  }
  return lines.join('\n').trim()
}

export function getDemoScriptMarkdown(script) {
  if (typeof script === 'string') return script
  return script?.markdown ?? ''
}
