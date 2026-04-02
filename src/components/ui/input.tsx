import * as React from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded border bg-neutral-900 px-3 py-2 text-sm text-neutral-100 transition-colors',
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
Input.displayName = 'Input'

export { Input }
