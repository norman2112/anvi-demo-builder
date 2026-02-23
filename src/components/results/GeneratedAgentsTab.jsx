import { useResultsStore } from '../../stores/resultsStore'
import AgentCard from '../agents/AgentCard'
import CopyButton from '../shared/CopyButton'
import FalconAILoading from '../shared/FalconAILoading'
import StatsBar from './StatsBar'

function getAllAgentsCopyText(agents) {
  if (!Array.isArray(agents) || !agents.length) return ''
  return agents
    .map((agent, i) => {
      const name = agent?.name ?? `Agent ${i + 1}`
      const raw = typeof agent === 'string' ? agent : agent?.raw ?? JSON.stringify(agent, null, 2)
      return `--- ${name} ---\n${raw}`
    })
    .join('\n\n')
}

export default function GeneratedAgentsTab() {
  const agents = useResultsStore((s) => s.agents)
  const validation = useResultsStore((s) => s.validation)
  const isLoading = useResultsStore((s) => s.isLoading)
  const error = useResultsStore((s) => s.error)

  if (isLoading) {
    return <FalconAILoading />
  }

  if (!agents?.length) {
    return (
      <p className="text-med-grey text-sm">
        {error
          ? error
          : 'Generated agents will appear here after Pass 2 (Approve & Generate).'}
      </p>
    )
  }

  const fullCopyText = getAllAgentsCopyText(agents)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatsBar agentCount={agents.length} />
        <CopyButton text={fullCopyText} label="Copy all agents" />
      </div>
      {validation && !validation.valid && validation.errors?.length > 0 && (
        <div className="p-3 rounded border border-flash-red/50 bg-flash-red/10 text-flash-red text-sm">
          <p className="font-medium mb-1">Validation issues</p>
          <ul className="list-disc list-inside">{validation.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}
      {validation?.warnings?.length > 0 && (
        <div className="p-3 rounded border border-pv-gold/50 bg-pv-gold/10 text-pv-gold text-sm">
          <p className="font-medium mb-1">Warnings</p>
          <ul className="list-disc list-inside">{validation.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}
      <ul className="space-y-3">
        {agents.map((agent, i) => (
          <li key={i}>
            <AgentCard agent={agent} index={i} defaultCollapsed={true} />
          </li>
        ))}
      </ul>
    </div>
  )
}
