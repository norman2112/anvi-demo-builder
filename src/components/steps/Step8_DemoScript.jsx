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

export default function Step8_DemoScript() {
  const demoScript = useResultsStore((s) => s.demoScript)

  if (!demoScript) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Demo Script</h1>
        <p className="text-sm text-white/60 leading-relaxed">
          Demo script will appear here after generation. Teleprompter-style layout.
        </p>
      </div>
    )
  }

  const markdown = getDemoScriptMarkdown(demoScript)
  const sections = demoScript?.sections ?? []

  const handleDownload = () => downloadMarkdown(markdown)
  const handlePrint = () => window.print()

  return (
    <div className="space-y-8 bg-[#0d0d0d] -mx-10 -my-8 px-10 py-8 rounded-2xl">
      <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Demo Script</h1>
      <div className="flex gap-3 justify-end">
        <ScriptActions
          scriptText={markdown}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      </div>

      {sections.length > 0 ? (
        <div className="demo-script-presenter">
          {sections.map((section, i) => {
            if (section.type === 'opening' || section.type === 'closing') {
              return (
                <ScriptSection
                  key={i}
                  title={section.title}
                  content={section.content}
                  variant={section.type === 'opening' ? 'opening' : 'closing'}
                />
              )
            }
            if (section.type === 'agent') {
              return (
                <ScriptSection
                  key={i}
                  title={`Agent ${section.agentNumber}: ${section.name}`}
                  content={section.content}
                  variant="agent"
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
        <div className="text-[15px] text-white/70 leading-[1.8] whitespace-pre-wrap font-serif">
          {markdown}
        </div>
      )}
    </div>
  )
}
