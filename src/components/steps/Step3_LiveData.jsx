import { useState, useEffect } from 'react'
import Checkbox from '../shared/Checkbox'
import { toast } from 'sonner'
import { useConnectionStore } from '../../stores/connectionStore'
import { usePortfoliosStore } from '../../stores/portfoliosStore'
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

  const [localUrl, setLocalUrl] = useState('')
  const [localToken, setLocalToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [savedEnvs, setSavedEnvs] = useState({ environments: [], activeId: null })
  const [selectedEnvId, setSelectedEnvId] = useState('')
  const [showSaveEnvPrompt, setShowSaveEnvPrompt] = useState(false)
  const [saveEnvName, setSaveEnvName] = useState('')

  const portfoliosInstanceUrl = usePortfoliosStore((s) => s.instanceUrl)
  const portfoliosUsername = usePortfoliosStore((s) => s.username)
  const portfoliosPassword = usePortfoliosStore((s) => s.password)
  const setPortfoliosInstanceUrl = usePortfoliosStore((s) => s.setInstanceUrl)
  const setPortfoliosUsername = usePortfoliosStore((s) => s.setUsername)
  const setPortfoliosPassword = usePortfoliosStore((s) => s.setPassword)
  const portfoliosIsConnected = usePortfoliosStore((s) => s.isConnected)
  const setPortfoliosConnectionResult = usePortfoliosStore((s) => s.setConnectionResult)
  const disconnectPortfolios = usePortfoliosStore((s) => s.disconnect)
  const portfoliosStrategyCount = usePortfoliosStore((s) => s.strategyCount)
  const portfoliosProjectCount = usePortfoliosStore((s) => s.projectCount)
  const portfoliosLastError = usePortfoliosStore((s) => s.lastError)
  const portfoliosStrategyData = usePortfoliosStore((s) => s.strategyData)
  const portfoliosProjectData = usePortfoliosStore((s) => s.projectData)

  const [activeTab, setActiveTab] = useState('agileplace')
  const [portfoliosLoading, setPortfoliosLoading] = useState(false)
  const [portfoliosStatus, setPortfoliosStatus] = useState(null)

  useEffect(() => {
    setSavedEnvs(getEnvironments())
  }, [])

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

  const TabDot = ({ status }) => {
    const base = 'w-2 h-2 rounded-full inline-block mr-1'
    if (status === 'success') return <span className={`${base} bg-pv-grass`} aria-hidden />
    if (status === 'error') return <span className={`${base} bg-flash-red`} aria-hidden />
    return <span className={`${base} bg-white/30`} aria-hidden />
  }

  const agileplaceStatus = isConnected ? 'success' : error ? 'error' : 'idle'
  const portfoliosStatusType = portfoliosIsConnected
    ? 'success'
    : portfoliosLastError
      ? 'error'
      : 'idle'

  const handlePortfoliosTestConnection = async () => {
    const instance = (portfoliosInstanceUrl || '').trim()
    const user = (portfoliosUsername || '').trim()
    const pass = (portfoliosPassword || '').trim()
    if (!instance || !user || !pass) {
      setPortfoliosStatus('Instance URL, username, and password are required.')
      setPortfoliosConnectionResult({ isConnected: false, error: 'Instance URL, username, and password are required.' })
      return
    }
    setPortfoliosLoading(true)
    setPortfoliosStatus('Testing connection…')
    setPortfoliosConnectionResult({ isConnected: false, error: null })
    try {
      const basePayload = { instanceUrl: instance, username: user, password: pass }
      const stratRes = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...basePayload, entity: 'Strategy_Dimension' }),
      })
      const stratBody = await stratRes.json()
      if (!stratRes.ok) {
        const msg = stratBody?.error || 'Connection failed'
        setPortfoliosConnectionResult({ isConnected: false, error: msg })
        setPortfoliosStatus(msg)
        toast.error(msg)
        return
      }
      const projRes = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...basePayload, entity: 'PortfolioDashboards_Project_Dimension' }),
      })
      const projBody = await projRes.json()
      if (!projRes.ok) {
        const msg = projBody?.error || 'Project fetch failed'
        setPortfoliosConnectionResult({ isConnected: false, error: msg, strategyData: stratBody })
        setPortfoliosStatus(msg)
        toast.error(msg)
        return
      }

      const strategyItems = Array.isArray(stratBody?.value)
        ? stratBody.value
        : Array.isArray(stratBody?.d?.results)
          ? stratBody.d.results
          : []
      const projectItems = Array.isArray(projBody?.value)
        ? projBody.value
        : Array.isArray(projBody?.d?.results)
          ? projBody.d.results
          : []

      setPortfoliosConnectionResult({
        isConnected: true,
        error: null,
        strategyData: stratBody,
        projectData: projBody,
        strategyCount: strategyItems.length,
        projectCount: projectItems.length,
      })
      const totalStrategies = strategyItems.length
      setPortfoliosStatus(`Connected — ${totalStrategies} strategy item(s) found`)
      toast.success('Connected to Portfolios')
    } catch (err) {
      console.error('[Step3 Portfolios] Error testing connection', err)
      const message = err?.message || 'Could not reach Portfolios instance'
      setPortfoliosConnectionResult({ isConnected: false, error: message })
      setPortfoliosStatus(message)
      toast.error(message)
    } finally {
      setPortfoliosLoading(false)
    }
  }

  const handlePortfoliosDisconnect = () => {
    disconnectPortfolios()
    setPortfoliosStatus(null)
  }

  const getStrategyItemsForPreview = () => {
    const raw = portfoliosStrategyData
    if (!raw) return []
    const list = Array.isArray(raw?.value)
      ? raw.value
      : Array.isArray(raw?.d?.results)
        ? raw.d.results
        : Array.isArray(raw?.d)
          ? raw.d
          : Array.isArray(raw)
            ? raw
            : []
    const byCode = new Map()
    for (const item of list) {
      const code = String(item.strategy_code ?? '').trim()
      if (!code || byCode.has(code)) continue
      byCode.set(code, item)
    }
    return Array.from(byCode.values())
      .filter((item) => Number(item.depth ?? 0) > 0)
      .slice(0, 10)
  }

  const getProjectItemsForPreview = () => {
    const raw = portfoliosProjectData
    if (!raw) return []
    const list = Array.isArray(raw?.value)
      ? raw.value
      : Array.isArray(raw?.d?.results)
        ? raw.d.results
        : Array.isArray(raw?.d)
          ? raw.d
          : Array.isArray(raw)
            ? raw
            : []
    const filtered = list.filter((item) => {
      const wbs02 = String(item.WBS02 ?? '').toLowerCase()
      const name = String(item.Project_Name ?? '').toLowerCase()
      if (wbs02.includes('archived') || wbs02.includes('test data') || wbs02.includes('templates')) return false
      if (name.includes('test') || name.includes('template')) return false
      return true
    })
    return filtered.slice(0, 8)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Planview Live Data</h1>

      <div className="flex gap-4 border-b border-white/10 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('agileplace')}
          className={`pb-3 text-sm font-medium flex items-center gap-1 border-b-2 transition-all duration-150 ${
            activeTab === 'agileplace'
              ? 'border-cta-steel text-white'
              : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          <TabDot status={agileplaceStatus} />
          AgilePlace
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('portfolios')}
          className={`pb-3 text-sm font-medium flex items-center gap-1 border-b-2 transition-all duration-150 ${
            activeTab === 'portfolios'
              ? 'border-cta-steel text-white'
              : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          <TabDot status={portfoliosStatusType} />
          Portfolios
        </button>
      </div>

      {activeTab === 'agileplace' && (
        <>
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
        </>
      )}

      {activeTab === 'portfolios' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm text-white/60 leading-relaxed">
              Connect to Planview Portfolios to pull strategic planning and project portfolio context into the Falcon payload.
            </p>

            <div>
              <label className={labelClass}>Instance URL</label>
              <input
                type="url"
                value={portfoliosInstanceUrl}
                onChange={(e) => setPortfoliosInstanceUrl(e.target.value)}
                placeholder="https://scdemo520.pvcloud.com"
                className={inputClass}
                disabled={portfoliosLoading}
              />
            </div>
            <div>
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={portfoliosUsername || 'plt\\odata'}
                onChange={(e) => setPortfoliosUsername(e.target.value)}
                placeholder="plt\\odata"
                className={inputClass}
                disabled={portfoliosLoading}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={portfoliosPassword || 'data'}
                onChange={(e) => setPortfoliosPassword(e.target.value)}
                placeholder="Password"
                className={inputClass}
                disabled={portfoliosLoading}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePortfoliosTestConnection}
                disabled={portfoliosLoading}
                className="px-6 py-2.5 rounded-lg bg-cta-steel hover:bg-cta-steel-hover text-white font-medium disabled:opacity-50 transition-all duration-150 hover:scale-[1.01]"
              >
                {portfoliosLoading ? 'Testing…' : 'Test Connection'}
              </button>
              {portfoliosIsConnected && (
                <button
                  type="button"
                  onClick={handlePortfoliosDisconnect}
                  className="text-sm text-white/40 hover:text-white/70 transition-all duration-150"
                >
                  Disconnect
                </button>
              )}
            </div>

            {(portfoliosStatus || portfoliosLastError) && (
              <p className={`text-sm ${portfoliosLastError ? 'text-flash-red' : 'text-white/60'}`}>
                {portfoliosLastError || portfoliosStatus}
              </p>
            )}

            {portfoliosIsConnected && (
              <p className="text-xs text-white/40">
                {portfoliosStrategyCount} strategy item(s), {portfoliosProjectCount} project(s) loaded.
              </p>
            )}
          </div>

          <div className="rounded-xl bg-[#141414] border border-white/5 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest">
                Data Preview
              </h2>
            </div>

            {!portfoliosIsConnected || !portfoliosStrategyData || !portfoliosProjectData ? (
              <div className="flex items-center justify-center h-full min-h-[180px] rounded-xl border border-dashed border-white/10 -m-4">
                <p className="text-xs text-white/40 text-center px-6">
                  Connect to see a preview of your Portfolios data.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-2">
                    Strategy Hierarchy
                  </p>
                  <div className="bg-[#101010] rounded-lg p-3 max-h-[250px] overflow-y-auto space-y-1">
                    {getStrategyItemsForPreview().map((item, idx) => {
                      const depth = Number(item.depth ?? 0) || 0
                      const code = String(item.strategy_code ?? '').trim()
                      let name = ''
                      if (depth >= 1 && depth <= 7) {
                        const key = `Strategy_L${depth}`
                        name = String(item[key] ?? '').trim()
                      }
                      if (!name) {
                        name = String(item.Strategy_Description ?? '').trim()
                      }
                      const indent = depth > 1 ? (depth - 1) * 12 : 0
                      const colorClass = depth <= 2 ? 'text-white/80' : 'text-white/40'
                      const label = [name || '(unnamed)', code ? `(${code})` : ''].filter(Boolean).join(' ')
                      return (
                        <div
                          key={code || idx}
                          className={`text-xs ${colorClass}`}
                          style={{ marginLeft: `${indent}px` }}
                        >
                          {label}
                        </div>
                      )
                    })}
                  </div>
                  <p className="mt-1 text-[11px] text-white/30">
                    {portfoliosStrategyCount} total strategy items
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-2">
                    Projects
                  </p>
                  <div className="bg-[#101010] rounded-lg p-3 max-h-[250px] overflow-y-auto space-y-1">
                    {getProjectItemsForPreview().map((item, idx) => {
                      const name = String(item.Project_Name ?? '').trim() || '(Unnamed project)'
                      const lifecycle = String(item.Lifecycle_Stage ?? '').trim()
                      const overall = String(item.Overall_Status_Assessment ?? '').trim().toLowerCase()
                      let statusColor = 'bg-white/30'
                      if (overall.includes('green')) statusColor = 'bg-pv-grass'
                      else if (overall.includes('yellow') || overall.includes('amber')) statusColor = 'bg-yellow-400'
                      else if (overall.includes('red')) statusColor = 'bg-flash-red'
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 text-xs text-white/70"
                        >
                          <span className="truncate">{name}</span>
                          <span className="flex items-center gap-2 shrink-0">
                            <span className={`w-2 h-2 rounded-full ${statusColor}`} aria-hidden />
                            <span className="truncate text-white/50 max-w-[120px]">
                              {lifecycle || '—'}
                            </span>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <p className="mt-1 text-[11px] text-white/30">
                    {portfoliosProjectCount} total projects
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
