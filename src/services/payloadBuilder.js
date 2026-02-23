import { useConnectionStore } from '../stores/connectionStore'
import { useContextStore } from '../stores/contextStore'
import { useBoardStore } from '../stores/boardStore'
import { useLibraryStore } from '../stores/libraryStore'

const PLACEHOLDER_PATTERN = /placeholder|replace with actual/i

/** Returns true if text contains placeholder/replace-with-actual phrasing (case insensitive). */
export function hasPlaceholderContent(text) {
  if (text == null || typeof text !== 'string') return false
  return PLACEHOLDER_PATTERN.test(text)
}

/**
 * Validates that every selected context library file (and ref files) has no placeholder content.
 * Returns { valid: true } or { valid: false, fileName: string }.
 */
export function validateContextLibraryNoPlaceholders() {
  const { refFiles } = useContextStore.getState()
  const libraryFiles = useLibraryStore.getState().files
  const selectedLibrary = Object.entries(libraryFiles || {})
    .filter(([, f]) => f?.selected)
    .map(([id, f]) => ({ id, name: f?.name ?? id, content: f?.content ?? '' }))

  for (const f of selectedLibrary) {
    if (hasPlaceholderContent(f.content)) {
      return { valid: false, fileName: f.name ?? f.id }
    }
  }
  for (const f of refFiles || []) {
    if (hasPlaceholderContent(f?.content)) {
      return { valid: false, fileName: f?.name ?? 'Reference file' }
    }
  }
  return { valid: true }
}

export function buildContextPayload() {
  const { companyContext, demoObjectives, refFiles, customInstructions } = useContextStore.getState()
  const boards = useBoardStore.getState().getSelectedBoards()
  const libraryFiles = useLibraryStore.getState().files
  const selectedLibrary = Object.entries(libraryFiles || {})
    .filter(([, f]) => f?.selected)
    .map(([id, f]) => ({ id, name: f?.name, content: f?.content }))

  return {
    companyContext: companyContext || '',
    demoObjectives: demoObjectives || '',
    refFiles: (refFiles || []).map((f) => ({ name: f.name, type: f.type, content: f.content })),
    selectedBoards: boards,
    contextLibrary: selectedLibrary,
    customInstructions: customInstructions || '',
  }
}

export function buildPlanRequestPayload(planPromptText) {
  const payload = buildContextPayload()
  return {
    ...payload,
    planInstructions: planPromptText || '',
  }
}
