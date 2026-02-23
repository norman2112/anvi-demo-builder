import { create } from 'zustand'

export const useResultsStore = create((set) => ({
  agents: [],
  validation: null,
  demoScript: null,
  isLoading: false,
  error: null,

  setAgents: (agents, validation) => set({ agents: agents ?? [], validation: validation ?? null, error: null }),
  setDemoScript: (script) => set({ demoScript: script }),
  setLoading: (isLoading) => set({ isLoading, error: isLoading ? null : undefined }),
  setError: (error) => set({ error, isLoading: false }),
}))
