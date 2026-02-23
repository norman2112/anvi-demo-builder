import Checkbox from '../shared/Checkbox'

export default function PlanAgentCard({ agent, index, included, onToggle, isSelected, onSelect }) {
  const summary =
    agent?.rationale?.trim() ||
    (agent?.description ? agent.description.split(/\n/)[0].slice(0, 80) + (agent.description.length > 80 ? '…' : '') : '')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(index)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect?.(index)}
      className={`p-5 rounded-xl border cursor-pointer transition-all duration-150 mb-3 ${
        isSelected
          ? 'border-cta-steel/50 bg-cta-steel/5'
          : 'border-white/5 bg-[#141414] hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-4">
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={included}
            onChange={() => onToggle?.(index)}
            aria-label={`Include ${agent?.name ?? `Agent ${index + 1}`}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-light text-white truncate">{agent?.name ?? `Agent ${index + 1}`}</p>
          {summary && <p className="text-xs text-white/40 mt-1 line-clamp-2">{summary}</p>}
        </div>
      </div>
    </div>
  )
}
