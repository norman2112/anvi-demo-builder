import { useState } from 'react'
import { useContextStore } from '../../stores/contextStore'
import { useConnectionStore } from '../../stores/connectionStore'
import { useBoardStore } from '../../stores/boardStore'
import { usePlanStore } from '../../stores/planStore'

export default function Step5_Review() {
  const [payloadOpen, setPayloadOpen] = useState(false)
  const companyContext = useContextStore((s) => s.companyContext)
  const demoObjectives = useContextStore((s) => s.demoObjectives)
  const refFiles = useContextStore((s) => s.refFiles)
  const boards = useConnectionStore((s) => s.boards)
  const getSelectedBoards = useBoardStore((s) => s.getSelectedBoards)
  const selected = getSelectedBoards()
  const lastSentPlanPayload = usePlanStore((s) => s.lastSentPlanPayload)
  const lastFalconPlanResponseText = usePlanStore((s) => s.lastFalconPlanResponseText)

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Review & Send</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="min-h-[500px] p-5 rounded-xl bg-[#141414] border border-white/5 flex flex-col">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 shrink-0">Company Context</h2>
          <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed overflow-y-auto flex-1 min-h-0">
            {companyContext || '—'}
          </p>
        </div>
        <div className="min-h-[500px] p-5 rounded-xl bg-[#141414] border border-white/5 flex flex-col">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2 shrink-0">Demo Objectives</h2>
          <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed overflow-y-auto flex-1 min-h-0">
            {demoObjectives || '—'}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-[#141414] border border-white/5">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Reference Files</h2>
          <p className="text-3xl font-thin text-white">{refFiles.length} file(s)</p>
        </div>
        <div className="p-5 rounded-xl bg-[#141414] border border-white/5">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Boards</h2>
          <p className="text-3xl font-thin text-white">{selected.length} of {boards.length} selected</p>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 mt-8">
        <button
          type="button"
          onClick={() => setPayloadOpen((o) => !o)}
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-all duration-150"
        >
          <span className="text-sm" aria-hidden>{payloadOpen ? '▼' : '▶'}</span>
          Payload (debug)
        </button>
        {payloadOpen && (
          <div className="mt-3 text-sm text-white/60 space-y-4">
            <p>
              {lastSentPlanPayload
                ? 'Payload sent to Falcon AI (Pass 1).'
                : 'Click "Send to Falcon AI" below to assemble and send — it will appear here.'}
            </p>
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Request payload</p>
            <pre className="p-4 bg-[#0f0f0f] rounded-lg overflow-auto font-mono text-xs text-white/40 max-h-64">
              {lastSentPlanPayload ? JSON.stringify(lastSentPlanPayload, null, 2) : '—'}
            </pre>
            {lastFalconPlanResponseText != null && lastFalconPlanResponseText !== '' && (
              <>
                <p className="text-xs font-medium text-white/40 uppercase tracking-widest mt-4 mb-2">Raw response from Falcon AI</p>
                <pre className="p-4 bg-[#0f0f0f] rounded-lg overflow-auto font-mono text-xs text-white/40 max-h-64 whitespace-pre-wrap">
                  {lastFalconPlanResponseText}
                </pre>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
