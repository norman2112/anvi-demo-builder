import Checkbox from './Checkbox'

export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <Checkbox
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      {label && <span className="text-sm text-white/70">{label}</span>}
    </label>
  )
}
