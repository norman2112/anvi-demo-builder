import { useMemo } from 'react'
import { useUiStore } from '../../stores/uiStore'
import { useContextStore } from '../../stores/contextStore'
import { useConnectionStore } from '../../stores/connectionStore'
import { useBoardStore } from '../../stores/boardStore'
import { useLibraryStore } from '../../stores/libraryStore'
import { usePlanStore } from '../../stores/planStore'
import { useResultsStore } from '../../stores/resultsStore'
import { buildContextPayload } from '../../services/payloadBuilder'
import { estimateTokens } from '../../utils/tokenEstimator'

const steps = [
  { num: 1, label: 'Company Context' },
  { num: 2, label: 'Reference Files' },
  { num: 3, label: 'Live Data' },
  { num: 4, label: 'Context Library' },
  { num: 5, label: 'Review & Send' },
  { num: 6, label: 'Plan Review' },
  { num: 7, label: 'Generated Agents' },
  { num: 8, label: 'Demo Script' },
]

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-pv-grass shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  )
}

function CircleIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-white/20 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

export default function Sidebar() {
  const currentStep = useUiStore((s) => s.currentStep)
  const setStep = useUiStore((s) => s.setStep)
  const companyContext = useContextStore((s) => s.companyContext)
  const demoObjectives = useContextStore((s) => s.demoObjectives)
  const refFiles = useContextStore((s) => s.refFiles)
  const customInstructions = useContextStore((s) => s.customInstructions)
  const boards = useConnectionStore((s) => s.boards)
  const selectedBoardIds = useBoardStore((s) => s.selectedBoardIds)
  const libraryFiles = useLibraryStore((s) => s.files)
  const originalPlan = usePlanStore((s) => s.originalPlan)
  const agents = useResultsStore((s) => s.agents)
  const demoScript = useResultsStore((s) => s.demoScript)

  const step6Enabled = !!originalPlan
  const step7And8Enabled = (agents?.length ?? 0) > 0 || !!demoScript

  const { payload, tokens } = useMemo(() => {
    try {
      const payload = buildContextPayload()
      const str = JSON.stringify(payload)
      return { payload, tokens: estimateTokens(str) }
    } catch {
      return { payload: null, tokens: 0 }
    }
  }, [
    companyContext,
    demoObjectives,
    refFiles,
    customInstructions,
    boards,
    selectedBoardIds,
    libraryFiles,
  ])

  const checklist = useMemo(() => {
    if (!payload) return []
    const cc = (payload.companyContext || '').trim()
    const dobj = (payload.demoObjectives || '').trim()
    const refCount = (payload.refFiles || []).length
    const selectedBoards = payload.selectedBoards || []
    const totalBoards = boards.length
    const librarySelected = (payload.contextLibrary || []).length
    const custom = (payload.customInstructions || '').trim()

    return [
      { label: 'Company Context', complete: cc.length > 0 },
      { label: 'Demo Objectives', complete: dobj.length > 0 },
      { label: 'Reference Files', complete: refCount > 0 },
      { label: 'Live Data', complete: totalBoards > 0 },
      { label: 'Context Library', complete: librarySelected > 0 },
      { label: 'Custom Instructions', complete: custom.length > 0 },
    ]
  }, [payload, boards.length])

  return (
    <div className="p-4 space-y-6">
      <nav className="space-y-1">
        <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">
          Steps
        </p>
        {steps.map(({ num, label }) => {
          const disabled =
            (num === 6 && !step6Enabled) ||
            ((num === 7 || num === 8) && !step7And8Enabled)
          const isActive = currentStep === num
          const isCompleted = num < currentStep && !disabled
          return (
            <button
              key={num}
              type="button"
              onClick={() => !disabled && setStep(num)}
              disabled={disabled}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                isActive
                  ? 'bg-white/5 text-white border-l-2 border-cta-steel pl-[14px]'
                  : disabled
                    ? 'text-white/20 cursor-not-allowed'
                    : isCompleted
                      ? 'text-white/60 hover:bg-white/[0.03] hover:text-white/70'
                      : 'text-white/40 hover:bg-white/[0.03] hover:text-white/60'
              }`}
            >
              {isCompleted ? <CheckIcon /> : null}
              <span>{num}.</span> {label}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-white/5 mt-6 pt-6">
        <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">
          Payload Preview
        </p>
        {checklist.length > 0 ? (
          <>
            <ul className="space-y-2">
              {checklist.map(({ label, complete }) => (
                <li key={label} className="flex items-center gap-2 text-xs">
                  <span className="shrink-0" aria-hidden>
                    {complete ? <CheckIcon /> : <CircleIcon />}
                  </span>
                  <span className="text-white/60">{label}</span>
                </li>
              ))}
            </ul>
            <p className="text-2xl font-thin text-cta-ice mt-3">
              ~{tokens.toLocaleString()} tokens
            </p>
          </>
        ) : (
          <p className="text-xs text-white/20">—</p>
        )}
      </div>
    </div>
  )
}
