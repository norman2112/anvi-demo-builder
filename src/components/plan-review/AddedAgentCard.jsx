export default function AddedAgentCard({ agent, onRemove }) {
  return (
    <div className="p-4 rounded-lg border border-white/5 bg-[#141414]">
      <div className="flex justify-between items-start gap-2">
        <span className="text-sm font-medium text-white">{agent?.name ?? 'Custom'}</span>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(agent.id)}
            className="text-flash-red/80 hover:text-flash-red text-sm font-medium transition-all duration-150 shrink-0"
          >
            Remove
          </button>
        )}
      </div>
      <p className="text-xs text-white/40 mt-1">{agent?.description}</p>
    </div>
  )
}
