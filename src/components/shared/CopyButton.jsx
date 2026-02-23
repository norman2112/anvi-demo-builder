import { useState } from 'react'
import { toast } from 'sonner'

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-pv-grass" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  )
}

export default function CopyButton({ text, label = 'Copy', className = '' }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed')
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`text-white/30 hover:text-white/60 transition-all duration-150 p-1.5 rounded ${className}`}
      title={label}
    >
      {copied ? <CheckIcon /> : <span className="text-sm font-medium">{label}</span>}
    </button>
  )
}
