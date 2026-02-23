import { useState } from 'react'
import AgentTypePill from './AgentTypePill'
import AgentInstructions from './AgentInstructions'
import CopyButton from '../shared/CopyButton'

function getAgentDisplayContent(agent) {
  if (agent == null) return ''
  if (typeof agent === 'string') return agent
  const raw = agent.raw ?? agent.instructions
  if (typeof raw === 'string') return raw
  return JSON.stringify(agent, null, 2)
}

function getAgentCopyText(agent) {
  if (agent == null) return ''
  if (typeof agent === 'string') return agent
  if (agent.raw && typeof agent.raw === 'string') return agent.raw
  return JSON.stringify(agent, null, 2)
}

/** Extract display name from agent.name or from raw content (e.g. **Name:** ...). */
function getDisplayName(agent, index) {
  const explicit = agent?.name
  if (explicit && String(explicit).trim() && String(explicit) !== `Agent ${index + 1}`) return String(explicit).trim()
  const raw = agent?.raw ?? agent?.instructions
  if (typeof raw === 'string') {
    const m = raw.match(/\*\*Name:\*\*\s*(.+?)(?=\n|$)/i) || raw.match(/^Name:\s*(.+?)(?=\n|$)/im)
    if (m && m[1]) return m[1].replace(/\*\*/g, '').trim()
  }
  return `Agent ${index + 1}`
}

function getAgentMarkdown(agent, name) {
  const content = getAgentCopyText(agent)
  return `# ${name}\n\n${content}`
}

function downloadAgentAsMarkdown(agent, name, index) {
  const md = getAgentMarkdown(agent, name)
  const safeName = (name || `agent-${index + 1}`).replace(/[^a-zA-Z0-9-_]/g, '_')
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safeName}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AgentCard({ agent, index, defaultCollapsed = true }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const name = getDisplayName(agent, index)
  const type = agent?.type ?? null
  const content = getAgentDisplayContent(agent)
  const copyText = getAgentCopyText(agent)

  return (
    <div className="rounded-xl border border-white/5 bg-[#141414] overflow-hidden mb-4">
      <div
        className="p-5 flex items-center gap-4 cursor-pointer transition-all duration-150 hover:bg-white/[0.02]"
        onClick={() => setCollapsed((c) => !c)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setCollapsed((c) => !c)}
      >
        <span className="w-8 h-8 rounded-full bg-cta-steel/15 text-cta-steel text-sm font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <span className="text-xl font-light text-white truncate flex-1 min-w-0">{name}</span>
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {type && <AgentTypePill type={type} />}
          <button
            type="button"
            onClick={() => downloadAgentAsMarkdown(agent, name, index)}
            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-pv-grass/15 text-pv-grass hover:bg-pv-grass/25 transition-colors"
          >
            Download
          </button>
          <CopyButton text={copyText} label="Copy" />
          <span className="text-white/30 text-sm" aria-hidden>
            {collapsed ? '▼' : '▲'}
          </span>
        </div>
      </div>
      {!collapsed && (
        <div className="border-t border-white/5 p-5">
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Anvi Agent Steps</p>
          <div className="bg-[#0f0f0f] rounded-lg p-4 font-mono text-xs text-white/60 leading-relaxed overflow-auto">
            <AgentInstructions text={content} highlightIds />
          </div>
        </div>
      )}
    </div>
  )
}
