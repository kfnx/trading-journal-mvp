import { Fragment } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { CsvFieldMapping } from '@/types/trade'
import { FIELD_LABELS, REQUIRED_FIELDS, OPTIONAL_FIELDS } from '@/types/trade'

interface Props {
  headers: string[]
  mapping: Partial<CsvFieldMapping>
  onChange: (mapping: Partial<CsvFieldMapping>) => void
}

const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]
const SKIP = '__skip__'

export function FieldMapper({ headers, mapping, onChange }: Props) {
  const setField = (field: keyof CsvFieldMapping, value: string) => {
    const resolved = value === SKIP ? undefined : value
    onChange({ ...mapping, [field]: resolved })
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 gap-y-2.5">
        {/* Header row */}
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">App field</span>
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">CSV column</span>

        {ALL_FIELDS.map((field) => {
          const isRequired = (REQUIRED_FIELDS as readonly string[]).includes(field)
          const currentValue = mapping[field] || SKIP

          return (
            <Fragment key={field}>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  {FIELD_LABELS[field]}
                </span>
                {isRequired && (
                  <Badge variant="error" className="text-[10px] px-1.5 py-0">required</Badge>
                )}
              </div>
              <span className="text-neutral-300 dark:text-neutral-600">→</span>
              <Select
                value={currentValue}
                onValueChange={(v) => setField(field, v)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SKIP}>— skip —</SelectItem>
                  {headers.map((h) => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
