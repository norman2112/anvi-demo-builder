export default function ScriptSection({ title, content, variant = 'agent' }) {
  const borderClass =
    variant === 'opening'
      ? 'border-l-pv-grass'
      : variant === 'closing'
        ? 'border-l-pv-gold'
        : 'border-l-cta-steel'
  return (
    <section className="mb-8">
      {title && (
        <h3 className={`text-2xl font-thin text-white mb-4 pl-4 border-l-4 ${borderClass}`}>
          {title}
        </h3>
      )}
      <div className="text-[15px] text-white/70 leading-[1.8] whitespace-pre-wrap font-serif">
        {content}
      </div>
    </section>
  )
}
