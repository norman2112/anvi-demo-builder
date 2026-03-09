import { useContextStore } from '../stores/contextStore'
import { useBoardStore } from '../stores/boardStore'
import { useLibraryStore } from '../stores/libraryStore'
import { usePortfoliosStore } from '../stores/portfoliosStore'
import { formatStrategyHierarchy, formatProjectPortfolio } from '../utils/portfoliosFormatter'

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
      return { valid: false, fileName: f?.name ?? 'Supporting file' }
    }
  }
  return { valid: true }
}

export function buildContextPayload() {
  const { companyContext, demoObjectives, refFiles, customInstructions } = useContextStore.getState()
  const boards = useBoardStore.getState().getSelectedBoards()
  const libraryFiles = useLibraryStore.getState().files
  const portfolios = usePortfoliosStore.getState()
  const selectedLibrary = Object.entries(libraryFiles || {})
    .filter(([, f]) => f?.selected)
    .map(([id, f]) => ({ id, name: f?.name, content: f?.content }))

  let portfoliosContext = null
  if (portfolios?.isConnected && (portfolios.strategyData || portfolios.projectData)) {
    const strategy = formatStrategyHierarchy(portfolios.strategyData)
    const projects = formatProjectPortfolio(portfolios.projectData)
    const sections = [strategy.text, projects.text].filter(Boolean)
    const fullText =
      sections.length > 0
        ? [strategy.text || '', projects.text || ''].filter(Boolean).join('\n\n')
        : ''

    const instanceNumber = portfolios.instanceNumber || ''
    const instanceUrl = instanceNumber ? `https://scdemo${instanceNumber}.pvcloud.com` : ''

    portfoliosContext = {
      instanceUrl,
      strategyItemsCount: strategy.count,
      projectItemsCount: projects.count,
      text: fullText,
    }
  }

  return {
    companyContext: companyContext || '',
    demoObjectives: demoObjectives || '',
    refFiles: (refFiles || []).map((f) => ({ name: f.name, type: f.type, content: f.content })),
    selectedBoards: boards,
    contextLibrary: selectedLibrary,
    customInstructions: customInstructions || '',
    portfoliosContext,
  }
}

export function buildPlanRequestPayload(planPromptText) {
  const payload = buildContextPayload()
  return {
    ...payload,
    planInstructions: planPromptText || '',
  }
}
