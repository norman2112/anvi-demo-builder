import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLibraryStore } from '../../stores/libraryStore'
import { useContextStore } from '../../stores/contextStore'
import { hasPlaceholderContent } from '../../services/payloadBuilder'
import { DEFAULT_LIBRARY_FILES } from '../../config/capabilities/defaults'
import FileUpload from '../shared/FileUpload'
import Checkbox from '../shared/Checkbox'

export default function Step4_ContextLibrary() {
  const files = useLibraryStore((s) => s.files)
  const loadDefaultFiles = useLibraryStore((s) => s.loadDefaultFiles)
  const toggleFile = useLibraryStore((s) => s.toggleFile)
  const addFile = useLibraryStore((s) => s.addFile)
  const deleteFile = useLibraryStore((s) => s.deleteFile)
  const customInstructions = useContextStore((s) => s.customInstructions)
  const setCustomInstructions = useContextStore((s) => s.setCustomInstructions)
  const [previewFile, setPreviewFile] = useState(null)

  useEffect(() => {
    loadDefaultFiles(DEFAULT_LIBRARY_FILES)
  }, [loadDefaultFiles])

  const fileList = Object.entries(files).map(([id, f]) => ({ id, ...f }))

  const formatSize = (content) => {
    if (content == null || typeof content !== 'string') return '—'
    const bytes = new TextEncoder().encode(content).length
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatLastUpdated = (ts) => {
    if (ts == null || (typeof ts !== 'number' && typeof ts !== 'string')) return '—'
    const d = new Date(ts)
    if (Number.isNaN(d.getTime())) return '—'
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = d.toDateString() === yesterday.toDateString()
    const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    if (isToday) return `Today, ${time}`
    if (isYesterday) return `Yesterday, ${time}`
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Context Library</h1>
      <p className="text-sm text-white/60 leading-relaxed">
        Capability files and custom instructions.
      </p>

      <div className="space-y-3">
        {fileList.length === 0 ? (
          <p className="text-sm text-white/40 py-6 text-center rounded-xl bg-[#141414] border border-white/5">
            No library files loaded. Defaults will load automatically.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-white/40 uppercase tracking-wider border-b border-white/5">
              <span>Name</span>
              <span className="text-right w-16">Size</span>
              <span className="w-36">Last updated</span>
              <span className="w-16" />
              <span />
            </div>
            {fileList.map(({ id, name, required, selected, content, lastUpdated }) => {
              const hasPlaceholder = hasPlaceholderContent(content)
              return (
                <div
                  key={id}
                  className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center p-4 rounded-lg border transition-all duration-150 ${
                    selected ? 'bg-cta-steel/5 border-cta-steel/30' : 'bg-[#141414] border-white/5'
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <Checkbox
                      checked={!!selected}
                      onChange={() => toggleFile(id)}
                      aria-label={`Select ${name ?? id}`}
                    />
                    <span className="text-sm font-medium text-white truncate">{name ?? id}</span>
                    {hasPlaceholder && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-flash-red/15 text-flash-red border border-flash-red/20 shrink-0"
                        title="Contains placeholder content — replace with real content before generating"
                      >
                        Placeholder
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/50 text-right tabular-nums w-16">{formatSize(content)}</span>
                  <span className="text-xs text-white/50 w-36">{formatLastUpdated(lastUpdated)}</span>
                  <span className="text-xs text-white/40 w-16">{required ? 'Default' : 'Uploaded'}</span>
                  <span className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewFile({ name: name ?? id, content: content ?? '' })}
                      className="text-sm text-cta-ice hover:text-white/80 transition-all duration-150"
                    >
                      Preview
                    </button>
                    {!required && (
                      <button
                        type="button"
                        onClick={() => deleteFile(id)}
                        className="text-sm text-flash-red/80 hover:text-flash-red transition-all duration-150"
                      >
                        Remove
                      </button>
                    )}
                  </span>
                </div>
              )
            })}
          </>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">Upload New File</p>
        <FileUpload
          readContent
          accept=".txt,.md,.json"
          onAdd={(entry) =>
            addFile({
              id: entry.id,
              name: entry.name,
              content: entry.content ?? '',
              required: false,
            })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Custom instructions</label>
        <textarea
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          placeholder="Optional custom instructions..."
          className="w-full min-h-[140px] px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none resize-y text-sm leading-relaxed transition-all duration-150"
        />
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {previewFile && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 bottom-0 w-full max-w-md bg-[#111111] border-l border-white/5 shadow-2xl z-20 flex flex-col overflow-hidden"
                style={{ top: '58px' }}
                aria-label="File preview"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
                  <span className="text-sm font-medium text-white truncate pr-2">{previewFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setPreviewFile(null)}
                    className="p-2 rounded-lg text-white/30 hover:text-white/60 focus:outline-none shrink-0 transition-all duration-150"
                    aria-label="Close preview"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <pre className="text-sm text-white/60 whitespace-pre-wrap font-mono break-words">
                    {previewFile.content || '(empty)'}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}
