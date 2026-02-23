/**
 * Validate Falcon Pass 2 response and parsed agents.
 * Returns { valid, errors, warnings } for UI and script generation.
 */

export function validateResponse(responseText, parsedAgents = null) {
  const errors = []
  const warnings = []

  if (!responseText?.trim()) {
    errors.push('Empty response from Falcon AI')
    return { valid: false, errors, warnings }
  }

  const agents = parsedAgents ?? []
  if (!agents.length) {
    errors.push('No agent configs could be parsed from the response')
    return { valid: false, errors, warnings }
  }

  agents.forEach((agent, i) => {
    const name = agent?.name ?? agent?.id ?? `Agent ${i + 1}`
    if (agent && typeof agent === 'object') {
      const hasInstructions =
        (agent.instructions && String(agent.instructions).trim()) ||
        (agent.raw && String(agent.raw).trim())
      if (!hasInstructions) {
        warnings.push(`${name}: missing instructions or content`)
      }
      if (!agent.id || String(agent.id).trim() === '') {
        warnings.push(`${name}: missing id (recommended for traceability)`)
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate after parsing; call with parseAgentConfigs(result) so validation can use parsed list.
 */
export function validateParsedAgents(parsedAgents) {
  return validateResponse(parsedAgents?.length ? 'ok' : '', parsedAgents)
}
