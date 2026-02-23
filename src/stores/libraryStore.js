import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getLibraryDefaultSelectedIds } from '../utils/settingsStorage'

export const useLibraryStore = create(
  persist(
    (set, get) => ({
      files: {},

      /** Merge in default capability files (stock collection). Selected by default so payload includes them unless user/settings say otherwise. */
      loadDefaultFiles: (defaults = []) =>
        set((s) => {
          const next = { ...s.files }
          const defaultSelectedIds = getLibraryDefaultSelectedIds()
          const hasExplicitSelection = defaultSelectedIds.length > 0
          // Remove legacy id only (ANVI_CAPABILITIES was renamed)
          delete next['ANVI_CAPABILITIES']
          for (const d of defaults) {
            if (d?.id && next[d.id] == null) {
              const selectedByDefault = hasExplicitSelection ? defaultSelectedIds.includes(d.id) : d.id === 'ANVI_LIMITATIONS'
              next[d.id] = {
                name: d.name ?? d.id,
                content: d.content ?? '',
                required: !!d.required,
                selected: selectedByDefault,
                lastUpdated: Date.now(),
              }
            }
          }
          return { files: next }
        }),
      toggleFile: (id) =>
        set((s) => ({
          files: {
            ...s.files,
            [id]: s.files[id]
              ? { ...s.files[id], selected: !s.files[id].selected }
              : { name: id, content: '', required: false, selected: true, lastUpdated: Date.now() },
          },
        })),
      addFile: (file) =>
        set((s) => ({
          files: {
            ...s.files,
            [file.id]: {
              name: file.name,
              content: file.content ?? '',
              required: !!file.required,
              selected: true,
              lastUpdated: Date.now(),
            },
          },
        })),
      /** Remove a file. Required (default) files can still be removed from the list. */
      deleteFile: (id) =>
        set((s) => {
          if (s.files[id]?.required) return s
          const next = { ...s.files }
          delete next[id]
          return { files: next }
        }),
      setFileContent: (id, content) =>
        set((s) =>
          s.files[id]
            ? { files: { ...s.files, [id]: { ...s.files[id], content, lastUpdated: Date.now() } } }
            : s
        ),
    }),
    { name: 'anvi-library' }
  )
)
