export default function CalloutBox({ children, title = '💡 Business value' }) {
  const isBusinessValue = typeof title === 'string' && title.toLowerCase().includes('business')
  return (
    <div
      className={`my-4 p-5 rounded-xl ${
        isBusinessValue
          ? 'bg-pv-grass/5 border border-pv-grass/15'
          : 'bg-pv-gold/5 border border-pv-gold/15'
      }`}
    >
      <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2">{title}</p>
      <div
        className={
          isBusinessValue
            ? 'text-lg font-light text-white/80 leading-relaxed'
            : 'text-xl font-light text-white/80 leading-relaxed italic'
        }
      >
        {children}
      </div>
    </div>
  )
}
