import { useResultsStore } from '../../stores/resultsStore'
import { getDemoScriptMarkdown } from '../../services/scriptGenerator'
import ScriptSection from '../script/ScriptSection'
import CalloutBox from '../script/CalloutBox'
import ScriptActions from '../script/ScriptActions'

function downloadMarkdown(markdown, filename = 'demo-script.md') {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function DemoScriptTab() {
  const demoScript = useResultsStore((s) => s.demoScript)

  if (!demoScript) {
    return (
      <p className="text-med-grey text-sm">
        Demo script will appear here after generation. Teleprompter-style layout.
      </p>
    )
  }

  const markdown = getDemoScriptMarkdown(demoScript)
  const sections = demoScript?.sections ?? []

  const handleDownload = () => downloadMarkdown(markdown)
  const handlePrint = () => window.print()

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ScriptActions
          scriptText={markdown}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      </div>

      {sections.length > 0 ? (
        <div className="demo-script-presenter text-light-grey text-lg leading-relaxed font-serif">
          {sections.map((section, i) => {
            if (section.type === 'opening' || section.type === 'closing') {
              return (
                <ScriptSection
                  key={i}
                  title={section.title}
                  content={section.content}
                />
              )
            }
            if (section.type === 'agent') {
              return (
                <ScriptSection
                  key={i}
                  title={`Agent ${section.agentNumber}: ${section.name}`}
                  content={section.content}
                />
              )
            }
            if (section.type === 'callout') {
              return (
                <CalloutBox key={i} title={section.title}>
                  {section.content}
                </CalloutBox>
              )
            }
            return null
          })}
        </div>
      ) : (
        <div className="prose prose-invert max-w-none text-light-grey text-lg leading-relaxed whitespace-pre-wrap font-serif">
          {markdown}
        </div>
      )}
    </div>
  )
}
