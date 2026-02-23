import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useConnectionStore = create(
  persist(
    (set, get) => ({
      url: 'https://scdemo520.leankit.com',
      token: 'eb985288c32e2491fe81e1e74f9607c0b4631ef6de78805f795325971415f4feaee4fd59fb74a49272e574e9d6a4e3c74abaa745793572f0f3b50ce9fdcc1d79',
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
