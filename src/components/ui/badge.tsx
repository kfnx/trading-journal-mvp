import * as React from 'react'
import { tv, type VariantProps } from '@/utils/tv'
import { cn } from '@/utils/cn'

const badgeStyles = tv({
  base: 'inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide font-medium',
  variants: {
    variant: {
      neutral: 'bg-neutral-800 text-neutral-300',
      primary: 'bg-primary-900 text-primary-400',
      success: 'bg-success-900 text-success-500',
      error:   'bg-error-900 text-error-500',
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
