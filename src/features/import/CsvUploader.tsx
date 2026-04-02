import { useRef, useState } from 'react'
import { RiUploadCloud2Line, RiFileLine } from '@remixicon/react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'

interface Props {
  onFileParsed: (file: File) => void
  loading?: boolean
}

export function CsvUploader({ onFileParsed, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') return
    setFileName(file.name)
    onFileParsed(file)
  }

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 border-2 border-dashed p-10 transition-colors cursor-pointer',
        dragging
          ? 'border-primary-500 bg-primary-950'
          : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600'
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      {fileName ? (
        <>
          <RiFileLine className="size-8 text-primary-500" />
          <div className="text-center">
            <p className="font-mono text-sm text-neutral-100">{fileName}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-neutral-500">Click to change file</p>
          </div>
        </>
      ) : (
        <>
          <RiUploadCloud2Line className="size-8 text-neutral-600" />
          <div className="text-center">
            <p className="font-mono text-sm text-neutral-300">Drop your CSV here</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-neutral-600">or click to browse</p>
          </div>
          <Button variant="stroke" size="sm" type="button" disabled={loading}>
            Choose file
          </Button>
        </>
      )}
    </div>
  )
}
