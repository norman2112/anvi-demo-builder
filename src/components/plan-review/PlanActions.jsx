export default function PlanActions({ onApprove, onRegenerate, onBack, loading }) {
  return (
    <div className="flex gap-2 pt-6">
      <button
        type="button"
        onClick={onBack}
        className="px-6 py-2.5 rounded-lg bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-medium transition-all duration-150"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onRegenerate}
        disabled={loading}
        className="px-6 py-2.5 rounded-lg bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-medium disabled:opacity-50 transition-all duration-150"
      >
        Regenerate
      </button>
      <button
        type="button"
        onClick={onApprove}
        disabled={loading}
        className="flex-1 px-6 py-2.5 rounded-lg bg-cta-steel hover:bg-cta-steel-hover text-white font-medium disabled:opacity-50 transition-all duration-150 hover:scale-[1.01] w-full"
      >
        {loading ? 'Generating…' : 'Approve & Generate'}
      </button>
    </div>
  )
}
