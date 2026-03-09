import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_INSTANCE = import.meta.env.VITE_PORTFOLIOS_DEFAULT_INSTANCE || ''

export const usePortfoliosStore = create(
  persist(
    (set) => ({
      instanceNumber: DEFAULT_INSTANCE,
      isConnected: false,
      lastError: null,
      strategyData: null,
      projectData: null,
      strategyCount: 0,
      projectCount: 0,

      setInstanceNumber: (instanceNumber) => set({ instanceNumber }),

      setConnectionResult: (payload) =>
        set({
          isConnected: !!payload?.isConnected,
          lastError: payload?.error ?? null,
          strategyData: payload?.strategyData ?? null,
          projectData: payload?.projectData ?? null,
          strategyCount: payload?.strategyCount ?? 0,
          projectCount: payload?.projectCount ?? 0,
        }),

      disconnect: () =>
        set({
          isConnected: false,
          lastError: null,
          strategyData: null,
          projectData: null,
          strategyCount: 0,
          projectCount: 0,
        }),
    }),
    {
      name: 'anvi-portfolios-connection',
      partialize: (s) => ({
        instanceNumber: s.instanceNumber,
      }),
    }
  )
)
