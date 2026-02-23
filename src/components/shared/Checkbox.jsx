function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function Checkbox({ checked, onChange, disabled = false, 'aria-label': ariaLabel, className = '' }) {
  const handleClick = (e) => {
    e.stopPropagation()
    if (!disabled) onChange?.(!checked)
  }
  const handleKeyDown = (e) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange?.(!checked)
    }
  }
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        w-5 h-5 rounded border flex items-center justify-center cursor-pointer
        transition-all duration-150 shrink-0
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/40'}
        ${checked
          ? 'bg-cta-steel border-cta-steel text-white'
          : 'bg-transparent border-white/20'}
        ${className}
      `}
    >
      {checked && <CheckIcon />}
    </div>
  )
}
