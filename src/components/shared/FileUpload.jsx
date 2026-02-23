import { useCallback, useState } from 'react'

export default function FileUpload({ onAdd, accept = '.pdf,.docx,.txt,.md,image/*', readContent = false }) {
  const [dragging, setDragging] = useState(false)
  const [reading, setReading] = useState(false)

  const handleFiles = useCallback(
    async (fileList) => {
      if (!fileList?.length || !onAdd) return
      const files = Array.from(fileList)
      if (readContent) {
        setReading(true)
        try {
          for (const file of files) {
            const content = await (typeof file.text === 'function' ? file.text() : Promise.resolve(''))
            onAdd({
              id: crypto.randomUUID(),
              name: file.name,
              type: file.type,
              content: content ?? '',
            })
          }
        } finally {
          setReading(false)
        }
      } else {
        files.forEach((file) => {
          onAdd({
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
            type: file.type,
            content: null,
          })
        })
      }
    },
    [onAdd, readContent]
  )

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer?.files)
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const onDragLeave = () => setDragging(false)

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-150 ${
        dragging ? 'border-white/20 bg-white/[0.02]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
      } ${reading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      <p className="text-white/60 text-sm mb-2">
        {reading ? 'Reading files…' : 'Drag & drop files or click to browse'}
      </p>
      <input
        type="file"
        multiple
        accept={accept}
        className="hidden"
        id="file-upload"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={reading}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-cta-ice hover:text-white/80 text-sm font-medium transition-all duration-150"
      >
        Choose files
      </label>
    </div>
  )
}
