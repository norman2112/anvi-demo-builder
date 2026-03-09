import ReactMarkdown from 'react-markdown'

function toKeyActionsList(agent) {
  const raw =
    agent.key_actions ?? agent.keyActions ?? agent['Key Actions'] ?? agent.KeyActions ?? agent.actions ?? []
  if (Array.isArray(raw) && raw.length > 0) return raw.filter((x) => x != null && String(x).trim())
  if (typeof raw === 'string' && raw.trim()) {
    return raw.split(/\n+/).map((s) => s.trim()).filter(Boolean)
  }
  return []
}

function getPurpose(agent) {
  const v =
    agent.rationale ?? agent.purpose ?? agent.Purpose ?? agent.summary ?? agent.role ?? agent.description ?? agent.role_description ?? ''
  return (typeof v === 'string' ? v : String(v ?? '')).trim() || '—'
}

function getEstimatedTime(agent) {
  const v = agent.estimated_time ?? agent.estimatedTime ?? agent['Estimated Time'] ?? agent.EstimatedTime ?? agent.duration ?? ''
  return (typeof v === 'string' ? v : String(v ?? '')).trim() || '—'
}

const markdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-base font-semibold text-white mt-2 mb-1" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-sm font-semibold text-white mt-2 mb-1" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-sm font-semibold text-white mt-2 mb-1" {...props} />,
  p: ({ node, ...props }) => <p className="text-sm text-white/60 mb-2 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => (
    <ul className="list-disc list-inside text-sm text-white/60 mb-2 space-y-1 pl-2" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal list-inside text-sm text-white/60 mb-2 space-y-1 pl-2" {...props} />
  ),
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-white/80" {...props} />,
  code: ({ node, ...props }) => {
    const text = String(props.children ?? '')
    const isBlock = text.includes('\n')
    return isBlock ? (
      <code className="block p-3 rounded bg-[#0f0f0f] text-white/70 font-mono text-xs overflow-x-auto mb-2 whitespace-pre" {...props} />
    ) : (
      <code className="px-1.5 py-0.5 rounded bg-[#0f0f0f] text-cta-ice font-mono text-xs" {...props} />
    )
  },
  pre: ({ node, ...props }) => <pre className="p-0 rounded overflow-x-auto mb-2 my-2" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-cta-steel pl-3 text-white/60 text-sm italic my-2" {...props} />
  ),
  a: ({ node, ...props }) => <a className="text-cta-ice hover:underline" {...props} />,
}

export default function PlanAgentDetailPanel({ agent, notes, onNotesChange, onClose }) {
  if (!agent) return null
  const purpose = getPurpose(agent)
  const keyActions = toKeyActionsList(agent)
  const estimatedTime = getEstimatedTime(agent)

  return (
    <div className="h-full flex flex-col bg-[#111111] border-l border-white/5 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
        <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Agent Details</span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-white/30 hover:text-white/60 focus:outline-none transition-all duration-150"
          aria-label="Close panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto p-6 space-y-6">
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Name</p>
          <p className="text-white font-medium">{agent.name ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Purpose</p>
          <div className="text-sm text-white/60 leading-relaxed">
            <ReactMarkdown components={markdownComponents}>{purpose}</ReactMarkdown>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Key Actions</p>
          {keyActions.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-white/60 space-y-1">
              {keyActions.map((action, i) => (
                <li key={i}>
                  <ReactMarkdown components={markdownComponents}>{action}</ReactMarkdown>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/40">—</p>
          )}
        </div>
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Estimated Time</p>
          <p className="text-sm text-white/60">{estimatedTime}</p>
        </div>
        <div className="mt-6">
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Notes</p>
          <textarea
            value={notes ?? ''}
            onChange={(e) => onNotesChange?.(e.target.value)}
            placeholder="Notes for this agent..."
            className="w-full min-h-[100px] px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none text-sm resize-y transition-all duration-150"
          />
        </div>
      </div>
    </div>
  )
}
