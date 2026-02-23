import { usePlanStore } from '../../stores/planStore'

export default function StrategyNotes() {
  const strategyNotes = usePlanStore((s) => s.strategyNotes)
  const setStrategyNotes = usePlanStore((s) => s.setStrategyNotes)

  return (
    <div>
      <label className="block text-sm font-medium text-med-grey mb-2">Strategy notes</label>
      <textarea
        value={strategyNotes}
        onChange={(e) => setStrategyNotes(e.target.value)}
        placeholder="Global notes for Pass 2..."
        className="w-full h-24 px-3 py-2 rounded bg-charcoal border border-stone text-ash"
      />
    </div>
  )
}
