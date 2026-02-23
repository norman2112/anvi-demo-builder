import { useContextStore } from '../../stores/contextStore'

const inputClass = 'w-full min-h-[140px] px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none resize-y transition-all duration-150 text-sm leading-relaxed'
const labelClass = 'block text-sm font-medium text-white/70 mb-2'

const PREFILL_DEMO_CONTEXT = `Demo Context:
Huntington Bank – Regional banking institution (15,000 employees) serving Midwest markets. Currently using Jira, Rally, and MS Project across 8 product lines with 40+ agile teams.

Key challenges:
- Lack of cross-team visibility during PI Planning
- Dependencies between teams discovered too late in sprint
- Portfolio leadership can't see program-level risks
- Manual coordination across 8 ARTs (Agile Release Trains)

Current tools: Jira for team execution, Rally for portfolio, Excel for reporting
Target audience: VP Engineering + 3 Program Managers
Demo duration: 60 minutes (working session)`

const PREFILL_DEMO_OBJECTIVES = `Demo Objectives:
Demonstrate SAFe PI Planning at scale:

1. Show Program Increment structure with 4 sprints across 6 teams
2. Create Features distributed across teams with dependencies
3. Identify and visualize cross-team dependencies
4. Show risk board with mitigation plans
5. Demonstrate capacity planning across teams

Success criteria: They see how AgilePlace eliminates the "sticky note wall" chaos and provides digital PI Planning board with real-time updates.`

export default function Step1_CompanyContext() {
  const companyContext = useContextStore((s) => s.companyContext)
  const setCompanyContext = useContextStore((s) => s.setCompanyContext)
  const demoObjectives = useContextStore((s) => s.demoObjectives)
  const setDemoObjectives = useContextStore((s) => s.setDemoObjectives)

  const handlePrefillDemo = () => {
    setCompanyContext(PREFILL_DEMO_CONTEXT)
    setDemoObjectives(PREFILL_DEMO_OBJECTIVES)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Demo Context</h1>
      <p className="text-sm font-light text-white/50 leading-relaxed mb-10 max-w-2xl">
        Build demo agents in minutes, not hours. Describe your prospect and objectives — Anvi Agent Builder uses Falcon AI to generate a sequence of copy-paste ready Anvi chat prompts tailored to your audience, their pain points, and your live AgilePlace board data. No coding required.
      </p>
      <div>
        <label className={labelClass}>Demo Context</label>
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
      <div className="pt-2">
        <button
          type="button"
          onClick={handlePrefillDemo}
          className="px-4 py-2.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all duration-150"
        >
          Prefill demo data
        </button>
      </div>
    </div>
  )
}
