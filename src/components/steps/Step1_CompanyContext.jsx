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

const PREFILL_SPM_CONTEXT = `Company Context:
Huntington National Bank — $200B+ asset regional bank, HQ Columbus OH. 
Key exec audience: SVP of Enterprise PMO (reports to CIO).

Huntington runs a centralized EPMO managing 400+ active projects across 
Digital Banking, Commercial Lending, Risk & Compliance, and Infrastructure 
Modernization. They use Planview Portfolios for strategic planning and 
project intake. Current pain: manual weekly status rollups take the PMO 
team 6+ hours every Monday. CIO wants real-time strategy-to-execution 
visibility without the spreadsheet heroics.

Recent strategic priorities:
- Digital-first customer experience (mobile banking overhaul)
- AI/ML fraud detection and credit decisioning
- Core banking platform modernization (mainframe migration)
- Regulatory compliance automation (OCC/Fed requirements)
- Branch network optimization and hybrid workforce enablement

Target demo persona: SVP of Enterprise PMO + Director of Portfolio Analytics
Demo tone: Executive, data-driven, ROI-focused. No fluff.`

const PREFILL_SPM_OBJECTIVES = `Demo Objectives:
Show Huntington's EPMO leadership how Anvi + Portfolios can:
1. Auto-generate executive strategy briefings from live portfolio data
2. Surface at-risk initiatives before they hit the CIO's desk
3. Demonstrate strategy-to-execution traceability (strategic themes → projects → board work)
4. Replace manual Monday morning status compilation with one-click agent runs
5. Prove AI can understand their portfolio hierarchy and speak in banking terms`

export default function Step1_CompanyContext() {
  const companyContext = useContextStore((s) => s.companyContext)
  const setCompanyContext = useContextStore((s) => s.setCompanyContext)
  const demoObjectives = useContextStore((s) => s.demoObjectives)
  const setDemoObjectives = useContextStore((s) => s.setDemoObjectives)

  const handlePrefillDemo = () => {
    setCompanyContext(PREFILL_DEMO_CONTEXT)
    setDemoObjectives(PREFILL_DEMO_OBJECTIVES)
  }

  const handlePrefillSpmDemo = () => {
    setCompanyContext(PREFILL_SPM_CONTEXT)
    setDemoObjectives(PREFILL_SPM_OBJECTIVES)
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
        <div className="flex justify-end gap-4 text-xs">
          <button
            type="button"
            onClick={handlePrefillDemo}
            className="text-white/30 hover:text-white/60 underline underline-offset-2 transition-colors duration-150"
          >
            Prefill DPD Demo Context
          </button>
          <button
            type="button"
            onClick={handlePrefillSpmDemo}
            className="text-white/30 hover:text-white/60 underline underline-offset-2 transition-colors duration-150"
          >
            Prefill SPM Demo Context
          </button>
        </div>
      </div>
    </div>
  )
}
