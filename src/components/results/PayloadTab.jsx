import { usePlanStore } from '../../stores/planStore'

export default function PayloadTab() {
  const lastSentPlanPayload = usePlanStore((s) => s.lastSentPlanPayload)
  const lastFalconPlanResponseText = usePlanStore((s) => s.lastFalconPlanResponseText)

  return (
    <div className="text-sm text-med-grey space-y-8">
      <section>
        <p>
          {lastSentPlanPayload
            ? 'Payload sent to Falcon AI (Pass 1) from Step 5.'
            : 'Run Step 5 and click "Send to Falcon AI" to assemble and send the payload — it will appear here.'}
        </p>
        <p className="text-xs font-medium text-concrete uppercase mt-4 mb-2">Request payload</p>
        <pre className="p-4 bg-charcoal rounded overflow-auto text-xs max-h-[50vh]">
          {lastSentPlanPayload ? JSON.stringify(lastSentPlanPayload, null, 2) : '—'}
        </pre>
      </section>

      {lastFalconPlanResponseText != null && lastFalconPlanResponseText !== '' && (
        <section>
          <p className="text-xs font-medium text-concrete uppercase mb-2">Raw response from Falcon AI</p>
          <pre className="p-4 bg-charcoal rounded overflow-auto text-xs max-h-[50vh] whitespace-pre-wrap">
            {lastFalconPlanResponseText}
          </pre>
        </section>
      )}
    </div>
  )
}
