import { useState, useEffect } from 'react'
import Checkbox from '../shared/Checkbox'
import { toast } from 'sonner'
import { useConnectionStore } from '../../stores/connectionStore'
import { useBoardStore } from '../../stores/boardStore'
import { useUiStore } from '../../stores/uiStore'
import { discoverEnvironment } from '../../services/agileplace'
import { getEnvironments, saveEnvironments } from '../../utils/settingsStorage'

export default function Step3_LiveData() {
  const url = useConnectionStore((s) => s.url)
  const token = useConnectionStore((s) => s.token)
  const setUrl = useConnectionStore((s) => s.setUrl)
  const setToken = useConnectionStore((s) => s.setToken)
  const setConnected = useConnectionStore((s) => s.setConnected)
  const setError = useConnectionStore((s) => s.setError)
  const error = useConnectionStore((s) => s.error)
  const disconnect = useConnectionStore((s) => s.disconnect)
  const boards = useConnectionStore((s) => s.boards)
  const isConnected = useConnectionStore((s) => s.isConnected)
  const selectedBoardIds = useBoardStore((s) => s.selectedBoardIds)
  const toggleBoard = useBoardStore((s) => s.toggleBoard)
  const setSettingsOpen = useUiStore((s) => s.setSettingsOpen)

  const [localUrl, setLocalUrl] = useState(url)
  const [localToken, setLocalToken] = useState(token)
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [savedEnvs, setSavedEnvs] = useState({ environments: [], activeId: null })
  const [selectedEnvId, setSelectedEnvId] = useState('')
  const [showSaveEnvPrompt, setShowSaveEnvPrompt] = useState(false)
  const [saveEnvName, setSaveEnvName] = useState('')

  useEffect(() => {
    setSavedEnvs(getEnvironments())
  }, [])

  useEffect(() => {
    setLocalUrl(url)
    setLocalToken(token)
    const { environments, activeId } = getEnvironments()
    const match = environments.find((e) => e.url === url && e.token === token)
    setSelectedEnvId(match ? match.id : activeId ?? '')
  }, [url, token])

  const handleConnect = async () => {
    const u = (localUrl || '').trim()
    const t = (localToken || '').trim()
    if (!u || !t) {
      setStatusMessage('URL and API token are required.')
      setError('URL and API token are required.')
      return
    }
    setLoading(true)
    setError(null)
    setStatusMessage('Connecting…')
    try {
      const boardsList = await discoverEnvironment(u, t)
      setUrl(u)
      setToken(t)
      setConnected(true, Array.isArray(boardsList) ? boardsList : [])
      setStatusMessage(`Connected. ${Array.isArray(boardsList) ? boardsList.length : 0} board(s) found.`)
      toast.success('Connected to AgilePlace')
      const { environments } = getEnvironments()
      const isNewConnection = !environments.some((e) => e.url === u && e.token === t)
      if (isNewConnection) {
        setShowSaveEnvPrompt(true)
        setSaveEnvName('')
      }
    } catch (err) {
      console.error('[Step3 Connect] Full request and error', {
        requestedUrl: `${(u || '').replace(/\/$/, '')}/api/v2/boards`,
        proxyUrl: import.meta.env.VITE_PROXY_URL || 'http://localhost:3000',
        error: err,
        message: err?.message,
        name: err?.name,
        stack: err?.stack,
        cause: err?.cause,
      })
      const message = err?.message || 'Connection failed'
      setError(message)
      setStatusMessage(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setLocalUrl('')
    setLocalToken('')
    setSelectedEnvId('')
    setShowSaveEnvPrompt(false)
    setStatusMessage(null)
    setError(null)
    toast.success('Disconnected')
  }

  const handleSaveEnvironment = () => {
    const name = (saveEnvName || '').trim()
    if (!name) return
    const { environments, activeId } = getEnvironments()
    const id = crypto.randomUUID()
    const next = [...environments, { id, name, url, token }]
    saveEnvironments({ environments: next, activeId: activeId ?? id })
    setSavedEnvs({ environments: next, activeId: activeId ?? id })
    setSelectedEnvId(id)
    setShowSaveEnvPrompt(false)
    setSaveEnvName('')
    toast.success(`Saved "${name}"`)
  }

  const handleSelectSavedEnv = (envId) => {
    setSelectedEnvId(envId)
    setStatusMessage(null)
    setError(null)
    if (!envId) return
    const env = savedEnvs.environments.find((e) => e.id === envId)
    if (env) {
      setLocalUrl(env.url)
      setLocalToken(env.token)
      setUrl(env.url)
      setToken(env.token)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none text-sm transition-all duration-150'
  const labelClass = 'block text-sm font-medium text-white/70 mb-2'

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Live Data</h1>

      {!isConnected ? (
        <div className="space-y-6 max-w-lg">
          <p className="text-sm text-white/60 leading-relaxed">Connect to AgilePlace to discover boards and use live data in your demo.</p>

          <div>
            <label className={labelClass}>Saved Environment or New Connection</label>
            <div className="flex gap-2 items-center">
              <select
                value={selectedEnvId}
                onChange={(e) => handleSelectSavedEnv(e.target.value || null)}
                className={`flex-1 ${inputClass}`}
              >
                <option value="">— New Connection —</option>
                {savedEnvs.environments.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-medium shrink-0 transition-all duration-150"
              >
                Manage in Settings
              </button>
            </div>
            <p className="text-xs text-white/40 mt-1">Choose a saved environment or enter new connection below.</p>
          </div>

          <div>
            <label className={labelClass}>Base URL</label>
            <input
              type="url"
              value={localUrl}
              onChange={(e) => { setLocalUrl(e.target.value); setStatusMessage(null); setError(null); setSelectedEnvId(''); }}
              placeholder="https://your-instance.agileplace.com"
              className={inputClass}
              disabled={loading}
            />
          </div>
          <div>
            <label className={labelClass}>API token</label>
            <input
              type="password"
              value={localToken}
              onChange={(e) => { setLocalToken(e.target.value); setStatusMessage(null); setError(null); setSelectedEnvId(''); }}
              placeholder="Your AgilePlace API token"
              className={inputClass}
              disabled={loading}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleConnect}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-cta-steel hover:bg-cta-steel-hover text-white font-medium disabled:opacity-50 transition-all duration-150 hover:scale-[1.01]"
            >
              {loading ? 'Connecting…' : 'Connect'}
            </button>
          </div>
          {(statusMessage || error) && (
            <p className={`text-sm ${error ? 'text-flash-red' : 'text-white/60'}`}>
              {error || statusMessage}
            </p>
          )}
        </div>
      ) : (
        <>
          {showSaveEnvPrompt && (
            <div className="rounded-xl border border-white/10 bg-[#141414] p-5 mb-6">
              <p className="text-sm text-white/70 mb-3">Save this connection? Give it a name to use again from the dropdown.</p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={saveEnvName}
                  onChange={(e) => setSaveEnvName(e.target.value)}
                  placeholder="Environment name"
                  className="flex-1 min-w-[180px] px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleSaveEnvironment}
                  disabled={!saveEnvName.trim()}
                  className="px-4 py-2.5 rounded-lg bg-cta-steel text-white text-sm font-medium hover:bg-cta-steel-hover disabled:opacity-50 transition-all duration-150"
                >
                  Save environment
                </button>
                <button
                  type="button"
                  onClick={() => setShowSaveEnvPrompt(false)}
                  className="px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all duration-150"
                >
                  Maybe later
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-white/60">Select boards to include in the context payload.</p>
            <button
              type="button"
              onClick={handleDisconnect}
              className="text-sm text-white/40 hover:text-white/70 transition-all duration-150"
            >
              Disconnect
            </button>
          </div>
          {boards.length === 0 ? (
            <p className="text-sm text-white/60">No boards found for this instance.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {boards.map((board) => {
                const cardTypesRaw = board.cardTypes ?? board.card_types ?? board.cardTypeIds
                const cardTypesStr = Array.isArray(cardTypesRaw)
                  ? cardTypesRaw.map((ct) => (typeof ct === 'object' && ct != null ? ct.name ?? ct.label ?? ct.id : String(ct))).filter(Boolean).join(', ') || '—'
                  : cardTypesRaw != null && String(cardTypesRaw).trim() ? String(cardTypesRaw) : '—'
                const laneCount = board.laneCount ?? board.lane_count ?? (Array.isArray(board.lanes) ? board.lanes.length : null) ?? board.lanesCount ?? '—'
                const ownerRaw = board.owner
                const ownerStr = ownerRaw == null ? '—' : typeof ownerRaw === 'object' ? (ownerRaw.fullName ?? ownerRaw.displayName ?? ownerRaw.emailAddress ?? ownerRaw.name ?? '—') : String(ownerRaw)
                const desc = [cardTypesStr, laneCount !== '—' ? `${laneCount} lanes` : '', ownerStr].filter(Boolean).join(' · ')
                return (
                  <label
                    key={board.id}
                    onClick={() => toggleBoard(String(board.id))}
                    className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-150 ${
                      selectedBoardIds.has(String(board.id))
                        ? 'bg-[#141414] border-white/5'
                        : 'bg-[#141414] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <span onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedBoardIds.has(String(board.id))}
                        onChange={() => toggleBoard(String(board.id))}
                        aria-label={`Select board ${board.title ?? board.name ?? board.id}`}
                        className="mt-0.5"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{board.title ?? board.name ?? board.id}</p>
                      <p className="text-xs text-white/40 mt-1">{desc || '—'}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
