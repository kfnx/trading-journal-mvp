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
        'flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-xs transition-colors resize-none',
        'placeholder:text-neutral-400',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500',
        hasError
          ? 'border-error-500 focus:ring-error-500'
          : 'border-neutral-200 dark:border-neutral-700',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

export { Textarea }
