// Vite imports .md as raw string
import planPrompt from './falcon-plan-prompt.md?raw'
import genPrompt from './falcon-gen-prompt.md?raw'

export const planPromptText = planPrompt || ''
export const genPromptText = genPrompt || ''
