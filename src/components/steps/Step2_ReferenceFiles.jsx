import FileUpload from '../shared/FileUpload'
import { useContextStore } from '../../stores/contextStore'

export default function Step2_ReferenceFiles() {
  const refFiles = useContextStore((s) => s.refFiles)
  const addRefFile = useContextStore((s) => s.addRefFile)
  const removeRefFile = useContextStore((s) => s.removeRefFile)

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-thin text-white tracking-tight mb-8">Reference Files</h1>
      <FileUpload onAdd={addRefFile} accept=".pdf,.docx,.txt,.md,image/*" />
      {refFiles.length > 0 && (
        <ul className="space-y-3">
          {refFiles.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#141414] border border-white/5"
            >
              <span className="text-sm text-white/80 truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => removeRefFile(f.id)}
                className="text-flash-red/80 hover:text-flash-red text-sm font-medium transition-all duration-150 shrink-0 ml-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
