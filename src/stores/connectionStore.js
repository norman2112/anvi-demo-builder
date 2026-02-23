import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useConnectionStore = create(
  persist(
    (set, get) => ({
      url: 'https://your-instance.leankit.com',
      token: 'REDACTED_AGILEPLACE_TOKEN',
      isConnected: false,
      boards: [],
      error: null,

      connect: async () => {
        const { url, token } = get()
        if (!url?.trim() || !token?.trim()) {
          set({ error: 'URL and token required', isConnected: false })
          return
        }
        set({ error: null })
        // Actual discovery done by agileplace service; store updated from caller
      },
      disconnect: () => set({ isConnected: false, boards: [], error: null }),
      setUrl: (url) => set({ url }),
      setToken: (token) => set({ token }),
      setConnected: (isConnected, boards = []) => set({ isConnected, boards, error: null }),
      setError: (error) => set({ error, isConnected: false }),
    }),
    { name: 'anvi-connection', partialize: (s) => ({ url: s.url, token: s.token }) }
  )
)
