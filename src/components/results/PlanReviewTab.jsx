import { useState } from 'react'
import { toast } from 'sonner'
import { usePlanStore } from '../../stores/planStore'
import { useUiStore } from '../../stores/uiStore'
import { useResultsStore } from '../../stores/resultsStore'
import { buildPass2Payload } from '../../services/pass2Builder'
import { buildContextPayload, validateContextLibraryNoPlaceholders } from '../../services/payloadBuilder'
import { generateAgents } from '../../services/falconAI'
import { parseAgentConfigs } from '../../services/agentParser'
import { validateResponse } from '../../services/validation'
import { generateDemoScript } from '../../services/scriptGenerator'
import { genPromptText } from '../../config/prompts'
import PlanAgentCard from '../plan-review/PlanAgentCard'
import AddedAgentCard from '../plan-review/AddedAgentCard'
import PlanActions from '../plan-review/PlanActions'
import FalconAILoading from '../shared/FalconAILoading'

export default function PlanReviewTab() {
  const originalPlan = usePlanStore((s) => s.originalPlan)
  const planLoading = usePlanStore((s) => s.isLoading)
  const strategyNotes = usePlanStore((s) => s.strategyNotes)
  const setStrategyNotes = usePlanStore((s) => s.setStrategyNotes)
  const agentDecisions = usePlanStore((s) => s.agentDecisions)
  const toggleAgent = usePlanStore((s) => s.toggleAgent)
  const setAllAgentsIncluded = usePlanStore((s) => s.setAllAgentsIncluded)
  const setAgentNotes = usePlanStore((s) => s.setAgentNotes)
  const addedAgents = usePlanStore((s) => s.addedAgents)
  const addAgent = usePlanStore((s) => s.addAgent)
  const removeAddedAgent = usePlanStore((s) => s.removeAddedAgent)

  const setStep = useUiStore((s) => s.setStep)
  const setResultsTab = useUiStore((s) => s.setResultsTab)
  const planAgentPanelIndex = useUiStore((s) => s.planAgentPanelIndex)
  const setPlanAgentPanelIndex = useUiStore((s) => s.setPlanAgentPanelIndex)
  const setAgents = useResultsStore((s) => s.setAgents)
  const setDemoScript = useResultsStore((s) => s.setDemoScript)
  const setLoading = useResultsStore((s) => s.setLoading)
  const setError = useResultsStore((s) => s.setError)

  const [addName, setAddName] = useState('')
  const [addDesc, setAddDesc] = useState('')
  const [generating, setGenerating] = useState(false)
  const [addCustomAgentExpanded, setAddCustomAgentExpanded] = useState(false)

  if (!originalPlan) {
    return (
      <div className="text-med-grey text-sm">
        {planLoading ? (
          <FalconAILoading />
        ) : (
          <p>
            Run Pass 1 from Step 5 (click "Send to Falcon AI") to load the plan. Then toggle agents, add notes, and approve to generate.
          </p>
        )}
      </div>
    )
  }

  if (generating || error) {
    return (
      <div className="text-med-grey text-sm">
        <FalconAILoading error={error || undefined} onRetry={handleApprove} />
      </div>
    )
  }

  const agents = originalPlan?.agents ?? []

  const handleApprove = async () => {
    const validation = validateContextLibraryNoPlaceholders()
    if (!validation.valid) {
      toast.error(`Context library file ${validation.fileName} contains placeholder content. Replace with real content before generating.`)
      return
    }
    setError(null)
    setGenerating(true)
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 0))

    try {
      const payload = buildPass2Payload(genPromptText)
      if (typeof console !== 'undefined') console.log('[PlanReview] Approve & Generate: payload built, keys:', Object.keys(payload))
      const result = await generateAgents(payload)
      if (typeof result === 'object' && result?.error) {
        setError(result.error)
        toast.error(result.error)
        return
      }
      const responseText = typeof result === 'string' ? result : ''
      const agents = parseAgentConfigs(responseText)
      const validationResult = validateResponse(responseText, agents)
      setAgents(agents, validationResult)
      const context = buildContextPayload()
      const script = generateDemoScript(agents, context, validationResult)
      setDemoScript(script)
      setResultsTab('agents')
      toast.success('Agents generated.')
    } finally {
      setGenerating(false)
      setLoading(false)
    }
  }

  const handleRegenerate = () => {
    setStep(5)
  }

  const handleBack = () => {
    setStep(5)
  }

  const handleAddAgent = () => {
    addAgent(addName, addDesc)
    setAddName('')
    setAddDesc('')
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-1 min-h-0 gap-0">
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
            <p className="text-sm font-medium text-ash">Plan agents ({agents.length})</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAllAgentsIncluded(true)}
                className="text-xs px-2 py-1 rounded bg-stone text-ash hover:bg-primer"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setAllAgentsIncluded(false)}
                className="text-xs px-2 py-1 rounded bg-stone text-ash hover:bg-primer"
              >
                Deselect all
              </button>
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
              <p className="text-sm font-medium text-ash mb-2">Added agents</p>
              <ul className="space-y-2">
                {addedAgents.map((a) => (
                  <li key={a.id}>
                    <AddedAgentCard agent={a} onRemove={removeAddedAgent} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 shrink-0">
            <button
              type="button"
              onClick={() => setAddCustomAgentExpanded((v) => !v)}
              className="px-3 py-2 rounded border border-stone bg-charcoal text-ash text-sm font-medium hover:bg-stone"
            >
              {addCustomAgentExpanded ? '− Add custom agent' : '+ Add custom agent'}
            </button>
            {addCustomAgentExpanded && (
              <div className="p-3 rounded border border-t-0 border-stone bg-charcoal mt-0">
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Name"
                  className="w-full mb-2 px-3 py-2 rounded bg-pv-black border border-stone text-ash text-sm"
                />
                <input
                  type="text"
                  value={addDesc}
                  onChange={(e) => setAddDesc(e.target.value)}
                  placeholder="Description"
                  className="w-full mb-2 px-3 py-2 rounded bg-pv-black border border-stone text-ash text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddAgent}
                  className="px-3 py-1.5 rounded bg-stone text-ash text-sm hover:bg-primer"
                >
                  Add agent
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 shrink-0 border-t border-stone pt-4">
            <label className="block text-sm font-medium text-med-grey mb-2">Strategy notes</label>
            <textarea
              value={strategyNotes}
              onChange={(e) => setStrategyNotes(e.target.value)}
              placeholder="Optional notes for generation..."
              className="w-full h-20 px-3 py-2 rounded bg-charcoal border border-stone text-ash placeholder-concrete focus:border-cta-steel focus:outline-none text-sm"
            />
          </div>

          <PlanActions
            onApprove={handleApprove}
            onRegenerate={handleRegenerate}
            onBack={handleBack}
            loading={generating}
          />
        </div>
      </div>
    </div>
  )
}
