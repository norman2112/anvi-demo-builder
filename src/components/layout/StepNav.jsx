import { useUiStore } from '../../stores/uiStore'
import { useSendPlanToFalcon } from '../../hooks/useSendPlanToFalcon'
import { usePlanReviewActions } from '../../hooks/usePlanReviewActions'

export default function StepNav() {
  const currentStep = useUiStore((s) => s.currentStep)
  const setStep = useUiStore((s) => s.setStep)
  const { send, loading } = useSendPlanToFalcon()
  const planReview = usePlanReviewActions()

  const footerClass =
    'fixed bottom-0 right-0 left-72 h-16 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between px-10 z-40'

  const backBtnClass =
    'px-6 py-2.5 rounded-lg bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 font-medium'
  const primaryBtnClass =
    'px-6 py-2.5 rounded-lg bg-cta-steel hover:bg-cta-steel-hover text-white font-medium disabled:opacity-50 transition-all duration-150 hover:scale-[1.01]'
  const goBtnClass =
    'px-6 py-2.5 rounded-lg bg-pv-red hover:bg-scarlet text-white font-medium disabled:opacity-50 transition-all duration-150 hover:scale-[1.01]'

  if (currentStep === 7 || currentStep === 8) {
    return (
      <div className={footerClass}>
        <button
          type="button"
          onClick={() => setStep(6)}
          className="text-cta-ice hover:underline text-sm font-medium transition-all duration-150"
        >
          ← Back to Plan Review
        </button>
        <span />
      </div>
    )
  }

  if (currentStep === 6) {
    const { onApprove, onRegenerate, onBack, generating } = planReview
    return (
      <div className={footerClass}>
        <button type="button" onClick={onBack} className={backBtnClass}>
          Back
        </button>
        <span className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={generating}
            className="px-6 py-2.5 rounded-lg bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-medium disabled:opacity-50 transition-all duration-150"
          >
            Regenerate
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={generating}
            className={goBtnClass}
          >
            {generating ? 'Generating…' : 'Approve & Generate'}
          </button>
        </span>
      </div>
    )
  }

  return (
    <div className={footerClass}>
      <button
        type="button"
        onClick={() => setStep(currentStep - 1)}
        disabled={currentStep <= 1}
        className={backBtnClass}
      >
        Back
      </button>
      <span className="flex shrink-0">
        {currentStep === 5 ? (
          <button
            type="button"
            onClick={send}
            disabled={loading}
            className={goBtnClass}
          >
            {loading ? 'Sending to Falcon AI…' : 'Send to Falcon AI'}
          </button>
        ) : currentStep < 8 ? (
          <button
            type="button"
            onClick={() => setStep(currentStep + 1)}
            className={primaryBtnClass}
          >
            Continue
          </button>
        ) : null}
      </span>
    </div>
  )
}
