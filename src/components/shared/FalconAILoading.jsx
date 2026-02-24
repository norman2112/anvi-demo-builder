import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PHRASES = [
  'Warming up Falcon AI...',
  'Analyzing your context...',
  'Reading supporting files...',
  'Checking live data...',
  'Designing agent strategy...',
  'Prioritizing objectives...',
  'Mapping agent roles...',
  'Building your plan...',
  'Validating structure...',
  'Almost there...',
]

const PHRASE_INTERVAL_MS = 5500
const PROGRESS_DURATION_S = 15

export default function FalconAILoading({ error, onRetry }) {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    if (error) return
    const t = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length)
    }, PHRASE_INTERVAL_MS)
    return () => clearInterval(t)
  }, [error])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-flash-red/80 text-sm text-center max-w-md mb-4">
          {error}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all duration-150"
          >
            Try Again
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="h-8 flex items-center justify-center mb-8 min-w-[240px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={phraseIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="text-white/60 text-center text-sm font-medium"
          >
            {PHRASES[phraseIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-md h-1.5 bg-[#141414] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-cta-steel"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: PROGRESS_DURATION_S, ease: 'linear' }}
          style={{ boxShadow: '0 0 8px rgba(82, 122, 142, 0.3)' }}
        />
      </div>
    </div>
  )
}
