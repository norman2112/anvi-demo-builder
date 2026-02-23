import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUiStore = create(
  persist(
    (set) => ({
      currentStep: 1,
      tipsVisible: true,
      connectionModalOpen: false,
      settingsOpen: false,
      /** Index of plan agent shown in the app-level sliding detail panel (null = closed) */
      planAgentPanelIndex: null,

      setStep: (step) => set({ currentStep: Math.max(1, Math.min(8, step)) }),
      toggleTips: () => set((s) => ({ tipsVisible: !s.tipsVisible })),
      setConnectionModalOpen: (v) => set({ connectionModalOpen: !!v }),
      setSettingsOpen: (v) => set({ settingsOpen: !!v }),
      setPlanAgentPanelIndex: (index) => set({ planAgentPanelIndex: index ?? null }),
    }),
    { name: 'anvi-ui', partialize: (s) => ({ tipsVisible: s.tipsVisible }) }
  )
)
