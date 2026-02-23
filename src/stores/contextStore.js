import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useContextStore = create(
  persist(
    (set) => ({
      companyContext: '',
      demoObjectives: '',
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
