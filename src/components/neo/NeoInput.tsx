import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface NeoInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[var(--color-text)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
              'rounded-[var(--radius-sm)] border border-[var(--color-border)]',
              '[box-shadow:var(--shadow-neo-inset)]',
              'px-4 py-2.5 text-base outline-none',
              'focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-shadow',
              icon && 'pl-10',
              error && 'ring-2 ring-[var(--color-error)]/50',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
      </div>
    )
  }
)
NeoInput.displayName = 'NeoInput'
