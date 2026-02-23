import { useState, useEffect } from 'react'
import { useConnectionStore } from '../../stores/connectionStore'
import { useUiStore } from '../../stores/uiStore'
import { discoverEnvironment } from '../../services/agileplace'
import { toast } from 'sonner'

export default function ConnectionModal({ open, onClose }) {
  const url = useConnectionStore((s) => s.url)
  const token = useConnectionStore((s) => s.token)
  const setUrl = useConnectionStore((s) => s.setUrl)
  const setToken = useConnectionStore((s) => s.setToken)
  const setConnected = useConnectionStore((s) => s.setConnected)
  const setError = useConnectionStore((s) => s.setError)
  const error = useConnectionStore((s) => s.error)
  const isConnected = useConnectionStore((s) => s.isConnected)
  const disconnect = useConnectionStore((s) => s.disconnect)

  const [loading, setLoading] = useState(false)
  const [localUrl, setLocalUrl] = useState(url)
  const [localToken, setLocalToken] = useState(token)

  const isOpen = open || useUiStore((s) => s.connectionModalOpen)

  useEffect(() => {
    if (isOpen) {
      setLocalUrl(url)
      setLocalToken(token)
    }
  }, [isOpen, url, token])

  if (!isOpen) return null

  const handleConnect = async () => {
    const u = (localUrl || '').trim()
    const t = (localToken || '').trim()
    if (!u || !t) {
      toast.error('URL and token are required')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const boards = await discoverEnvironment(u, t)
      setUrl(u)
      setToken(t)
      setConnected(true, Array.isArray(boards) ? boards : [])
      onClose?.()
      useUiStore.getState().setConnectionModalOpen(false)
      toast.success('Connected to AgilePlace')
    } catch (err) {
      const message = err?.message || 'Connection failed'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setLocalUrl('')
    setLocalToken('')
    onClose?.()
    useUiStore.getState().setConnectionModalOpen(false)
    toast.success('Disconnected')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => isOpen && useUiStore.getState().setConnectionModalOpen(false)}>
      <div
        className="bg-[#141414] border border-white/5 rounded-2xl p-8 w-full max-w-md mx-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-extralight text-white tracking-tight mb-6">AgilePlace connection</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Base URL</label>
            <input
              type="url"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              placeholder="https://your-instance.agileplace.com"
              className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none text-sm transition-all duration-150"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">API token</label>
            <input
              type="password"
              value={localToken}
              onChange={(e) => setLocalToken(e.target.value)}
              placeholder="Your AgilePlace API token"
              className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none text-sm transition-all duration-150"
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-flash-red">{error}</p>}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={() => useUiStore.getState().setConnectionModalOpen(false)}
            className="px-6 py-2.5 rounded-lg bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-medium transition-all duration-150"
          >
            Cancel
          </button>
          {isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="px-6 py-2.5 rounded-lg bg-transparent border border-flash-red/30 text-flash-red/80 hover:bg-flash-red/10 font-medium transition-all duration-150"
            >
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-cta-steel hover:bg-cta-steel-hover text-white font-medium disabled:opacity-50 transition-all duration-150 hover:scale-[1.01]"
            >
              {loading ? 'Connecting…' : 'Connect'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
