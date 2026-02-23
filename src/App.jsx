import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import StepNav from './components/layout/StepNav'
import PlanAgentDetailPanel from './components/plan-review/PlanAgentDetailPanel'
import SettingsPanel from './components/settings/SettingsPanel'
import Step1_CompanyContext from './components/steps/Step1_CompanyContext'
import Step2_ReferenceFiles from './components/steps/Step2_ReferenceFiles'
import Step3_LiveData from './components/steps/Step3_LiveData'
import Step4_ContextLibrary from './components/steps/Step4_ContextLibrary'
import Step5_Review from './components/steps/Step5_Review'
import Step6_PlanReview from './components/steps/Step6_PlanReview'
import Step7_GeneratedAgents from './components/steps/Step7_GeneratedAgents'
import Step8_DemoScript from './components/steps/Step8_DemoScript'
import { useUiStore } from './stores/uiStore'
import { usePlanStore } from './stores/planStore'

const stepComponents = {
  1: Step1_CompanyContext,
  2: Step2_ReferenceFiles,
  3: Step3_LiveData,
  4: Step4_ContextLibrary,
  5: Step5_Review,
  6: Step6_PlanReview,
  7: Step7_GeneratedAgents,
  8: Step8_DemoScript,
}

export default function App() {
  const currentStep = useUiStore((s) => s.currentStep)
  const settingsOpen = useUiStore((s) => s.settingsOpen)
  const setSettingsOpen = useUiStore((s) => s.setSettingsOpen)
  const planAgentPanelIndex = useUiStore((s) => s.planAgentPanelIndex)
  const setPlanAgentPanelIndex = useUiStore((s) => s.setPlanAgentPanelIndex)
  const originalPlan = usePlanStore((s) => s.originalPlan)
  const agentDecisions = usePlanStore((s) => s.agentDecisions)
  const setAgentNotes = usePlanStore((s) => s.setAgentNotes)

  const StepComponent = stepComponents[currentStep]
  const agents = originalPlan?.agents ?? []
  const selectedAgent = planAgentPanelIndex != null ? agents[planAgentPanelIndex] : null
  const selectedDecision =
    planAgentPanelIndex != null
      ? agentDecisions.find((d) => d.agent_number === planAgentPanelIndex + 1)
      : null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/60 flex flex-col">
      <Header />
      {/* App-level layout: sidebar left (w-72) + main center + sliding panel overlays from right when active */}
      <div className="flex flex-1 min-h-0 relative">
        <aside
          className="sticky top-14 w-72 h-[calc(100vh-3.5rem)] shrink-0 border-r border-white/5 bg-[#0a0a0a] overflow-y-auto"
          aria-label="Steps and payload preview"
        >
          <Sidebar />
        </aside>
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto bg-[#0a0a0a] px-10 py-8 pb-20 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-h-0 flex flex-col"
            >
              {StepComponent && <StepComponent />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Fixed bottom nav: left-72 aligns with sidebar width */}
        <StepNav />

        {/* Agent detail sliding panel: fixed overlay, pinned right, full height, scrolls internally */}
        <AnimatePresence>
          {currentStep === 6 && planAgentPanelIndex != null && selectedAgent && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 w-[480px] bg-[#111111] border-l border-white/5 shadow-2xl z-20 flex flex-col overflow-hidden"
              style={{ top: '58px', bottom: '64px' }}
              aria-label="Agent details"
            >
              <PlanAgentDetailPanel
                agent={selectedAgent}
                notes={selectedDecision?.notes ?? ''}
                onNotesChange={(notes) => setAgentNotes(planAgentPanelIndex + 1, notes)}
                onClose={() => setPlanAgentPanelIndex(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings panel: full-page overlay / right slide */}
        <AnimatePresence>
          {settingsOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30"
                onClick={() => setSettingsOpen(false)}
                aria-hidden
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 bottom-0 w-full max-w-lg bg-[#111111] border-l border-white/5 shadow-2xl z-40 flex flex-col overflow-hidden"
                style={{ top: '58px' }}
                aria-label="Settings"
              >
                <SettingsPanel onClose={() => setSettingsOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
