export default function StatsBar({ agentCount, ops, time }) {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-[#141414] border border-white/5">
      {agentCount != null && (
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Agents</p>
          <p className="text-3xl font-thin text-white">{agentCount}</p>
        </div>
      )}
      {ops != null && (
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Ops</p>
          <p className="text-3xl font-thin text-white">{ops}</p>
        </div>
      )}
      {time != null && (
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Time</p>
          <p className="text-3xl font-thin text-white">{time}</p>
        </div>
      )}
    </div>
  )
}
