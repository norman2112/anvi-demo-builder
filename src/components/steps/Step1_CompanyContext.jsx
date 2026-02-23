import { useContextStore } from '../../stores/contextStore'

const inputClass = 'w-full min-h-[140px] px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none resize-y transition-all duration-150 text-sm leading-relaxed'
const labelClass = 'block text-sm font-medium text-white/70 mb-2'

export default function Step1_CompanyContext() {
  const companyContext = useContextStore((s) => s.companyContext)
  const setCompanyContext = useContextStore((s) => s.setCompanyContext)
  const demoObjectives = useContextStore((s) => s.demoObjectives)
  const setDemoObjectives = useContextStore((s) => s.setDemoObjectives)

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Company Context</h1>
      <div>
        <label className={labelClass}>Company Context</label>
        <textarea
          value={companyContext}
          onChange={(e) => setCompanyContext(e.target.value)}
          placeholder="Describe the company, product, and audience..."
          className={inputClass}
          rows={10}
        />
      </div>
      <div>
        <label className={labelClass}>Demo Objectives</label>
        <textarea
          value={demoObjectives}
          onChange={(e) => setDemoObjectives(e.target.value)}
          placeholder="What should this demo achieve?"
          className={inputClass}
          rows={10}
        />
      </div>
    </div>
  )
}
