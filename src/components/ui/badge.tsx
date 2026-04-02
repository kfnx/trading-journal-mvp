import * as React from 'react'
import { tv, type VariantProps } from '@/utils/tv'
import { cn } from '@/utils/cn'

const badgeStyles = tv({
  base: 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
  variants: {
    variant: {
      neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
      success: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300',
      error:   'bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-300',
      warning: 'bg-warning-50 text-warning-600',
    },
  },
  defaultVariants: { variant: 'neutral' },
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeStyles> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ variant }), className)} {...props} />
}

export { Badge, badgeStyles }
