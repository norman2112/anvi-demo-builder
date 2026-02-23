import { useConnectionStore } from '../../stores/connectionStore'
import { useUiStore } from '../../stores/uiStore'

export default function ConnectionChip() {
  const isConnected = useConnectionStore((s) => s.isConnected)
  const url = useConnectionStore((s) => s.url)
  const setStep = useUiStore((s) => s.setStep)

  const goToStep3 = () => setStep(3)

  return (
    <button
      type="button"
      onClick={goToStep3}
      title="Go to Live Data (Step 3)"
      className={`px-3 py-1 rounded-full transition-all duration-150 ${
        isConnected
          ? 'bg-pv-grass/15 text-pv-grass border border-pv-grass/20 text-sm font-medium'
          : 'bg-flash-red/15 text-flash-red/80 border border-flash-red/20 text-xs font-medium'
      }`}
    >
      {isConnected ? (url ? (() => { try { return new URL(url).hostname } catch { return 'Connected' } })() : 'Connected') : 'Not connected'}
    </button>
  )
}
