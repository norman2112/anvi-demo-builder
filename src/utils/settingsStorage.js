/**
 * Settings persisted in localStorage (not in Zustand) for Settings panel.
 */

const FALCON_KEY = 'anvi-falcon-api-key'
const ENVIRONMENTS_KEY = 'anvi-environments'
const LIBRARY_DEFAULT_SELECTED_KEY = 'anvi-settings-library-default-selected'
const PAYLOAD_DEFAULTS_KEY = 'anvi-payload-defaults'

export function getFalconApiKey() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(FALCON_KEY) ?? '' : ''
}

export function setFalconApiKey(value) {
  if (typeof localStorage === 'undefined') return
  if (value == null || value === '') localStorage.removeItem(FALCON_KEY)
  else localStorage.setItem(FALCON_KEY, String(value))
}

export function getEnvironments() {
  if (typeof localStorage === 'undefined') return { environments: [], activeId: null }
  try {
    const raw = localStorage.getItem(ENVIRONMENTS_KEY)
    const data = raw ? JSON.parse(raw) : {}
    return {
      environments: Array.isArray(data.environments) ? data.environments : [],
      activeId: data.activeId ?? null,
    }
  } catch {
    return { environments: [], activeId: null }
  }
}

export function saveEnvironments({ environments, activeId }) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(ENVIRONMENTS_KEY, JSON.stringify({ environments: environments ?? [], activeId: activeId ?? null }))
}

export function getLibraryDefaultSelectedIds() {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(LIBRARY_DEFAULT_SELECTED_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function setLibraryDefaultSelectedIds(ids) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(LIBRARY_DEFAULT_SELECTED_KEY, JSON.stringify(Array.isArray(ids) ? ids : []))
}

export function getPayloadDefaults() {
  if (typeof localStorage === 'undefined') return { templates: [] }
  try {
    const raw = localStorage.getItem(PAYLOAD_DEFAULTS_KEY)
    const data = raw ? JSON.parse(raw) : {}
    const templates = Array.isArray(data.templates) ? data.templates : []
    return { templates }
  } catch {
    return { templates: [] }
  }
}

export function savePayloadDefaults({ templates }) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(PAYLOAD_DEFAULTS_KEY, JSON.stringify({ templates: templates ?? [] }))
}
