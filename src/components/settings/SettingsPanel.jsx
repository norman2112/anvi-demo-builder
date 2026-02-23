import { useState, useEffect } from 'react'
import Checkbox from '../shared/Checkbox'
import { useConnectionStore } from '../../stores/connectionStore'
import { useUiStore } from '../../stores/uiStore'
import { useContextStore } from '../../stores/contextStore'
import { DEFAULT_LIBRARY_FILES } from '../../config/capabilities/defaults'
import {
  getFalconApiKey,
  setFalconApiKey,
  getEnvironments,
  saveEnvironments,
  getLibraryDefaultSelectedIds,
  setLibraryDefaultSelectedIds,
  getPayloadDefaults,
  savePayloadDefaults,
} from '../../utils/settingsStorage'
import { getFalconApiKeyDefault } from '../../services/falconAI'

function Section({ title, children }) {
  return (
    <section className="border-b border-white/5 pb-6 mb-6 last:border-b-0 last:mb-0">
      <h2 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">{title}</h2>
      {children}
    </section>
  )
}

export default function SettingsPanel({ onClose }) {
  const setUrl = useConnectionStore((s) => s.setUrl)
  const setToken = useConnectionStore((s) => s.setToken)
  const disconnect = useConnectionStore((s) => s.disconnect)
  const setCompanyContext = useContextStore((s) => s.setCompanyContext)
  const setDemoObjectives = useContextStore((s) => s.setDemoObjectives)
  const tipsVisible = useUiStore((s) => s.tipsVisible)
  const toggleTips = useUiStore((s) => s.toggleTips)

  const [falconKey, setFalconKeyState] = useState('')
  const [envs, setEnvs] = useState({ environments: [], activeId: null })
  const [newEnvName, setNewEnvName] = useState('')
  const [newEnvUrl, setNewEnvUrl] = useState('')
  const [newEnvToken, setNewEnvToken] = useState('')
  const [librarySelectedIds, setLibrarySelectedIds] = useState([])
  const [payloadTemplates, setPayloadTemplates] = useState([])
  const [newTemplateName, setNewTemplateName] = useState('')
  const [expandedTemplateId, setExpandedTemplateId] = useState(null)

  useEffect(() => {
    setFalconKeyState(getFalconApiKey() || getFalconApiKeyDefault())
    setEnvs(getEnvironments())
    setLibrarySelectedIds(getLibraryDefaultSelectedIds())
    setPayloadTemplates(getPayloadDefaults().templates)
  }, [])

  const handleSaveFalconKey = () => {
    setFalconApiKey(falconKey)
  }

  const handleAddEnvironment = () => {
    const name = (newEnvName || '').trim()
    const url = (newEnvUrl || '').trim()
    const token = (newEnvToken || '').trim()
    if (!name || !url || !token) return
    const id = crypto.randomUUID()
    const next = [...envs.environments, { id, name, url, token }]
    setEnvs({ environments: next, activeId: id })
    saveEnvironments({ environments: next, activeId: id })
    setUrl(url)
    setToken(token)
    disconnect()
    setNewEnvName('')
    setNewEnvUrl('')
    setNewEnvToken('')
  }

  const handleDeleteEnvironment = (id) => {
    const next = envs.environments.filter((e) => e.id !== id)
    const activeId = envs.activeId === id ? null : envs.activeId
    setEnvs({ environments: next, activeId })
    saveEnvironments({ environments: next, activeId })
  }

  const handleSwitchEnvironment = (id) => {
    const env = envs.environments.find((e) => e.id === id)
    if (env) {
      setUrl(env.url)
      setToken(env.token)
      disconnect()
      setEnvs((s) => ({ ...s, activeId: id }))
      saveEnvironments({ ...envs, activeId: id })
    }
  }

  const handleToggleLibraryDefault = (fileId, checked) => {
    const next = checked
      ? [...librarySelectedIds, fileId].filter((a, i, arr) => arr.indexOf(a) === i)
      : librarySelectedIds.filter((x) => x !== fileId)
    setLibrarySelectedIds(next)
    setLibraryDefaultSelectedIds(next)
  }

  const handleAddPayloadTemplate = () => {
    const name = (newTemplateName || '').trim()
    if (!name) return
    const id = crypto.randomUUID()
    const next = [...payloadTemplates, { id, name, companyContext: '', demoObjectives: '' }]
    setPayloadTemplates(next)
    savePayloadDefaults({ templates: next })
    setNewTemplateName('')
    setExpandedTemplateId(id)
  }

  const handleUpdatePayloadTemplate = (id, field, value) => {
    const next = payloadTemplates.map((t) =>
      t.id === id ? { ...t, [field]: value } : t
    )
    setPayloadTemplates(next)
    savePayloadDefaults({ templates: next })
  }

  const handleDeletePayloadTemplate = (id) => {
    const next = payloadTemplates.filter((t) => t.id !== id)
    setPayloadTemplates(next)
    savePayloadDefaults({ templates: next })
    if (expandedTemplateId === id) setExpandedTemplateId(null)
  }

  const handleApplyPayloadTemplate = (t) => {
    setCompanyContext(t.companyContext ?? '')
    setDemoObjectives(t.demoObjectives ?? '')
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/80 placeholder-white/20 focus:border-cta-steel focus:ring-1 focus:ring-cta-steel/30 focus:outline-none text-sm transition-all duration-150'
  return (
    <div className="h-full flex flex-col bg-[#111111]">
      <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
        <h1 className="text-base font-extralight text-white tracking-tight">Settings</h1>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-white/30 hover:text-white/60 transition-all duration-150"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <Section title="General">
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
            <Checkbox checked={tipsVisible} onChange={toggleTips} aria-label="Show tips" />
            Show tips in the app
          </label>
        </Section>

        <Section title="Falcon AI">
          <p className="text-xs text-white/40 mb-2">API key is stored locally and never sent except to your Falcon endpoint.</p>
          <input
            type="password"
            value={falconKey}
            onChange={(e) => setFalconKeyState(e.target.value)}
            placeholder="API key"
            className={`${inputClass} mb-2`}
          />
          <button
            type="button"
            onClick={handleSaveFalconKey}
            className="px-4 py-2.5 rounded-lg bg-cta-steel hover:bg-cta-steel-hover text-white text-sm font-medium transition-all duration-150"
          >
            Save key
          </button>
        </Section>

        <Section title="Environments">
          <p className="text-xs text-white/40 mb-2">Named AgilePlace connections. Switch from the dropdown to load URL and token.</p>
          <select
            value={envs.activeId ?? ''}
            onChange={(e) => handleSwitchEnvironment(e.target.value || null)}
            className={`${inputClass} mb-3`}
          >
            <option value="">— Select environment —</option>
            {envs.environments.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <div className="space-y-2 mb-3">
            <input type="text" value={newEnvName} onChange={(e) => setNewEnvName(e.target.value)} placeholder="Environment name" className={inputClass} />
            <input type="url" value={newEnvUrl} onChange={(e) => setNewEnvUrl(e.target.value)} placeholder="Base URL" className={inputClass} />
            <input type="password" value={newEnvToken} onChange={(e) => setNewEnvToken(e.target.value)} placeholder="API token" className={inputClass} />
            <button type="button" onClick={handleAddEnvironment} className="px-4 py-2.5 rounded-lg bg-cta-steel hover:bg-cta-steel-hover text-white text-sm font-medium transition-all duration-150">
              Save environment
            </button>
          </div>
          <ul className="space-y-2">
            {envs.environments.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-white/80 truncate">{e.name}</span>
                <button type="button" onClick={() => handleDeleteEnvironment(e.id)} className="text-flash-red/80 hover:text-flash-red text-sm shrink-0 transition-all duration-150">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Context Library">
          <p className="text-xs text-white/40 mb-2">Default capability files. Toggle which are selected by default when the app loads.</p>
          <ul className="space-y-2">
            {DEFAULT_LIBRARY_FILES.map((f) => (
              <li key={f.id} className="flex items-center gap-2">
                <Checkbox
                  checked={librarySelectedIds.includes(f.id)}
                  onChange={(checked) => handleToggleLibraryDefault(f.id, checked)}
                  aria-label={`Default select ${f.name}`}
                />
                <span className="text-sm text-white/70">{f.name}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Payload Defaults">
          <p className="text-xs text-white/40 mb-2">Optional templates for company context and demo objectives. Apply to prefill Step 1.</p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Template name"
              className={`flex-1 ${inputClass}`}
            />
            <button
              type="button"
              onClick={handleAddPayloadTemplate}
              className="px-4 py-2.5 rounded-lg bg-cta-steel hover:bg-cta-steel-hover text-white text-sm font-medium shrink-0 transition-all duration-150"
            >
              Add template
            </button>
          </div>
          <ul className="space-y-2">
            {payloadTemplates.map((t) => (
              <li key={t.id} className="rounded-lg border border-white/5 bg-[#141414] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-white">{t.name}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleApplyPayloadTemplate(t)} className="text-xs text-cta-ice hover:text-white/80 transition-all duration-150">Apply</button>
                    <button type="button" onClick={() => setExpandedTemplateId(expandedTemplateId === t.id ? null : t.id)} className="text-xs text-white/40 hover:text-white/70 transition-all duration-150">{expandedTemplateId === t.id ? 'Collapse' : 'Edit'}</button>
                    <button type="button" onClick={() => handleDeletePayloadTemplate(t.id)} className="text-xs text-flash-red/80 hover:text-flash-red transition-all duration-150">Delete</button>
                  </div>
                </div>
                {expandedTemplateId === t.id && (
                  <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-widest">Company Context</label>
                    <textarea value={t.companyContext ?? ''} onChange={(e) => handleUpdatePayloadTemplate(t.id, 'companyContext', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="Paste or type default company context..." />
                    <label className="block text-xs font-medium text-white/40 uppercase tracking-widest">Demo Objectives</label>
                    <textarea value={t.demoObjectives ?? ''} onChange={(e) => handleUpdatePayloadTemplate(t.id, 'demoObjectives', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="Paste or type default demo objectives..." />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  )
}
