import { useState } from 'react'
import { usePlanStore } from '../../stores/planStore'
import { useUiStore } from '../../stores/uiStore'
import PlanAgentCard from '../plan-review/PlanAgentCard'
import AddedAgentCard from '../plan-review/AddedAgentCard'
import FalconAILoading from '../shared/FalconAILoading'

export default function Step6_PlanReview() {
  const originalPlan = usePlanStore((s) => s.originalPlan)
  const planLoading = usePlanStore((s) => s.isLoading)
  const strategyNotes = usePlanStore((s) => s.strategyNotes)
  const setStrategyNotes = usePlanStore((s) => s.setStrategyNotes)
  const agentDecisions = usePlanStore((s) => s.agentDecisions)
  const toggleAgent = usePlanStore((s) => s.toggleAgent)
  const setAllAgentsIncluded = usePlanStore((s) => s.setAllAgentsIncluded)
  const addedAgents = usePlanStore((s) => s.addedAgents)
  const addAgent = usePlanStore((s) => s.addAgent)
  const removeAddedAgent = usePlanStore((s) => s.removeAddedAgent)

  const planAgentPanelIndex = useUiStore((s) => s.planAgentPanelIndex)
  const setPlanAgentPanelIndex = useUiStore((s) => s.setPlanAgentPanelIndex)

  const [addName, setAddName] = useState('')
  const [addDesc, setAddDesc] = useState('')
  const [addCustomAgentExpanded, setAddCustomAgentExpanded] = useState(false)

  if (!originalPlan) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Plan Review</h1>
        <div className="text-sm text-white/60 leading-relaxed">
          {planLoading ? (
            <FalconAILoading />
          ) : (
            <p>
              Run Pass 1 from Step 5 (click "Send to Falcon AI") to load the plan. Then toggle agents, add notes, and approve to generate.
            </p>
          )}
        </div>
      </div>
    )
  }

  const agents = originalPlan?.agents ?? []

  const handleAddAgent = () => {
    addAgent(addName, addDesc)
    setAddName('')
    setAddDesc('')
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <h1 className="text-4xl font-thin text-white tracking-tight shrink-0 mb-8">Plan Review</h1>
      <div className="flex flex-1 min-h-0 gap-0">
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3 shrink-0">
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Plan Agents ({agents.length})</p>
            <div className="flex items-center gap-0">
              {(() => {
                const allSelected = agents.length > 0 && agents.every((_, i) => (agentDecisions.find((d) => d.agent_number === i + 1)?.included ?? true))
                const noneSelected = agents.length > 0 && agents.every((_, i) => !(agentDecisions.find((d) => d.agent_number === i + 1)?.included ?? true))
                const linkClass = 'text-xs font-medium cursor-pointer transition-all'
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setAllAgentsIncluded(true)}
                      className={allSelected ? `${linkClass} text-white/20 cursor-default` : `${linkClass} text-cta-ice hover:text-white`}
                    >
                      Select all
                    </button>
                    <span className="text-white/20 mx-1">|</span>
                    <button
                      type="button"
                      onClick={() => setAllAgentsIncluded(false)}
                      className={noneSelected ? `${linkClass} text-white/20 cursor-default` : `${linkClass} text-cta-ice hover:text-white`}
                    >
                      Deselect all
                    </button>
                  </>
                )
              })()}
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-auto pr-2">
            <ul className="space-y-2">
            {agents.map((a, i) => {
              const decision = agentDecisions.find((d) => d.agent_number === i + 1)
              return (
                <li key={i}>
                  <PlanAgentCard
                    agent={a}
                    index={i}
                    included={decision?.included ?? true}
                    onToggle={() => toggleAgent(i + 1)}
                    isSelected={planAgentPanelIndex === i}
                    onSelect={setPlanAgentPanelIndex}
                  />
                </li>
              )
            })}
            </ul>
          </div>

          {addedAgents.length > 0 && (
            <div className="mt-4 shrink-0">
              <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Added Agents</p>
              <ul className="space-y-2">
                {addedAgents.map((a) => (
                  <li key={a.id}>
                    <AddedAgentCard agent={a} onRemove={removeAddedAgent} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 shrink-0 border-t border-white/5 pt-6">
            <button
              type="button"
              onClick={() => setAddCustomAgentExpanded((v) => !v)}
              className="px-4 py-2.5 rounded-lg border border-white/10 bg-transparent text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all duration-150"
            >
              {addCustomAgentExpanded ? '− Add Custom Agent' : '+ Add Custom Agent'}
            </button>
            {addCustomAgentExpanded && (
              <div className="p-4 rounded-lg border border-t-0 border-white/5 bg-[#141414] mt-0 space-y-3">
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none text-sm"
                />
                <input
                  type="text"
                  value={addDesc}
                  onChange={(e) => setAddDesc(e.target.value)}
                  placeholder="Description"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddAgent}
                  className="px-4 py-2 rounded-lg bg-cta-steel hover:bg-cta-steel-hover text-white text-sm font-medium transition-all duration-150"
                >
                  Add agent
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 shrink-0 border-t border-white/5 pt-6">
            <label className="block text-sm font-medium text-white/70 mb-2">Strategy Notes</label>
            <textarea
              value={strategyNotes}
              onChange={(e) => setStrategyNotes(e.target.value)}
              placeholder="Optional notes for generation..."
              className="w-full min-h-[100px] px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none text-sm resize-y transition-all duration-150"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
