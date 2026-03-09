import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_URL = import.meta.env.VITE_PORTFOLIOS_DEFAULT_URL || ''
const DEFAULT_USERNAME = import.meta.env.VITE_PORTFOLIOS_DEFAULT_USERNAME || ''
const DEFAULT_PASSWORD = import.meta.env.VITE_PORTFOLIOS_DEFAULT_PASSWORD || ''

export const usePortfoliosStore = create(
  persist(
    (set) => ({
      instanceUrl: DEFAULT_URL,
      username: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD,
      isConnected: false,
      lastError: null,
      strategyData: null,
      projectData: null,
      strategyCount: 0,
      projectCount: 0,

      setInstanceUrl: (instanceUrl) => set({ instanceUrl }),
      setUsername: (username) => set({ username }),
      setPassword: (password) => set({ password }),

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
        instanceUrl: s.instanceUrl,
        username: s.username,
        password: s.password,
      }),
    }
  )
)

