import CopyButton from '../shared/CopyButton'

export default function ScriptActions({ scriptText, onDownload, onPrint }) {
  return (
    <div className="flex gap-3">
      <CopyButton text={scriptText} label="Copy full script" />
      {onDownload && (
        <button
          type="button"
          onClick={onDownload}
          className="px-4 py-2 rounded-lg bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs font-medium transition-all duration-150"
        >
          Download
        </button>
      )}
      {onPrint && (
        <button
          type="button"
          onClick={onPrint}
          className="px-4 py-2 rounded-lg bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs font-medium transition-all duration-150"
        >
          Print
        </button>
      )}
    </div>
  )
}
