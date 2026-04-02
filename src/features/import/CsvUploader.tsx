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
        'relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer',
        dragging
          ? 'border-primary-400 bg-primary-50 dark:bg-primary-950'
          : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900'
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
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
            <RiFileLine className="size-6 text-primary-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{fileName}</p>
            <p className="mt-1 text-xs text-neutral-400">Click to change file</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex size-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
            <RiUploadCloud2Line className="size-6 text-neutral-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Drop your CSV file here
            </p>
            <p className="mt-1 text-xs text-neutral-400">or click to browse</p>
          </div>
          <Button variant="stroke" size="sm" type="button" disabled={loading}>
            Choose file
          </Button>
        </>
      )}
    </div>
  )
}
