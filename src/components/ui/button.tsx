import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { tv, type VariantProps } from '@/utils/tv'
import { cn } from '@/utils/cn'

const buttonStyles = tv({
  base: 'inline-flex items-center justify-center gap-2 rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-40 select-none whitespace-nowrap',
  variants: {
    variant: {
      primary:
        'bg-primary-500 text-neutral-950 hover:bg-primary-400 active:bg-primary-600 font-semibold',
      secondary:
        'bg-neutral-800 text-neutral-100 hover:bg-neutral-700 active:bg-neutral-600',
      stroke:
        'border border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 active:bg-neutral-700',
      ghost:
        'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 active:bg-neutral-700',
      error:
        'bg-error-600 text-white hover:bg-error-500 active:bg-error-700',
      success:
        'bg-success-600 text-neutral-950 hover:bg-success-500 active:bg-success-700',
    },
    size: {
      xs: 'h-7 px-2.5 text-xs',
      sm: 'h-8 px-3 text-sm',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-5 text-base',
      xl: 'h-12 px-6 text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonStyles({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonStyles }
