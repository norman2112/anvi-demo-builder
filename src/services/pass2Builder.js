import { buildContextPayload } from './payloadBuilder.js'
import { usePlanStore } from '../stores/planStore'

export function buildPass2Payload(genPromptText) {
  const context = buildContextPayload()
  const { originalPlan, agentDecisions, addedAgents, strategyNotes } = usePlanStore.getState()
  const approved = (originalPlan?.agents ?? [])
    .filter((_, i) => agentDecisions.find((d) => d.agent_number === i + 1)?.included)
    .map((agent, idx) => {
      const agentNumber = agent.agent_number ?? idx + 1
      const decision = agentDecisions.find((d) => d.agent_number === agentNumber)
      const notes = decision?.notes ?? ''
      return { ...agent, notes }
    })
  return {
    ...context,
    approvedAgents: approved,
    addedAgents: addedAgents || [],
    strategyNotes: strategyNotes || '',
    generationInstructions: genPromptText || '',
  }
}
