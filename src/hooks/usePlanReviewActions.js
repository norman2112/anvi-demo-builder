import { useState } from 'react'
import { toast } from 'sonner'
import { usePlanStore } from '../stores/planStore'
import { useUiStore } from '../stores/uiStore'
import { useResultsStore } from '../stores/resultsStore'
import { buildPass2Payload } from '../services/pass2Builder'
import { buildContextPayload, validateContextLibraryNoPlaceholders } from '../services/payloadBuilder'
import { generateAgents } from '../services/falconAI'
import { parseAgentConfigs } from '../services/agentParser'
import { validateResponse } from '../services/validation'
import { generateDemoScript } from '../services/scriptGenerator'
import { genPromptText } from '../config/prompts'

export function usePlanReviewActions() {
  const setStep = useUiStore((s) => s.setStep)
  const setAgents = useResultsStore((s) => s.setAgents)
  const setDemoScript = useResultsStore((s) => s.setDemoScript)
  const setLoading = useResultsStore((s) => s.setLoading)
  const setError = useResultsStore((s) => s.setError)

  const [generating, setGenerating] = useState(false)

  const onApprove = async () => {
    const validation = validateContextLibraryNoPlaceholders()
    if (!validation.valid) {
      toast.error(`Context library file ${validation.fileName} contains placeholder content. Replace with real content before generating.`)
      return
    }
    setError(null)
    setStep(7)
    setGenerating(true)
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 0))

    try {
      const payload = buildPass2Payload(genPromptText)
      if (typeof console !== 'undefined') console.log('[PlanReview] Approve & Generate: payload built, keys:', Object.keys(payload))
      const responseText = await generateAgents(payload)
      const agents = parseAgentConfigs(responseText)
      const validationResult = validateResponse(responseText, agents)
      setAgents(agents, validationResult)
      const context = buildContextPayload()
      const script = generateDemoScript(agents, context, validationResult)
      setDemoScript(script)
      toast.success('Agents generated.')
    } catch (err) {
      const message = err?.message || 'Generation failed'
      setError(message)
      toast.error(message)
    } finally {
      setGenerating(false)
      setLoading(false)
    }
  }

  const onRegenerate = () => {
    setStep(5)
  }

  const onBack = () => {
    setStep(5)
  }

  return { onApprove, onRegenerate, onBack, generating }
}
