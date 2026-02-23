const TYPE_COLORS = {
  Create: 'bg-pv-grass/15 text-pv-grass',
  Query: 'bg-pv-turquoise/15 text-pv-turquoise',
  Analysis: 'bg-pv-gold/15 text-pv-gold',
  Mixed: 'bg-pv-violet/15 text-white/60',
  Link: 'bg-pv-turquoise/15 text-pv-turquoise',
  Risk: 'bg-pv-gold/15 text-pv-gold',
  OKR: 'bg-pv-violet/15 text-white/60',
}

export default function AgentTypePill({ type }) {
  const cls = TYPE_COLORS[type] ?? 'bg-white/10 text-white/60'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${cls}`}>
      {type ?? 'Agent'}
    </span>
  )
}
