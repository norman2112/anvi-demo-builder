import { useState } from 'react'
import { toast } from 'sonner'
import { useUiStore } from '../stores/uiStore'
import { usePlanStore } from '../stores/planStore'
import { buildPlanRequestPayload, validateContextLibraryNoPlaceholders } from '../services/payloadBuilder'
import { fetchPlan } from '../services/falconAI'
import { planPromptText } from '../config/prompts'

export function useSendPlanToFalcon() {
  const [sending, setSending] = useState(false)
  const setStep = useUiStore((s) => s.setStep)
  const setPlanLoading = usePlanStore((s) => s.setPlanLoading)
  const setPlanError = usePlanStore((s) => s.setPlanError)
  const initFromPlan = usePlanStore((s) => s.initFromPlan)
  const setLastSentPlanPayload = usePlanStore((s) => s.setLastSentPlanPayload)
  const setLastFalconPlanResponseText = usePlanStore((s) => s.setLastFalconPlanResponseText)
  const planLoading = usePlanStore((s) => s.isLoading)
  const loading = planLoading || sending

  const send = async () => {
    const validation = validateContextLibraryNoPlaceholders()
    if (!validation.valid) {
      toast.error(`Context library file ${validation.fileName} contains placeholder content. Replace with real content before generating.`)
      return
    }
    setSending(true)
    setPlanLoading(true)
    setPlanError(null)
    try {
      const payload = buildPlanRequestPayload(planPromptText)
      setLastSentPlanPayload(payload)
      if (typeof console !== 'undefined') console.log('[Step5] Send to Falcon: payload built, keys:', Object.keys(payload))
      const result = await fetchPlan(payload)
      if (result.error) {
        setPlanError(result.error)
        toast.error(result.error)
        return
      }
      const { plan, rawResponseText } = result
      setLastFalconPlanResponseText(rawResponseText ?? '')
      initFromPlan(plan)
      setStep(6)
      toast.success('Plan loaded. Review and approve to generate.')
    } finally {
      setSending(false)
      setPlanLoading(false)
    }
  }

  return { send, loading }
}
