import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useContextStore = create(
  persist(
    (set) => ({
      companyContext: `Demo Context:
Huntington Bank – Regional banking institution (15,000 employees) serving Midwest markets. Currently using Jira, Rally, and MS Project across 8 product lines with 40+ agile teams.

Key challenges:
- Lack of cross-team visibility during PI Planning
- Dependencies between teams discovered too late in sprint
- Portfolio leadership can't see program-level risks
- Manual coordination across 8 ARTs (Agile Release Trains)

Current tools: Jira for team execution, Rally for portfolio, Excel for reporting
Target audience: VP Engineering + 3 Program Managers
Demo duration: 60 minutes (working session)`,
      demoObjectives: `Demo Objectives:
Demonstrate SAFe PI Planning at scale:

1. Show Program Increment structure with 4 sprints across 6 teams
2. Create Features distributed across teams with dependencies
3. Identify and visualize cross-team dependencies
4. Show risk board with mitigation plans
5. Demonstrate capacity planning across teams

Success criteria: They see how AgilePlace eliminates the "sticky note wall" chaos and provides digital PI Planning board with real-time updates.`,
      refFiles: [],
      customInstructions: '',

      setCompanyContext: (val) => set({ companyContext: val }),
      setDemoObjectives: (val) => set({ demoObjectives: val }),
      addRefFile: (file) =>
        set((s) => ({
          refFiles: [...s.refFiles, { ...file, id: file.id || crypto.randomUUID() }],
        })),
      removeRefFile: (id) =>
        set((s) => ({ refFiles: s.refFiles.filter((f) => f.id !== id) })),
      setCustomInstructions: (val) => set({ customInstructions: val }),
    }),
    { name: 'anvi-context', partialize: (s) => ({ customInstructions: s.customInstructions }) }
  )
)
