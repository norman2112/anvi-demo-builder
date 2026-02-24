import { create } from 'zustand'

export const usePlanStore = create((set, get) => ({
  originalPlan: null,
  /** Payload sent to Falcon in Pass 1 (buildPlanRequestPayload); shown in Payload tab */
  lastSentPlanPayload: null,
  /** Raw message content from Falcon Pass 1 response (choices[0].message.content); shown in Payload tab */
  lastFalconPlanResponseText: null,
  strategyNotes: '',
  agentDecisions: [],
  addedAgents: [],
  isLoading: false,
  planError: null,
  setPlanLoading: (v) => set({ isLoading: !!v, ...(v ? { planError: null } : {}) }),
  setPlanError: (err) => set({ planError: err ?? null }),
  setLastSentPlanPayload: (payload) => set({ lastSentPlanPayload: payload }),
  setLastFalconPlanResponseText: (text) => set({ lastFalconPlanResponseText: text }),

  initFromPlan: (plan) => {
    const decisions = (plan?.agents ?? []).map((a, i) => ({
      agent_number: i + 1,
      included: true,
      notes: '',
      sort_order: i + 1,
    }))
    set({ originalPlan: plan, agentDecisions: decisions, addedAgents: [] })
  },

  toggleAgent: (agentNumber) =>
    set((s) => ({
      agentDecisions: s.agentDecisions.map((d) =>
        d.agent_number === agentNumber ? { ...d, included: !d.included } : d
      ),
    })),

  setAllAgentsIncluded: (included) =>
    set((s) => ({
      agentDecisions: s.agentDecisions.map((d) => ({ ...d, included: !!included })),
    })),

  setAgentNotes: (agentNumber, notes) =>
    set((s) => ({
      agentDecisions: s.agentDecisions.map((d) =>
        d.agent_number === agentNumber ? { ...d, notes } : d
      ),
    })),

  setStrategyNotes: (notes) => set({ strategyNotes: notes }),

  addAgent: (name, description) =>
    set((s) => ({
      addedAgents: [
        ...s.addedAgents,
        {
          id: crypto.randomUUID(),
          name: name || 'Custom agent',
          description: description || '',
          sort_order: s.agentDecisions.length + s.addedAgents.length + 1,
        },
      ],
    })),

  removeAddedAgent: (id) =>
    set((s) => ({ addedAgents: s.addedAgents.filter((a) => a.id !== id) })),

  getApprovedAgents: () => {
    const { originalPlan, agentDecisions, addedAgents } = get()
    const fromPlan = (originalPlan?.agents ?? []).filter(
      (_, i) => agentDecisions.find((d) => d.agent_number === i + 1)?.included
    )
    return [...fromPlan, ...addedAgents]
  },

  getExcludedAgents: () => {
    const { originalPlan, agentDecisions } = get()
    return (originalPlan?.agents ?? []).filter(
      (_, i) => !agentDecisions.find((d) => d.agent_number === i + 1)?.included
    )
  },
}))
