import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiCheckLine, RiArrowRightLine, RiArrowLeftLine } from '@remixicon/react'
import { CsvUploader } from './CsvUploader'
import { FieldMapper } from './FieldMapper'
import { ImportPreview } from './ImportPreview'
import { Button } from '@/components/ui/button'
import { parseCsvFile, mapRowsToTrades, autoDetectMapping } from '@/utils/csvParser'
import { useTradeStore } from '@/store'
import { toast } from '@/components/ui/toast'
import type { CsvFieldMapping, RawTradeRow, Trade } from '@/types/trade'
import { REQUIRED_FIELDS } from '@/types/trade'

type Step = 'upload' | 'map' | 'preview'

const STEP_LABELS: Record<Step, string> = {
  upload:  '1. Upload CSV',
  map:     '2. Map Fields',
  preview: '3. Preview & Confirm',
}

export default function ImportPage() {
  const navigate = useNavigate()
  const importTrades = useTradeStore((s) => s.importTrades)

  const [step, setStep] = useState<Step>('upload')
  const [loading, setLoading] = useState(false)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<RawTradeRow[]>([])
  const [mapping, setMapping] = useState<Partial<CsvFieldMapping>>({})
  const [preview, setPreview] = useState<Trade[]>([])

  const handleFile = async (file: File) => {
    setLoading(true)
    const result = await parseCsvFile(file)
    if (result.error) {
      toast('Parse error', { description: result.error, variant: 'error' })
      setLoading(false)
      return
    }
    setHeaders(result.headers)
    setRows(result.rows)
    setMapping(autoDetectMapping(result.headers))
    setLoading(false)
    setStep('map')
  }

  const missingRequired = REQUIRED_FIELDS.filter((f) => !mapping[f])

  const handleConfirmMapping = () => {
    const trades = mapRowsToTrades(rows, mapping as CsvFieldMapping)
    setPreview(trades)
    setStep('preview')
  }

  const handleImport = () => {
    importTrades(preview)
    toast(`${preview.length} trades imported`, { variant: 'success' })
    navigate('/trades')
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-3">
        {(Object.keys(STEP_LABELS) as Step[]).map((s, i, arr) => (
          <div key={s} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`flex size-6 items-center justify-center rounded-full text-xs font-bold transition-colors
                ${step === s ? 'bg-primary-600 text-white' : s < step ? 'bg-success-500 text-white' : 'bg-neutral-200 text-neutral-500 dark:bg-neutral-700'}`}>
                {STEP_LABELS[s] < STEP_LABELS[step] ? <RiCheckLine className="size-3.5" /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${step === s ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400'}`}>
                {STEP_LABELS[s]}
              </span>
            </div>
            {i < arr.length - 1 && <div className="h-px w-8 bg-neutral-200 dark:bg-neutral-700" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        {step === 'upload' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Upload CSV file</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Export your trades from your broker and upload the CSV. Any format is supported — you'll map the fields next.
              </p>
              <p className="mt-2 text-xs text-neutral-400">
                Don't have a file yet?{' '}
                <a
                  href="/sample-trades.csv"
                  download
                  className="font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700"
                >
                  Download sample CSV
                </a>
                {' '}to try it out.
              </p>
            </div>
            <CsvUploader onFileParsed={handleFile} loading={loading} />
          </div>
        )}

        {step === 'map' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Map CSV columns</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Match your CSV columns to the app fields. Required fields must be mapped.
              </p>
            </div>
            <FieldMapper headers={headers} mapping={mapping} onChange={setMapping} />
            {missingRequired.length > 0 && (
              <p className="text-xs text-error-600">
                Still required: {missingRequired.join(', ')}
              </p>
            )}
            <div className="flex justify-between pt-2">
              <Button variant="stroke" size="sm" onClick={() => setStep('upload')}>
                <RiArrowLeftLine className="size-4" /> Back
              </Button>
              <Button size="sm" onClick={handleConfirmMapping} disabled={missingRequired.length > 0}>
                Preview <RiArrowRightLine className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Review trades</h2>
              <p className="mt-1 text-sm text-neutral-500">
                {preview.length} trades ready to import. Check the preview below.
              </p>
            </div>
            <ImportPreview trades={preview} />
            <div className="flex justify-between pt-2">
              <Button variant="stroke" size="sm" onClick={() => setStep('map')}>
                <RiArrowLeftLine className="size-4" /> Back
              </Button>
              <Button size="sm" onClick={handleImport} disabled={preview.length === 0}>
                <RiCheckLine className="size-4" /> Import {preview.length} trades
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
