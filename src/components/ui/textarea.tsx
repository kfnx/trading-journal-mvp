import * as React from 'react'
import { cn } from '@/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full resize-none rounded border bg-neutral-900 px-3 py-2 text-sm text-neutral-100 transition-colors',
        'placeholder:text-neutral-600',
        'focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
        'disabled:cursor-not-allowed disabled:opacity-40',
        hasError
          ? 'border-error-500 focus:ring-error-500'
          : 'border-neutral-700',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

export { Textarea }
