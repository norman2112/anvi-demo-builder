/**
 * Default context library files (stock collection). All are required (no option to remove).
 * By default none are selected; user checks which to include in the payload.
 */
import contentAgileplace from './ANVI_AGILEPLACE_1.0.md?raw'
import contentLimitations from './ANVI_LIMITATIONS_v1.0.md?raw'
import contentPlanviewMe from './ANVI_PLANVIEW_ME_v1.0.md?raw'
import contentPortfolios from './ANVI_PORTFOLIOS_1.0.md?raw'

export const DEFAULT_LIBRARY_FILES = [
  { id: 'ANVI_AGILEPLACE_1.0', name: 'ANVI_AGILEPLACE_1.0', content: contentAgileplace ?? '', required: true },
  { id: 'ANVI_LIMITATIONS', name: 'ANVI_LIMITATIONS', content: contentLimitations ?? '', required: true },
  { id: 'ANVI_PLANVIEW_ME', name: 'ANVI_PLANVIEW_ME', content: contentPlanviewMe ?? '', required: true },
  { id: 'ANVI_PORTFOLIOS', name: 'ANVI_PORTFOLIOS', content: contentPortfolios ?? '', required: true },
]
