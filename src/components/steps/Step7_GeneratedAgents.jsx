import { useResultsStore } from '../../stores/resultsStore'
import { useUiStore } from '../../stores/uiStore'
import AgentCard from '../agents/AgentCard'
import CopyButton from '../shared/CopyButton'
import FalconAILoading from '../shared/FalconAILoading'
import StatsBar from '../results/StatsBar'

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

export default function Step7_GeneratedAgents() {
  const agents = useResultsStore((s) => s.agents)
  const validation = useResultsStore((s) => s.validation)
  const isLoading = useResultsStore((s) => s.isLoading)
  const error = useResultsStore((s) => s.error)
  const setStep = useUiStore((s) => s.setStep)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Generated Agents</h1>
        <FalconAILoading />
      </div>
    )
  }

  if (!agents?.length) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Generated Agents</h1>
        {error ? (
          <FalconAILoading error={error} onRetry={() => setStep(6)} />
        ) : (
          <p className="text-sm text-white/60 leading-relaxed">
            Generated agents will appear here after Pass 2 (Approve & Generate on Plan Review).
          </p>
        )}
      </div>
    )
  }

  const fullCopyText = getAllAgentsCopyText(agents)

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Generated Agents</h1>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <StatsBar agentCount={agents.length} />
        <CopyButton text={fullCopyText} label="Copy all agents" />
      </div>
      {validation && !validation.valid && validation.errors?.length > 0 && (
        <div className="p-4 rounded-xl border border-flash-red/30 bg-flash-red/10 text-flash-red text-sm">
          <p className="font-medium mb-1">Validation issues</p>
          <ul className="list-disc list-inside">{validation.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}
      {validation?.warnings?.length > 0 && (
        <div className="p-4 rounded-xl border border-pv-gold/30 bg-pv-gold/10 text-pv-gold text-sm">
          <p className="font-medium mb-1">Warnings</p>
          <ul className="list-disc list-inside">{validation.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}
      <ul className="space-y-4">
        {agents.map((agent, i) => (
          <li key={i}>
            <AgentCard agent={agent} index={i} defaultCollapsed={true} />
          </li>
        ))}
      </ul>
    </div>
  )
}
