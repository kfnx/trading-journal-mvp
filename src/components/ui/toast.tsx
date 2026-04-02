import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { RiCloseLine, RiCheckboxCircleLine, RiErrorWarningLine, RiInformationLine } from '@remixicon/react'
import { cn } from '@/utils/cn'

const ToastProvider = ToastPrimitive.Provider
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

type ToastVariant = 'default' | 'success' | 'error' | 'warning'

const toastVariantStyles: Record<ToastVariant, string> = {
  default: 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900',
  success: 'border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-950',
  error:   'border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-950',
  warning: 'border-warning-50 bg-warning-50',
}

const ToastRoot = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & { variant?: ToastVariant }
>(({ className, variant = 'default', ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0',
      'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full',
      toastVariantStyles[variant],
      className
    )}
    {...props}
  />
))
ToastRoot.displayName = ToastPrimitive.Root.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'ml-auto shrink-0 rounded-md p-1 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500',
      className
    )}
    {...props}
  >
    <RiCloseLine className="size-4" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = ToastPrimitive.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold text-neutral-900 dark:text-neutral-100', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

// Toast icon helper
function ToastIcon({ variant }: { variant?: ToastVariant }) {
  if (variant === 'success') return <RiCheckboxCircleLine className="size-5 text-success-600 shrink-0 mt-0.5" />
  if (variant === 'error')   return <RiErrorWarningLine className="size-5 text-error-600 shrink-0 mt-0.5" />
  if (variant === 'warning') return <RiErrorWarningLine className="size-5 text-warning-600 shrink-0 mt-0.5" />
  return <RiInformationLine className="size-5 text-primary-600 shrink-0 mt-0.5" />
}

// Simple hook-based toast state
interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

let toastListeners: ((toasts: ToastItem[]) => void)[] = []
let toastList: ToastItem[] = []

function notifyListeners() {
  toastListeners.forEach((fn) => fn([...toastList]))
}

export function toast(title: string, opts?: { description?: string; variant?: ToastVariant }) {
  const id = Math.random().toString(36).slice(2)
  toastList = [...toastList, { id, title, description: opts?.description, variant: opts?.variant }]
  notifyListeners()
  setTimeout(() => {
    toastList = toastList.filter((t) => t.id !== id)
    notifyListeners()
  }, 4000)
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])
  React.useEffect(() => {
    toastListeners.push(setToasts)
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== setToasts)
    }
  }, [])

  return (
    <ToastProvider>
      {toasts.map((t) => (
        <ToastRoot key={t.id} variant={t.variant} defaultOpen>
          <ToastIcon variant={t.variant} />
          <div className="flex-1">
            <ToastTitle>{t.title}</ToastTitle>
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose />
        </ToastRoot>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
