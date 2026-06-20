'use client'
import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

export const NeoButton = forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-sm)] select-none'

    const sizes = {
      sm:  'px-3 py-1.5 text-sm',
      md:  'px-5 py-2.5 text-base',
      lg:  'px-7 py-3.5 text-lg',
    }

    const variants: Record<Variant, string> = {
      primary:
        'text-white gradient-primary [box-shadow:var(--shadow-neo-sm)] active:[box-shadow:var(--shadow-neo-inset)] active:scale-[.98]',
      secondary:
        'text-[var(--color-primary)] bg-[var(--color-card)] [box-shadow:var(--shadow-neo-sm)] active:[box-shadow:var(--shadow-neo-inset)] active:scale-[.98]',
      ghost:
        'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/50',
      soft:
        'bg-blue-50 text-[var(--color-primary)] hover:bg-blue-100 active:scale-[.98]',
      danger:
        'text-white bg-[var(--color-error)] [box-shadow:var(--shadow-neo-sm)] active:scale-[.98]',
    }

    return (
      <button
        ref={ref}
        className={cn(
          base,
          sizes[size],
          variants[variant],
          fullWidth && 'w-full',
          (disabled || loading) && 'opacity-60 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)
NeoButton.displayName = 'NeoButton'
