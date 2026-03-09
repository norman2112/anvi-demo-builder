import { useConnectionStore } from '../../stores/connectionStore'
import { usePortfoliosStore } from '../../stores/portfoliosStore'
import { useUiStore } from '../../stores/uiStore'

export default function ConnectionChip() {
  const agileplaceConnected = useConnectionStore((s) => s.isConnected)
  const agileplaceUrl = useConnectionStore((s) => s.url)
  const portfoliosConnected = usePortfoliosStore((s) => s.isConnected)
  const portfoliosInstanceUrl = usePortfoliosStore((s) => s.instanceUrl)
  const setStep = useUiStore((s) => s.setStep)

  const goToStep3 = () => setStep(3)

  const anyConnected = agileplaceConnected || portfoliosConnected

  let label = 'Not connected'
  if (anyConnected) {
    if (agileplaceConnected && agileplaceUrl) {
      try {
        label = new URL(agileplaceUrl).hostname
      } catch {
        label = 'AgilePlace connected'
      }
    } else if (portfoliosConnected && portfoliosInstanceUrl) {
      try {
        label = new URL(portfoliosInstanceUrl).hostname
      } catch {
        label = 'Portfolios connected'
      }
    } else if (agileplaceConnected) {
      label = 'AgilePlace connected'
    } else if (portfoliosConnected) {
      label = 'Portfolios connected'
    }
  }

  return (
    <button
      type="button"
      onClick={goToStep3}
      title="Go to Planview Live Data (Step 3)"
      className={`px-3 py-1 rounded-full transition-all duration-150 ${
        anyConnected
          ? 'bg-pv-grass/15 text-pv-grass border border-pv-grass/20 text-sm font-medium'
          : 'bg-flash-red/15 text-flash-red/80 border border-flash-red/20 text-xs font-medium'
      }`}
    >
      {label}
    </button>
  )
}
