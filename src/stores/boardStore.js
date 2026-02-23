import { create } from 'zustand'
import { useConnectionStore } from './connectionStore'

export const useBoardStore = create((set, get) => ({
  selectedBoardIds: new Set(),

  toggleBoard: (id) =>
    set((s) => {
      const next = new Set(s.selectedBoardIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { selectedBoardIds: next }
    }),

  getSelectedBoards: () => {
    const boards = useConnectionStore.getState().boards
    const { selectedBoardIds } = get()
    return boards.filter((b) => b.id && selectedBoardIds.has(String(b.id)))
  },
}))
