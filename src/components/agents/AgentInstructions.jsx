import ReactMarkdown from 'react-markdown'

const markdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-lg font-semibold text-white mt-4 mb-2 first:mt-0" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-base font-semibold text-white mt-4 mb-2 border-b border-white/5 pb-1" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-sm font-semibold text-white mt-3 mb-1" {...props} />,
  p: ({ node, ...props }) => <p className="text-sm text-white/60 mb-2 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside text-sm text-white/60 mb-2 space-y-1 pl-2" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-sm text-white/60 mb-2 space-y-1 pl-2" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-white/80" {...props} />,
  code: ({ node, ...props }) => {
    const isBlock = typeof props.children === 'string' && props.children.includes('\n')
    return isBlock ? (
      <code className="block p-3 rounded bg-[#0f0f0f] text-white/60 font-mono text-xs overflow-x-auto mb-2 whitespace-pre" {...props} />
    ) : (
      <code className="px-1.5 py-0.5 rounded bg-[#0f0f0f] text-cta-ice font-mono text-xs" {...props} />
    )
  },
  pre: ({ node, ...props }) => <pre className="p-0 rounded overflow-x-auto mb-2 my-2" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-cta-steel pl-3 text-white/60 text-sm italic my-2" {...props} />
  ),
  a: ({ node, ...props }) => <a className="text-cta-ice hover:underline" {...props} />,
}

/** Normalize "Instructions" section headings to "Anvi Agent Steps" for display */
function normalizeInstructionsHeading(content) {
  if (typeof content !== 'string') return ''
  return content
    .replace(/^(#{1,6})\s*Instructions\s*$/gim, '$1 Anvi Agent Steps')
}

export default function AgentInstructions({ text, highlightIds: enableHighlight = false }) {
  const raw = text ?? ''
  const content = normalizeInstructionsHeading(raw)

  if (!content.trim()) {
    return (
      <div className="p-3 text-sm text-white/40 italic">No content</div>
    )
  }

  return (
    <div className="overflow-auto max-h-[70vh]">
      <div className="prose-invert text-sm [&>*:first-child]:mt-0">
        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
