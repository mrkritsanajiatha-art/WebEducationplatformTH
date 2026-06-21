import { cn } from '@/lib/utils'
import { forwardRef, type SelectHTMLAttributes } from 'react'

interface NeoSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const NeoSelect = forwardRef<HTMLSelectElement, NeoSelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'w-full bg-[var(--color-card)] text-[var(--color-text)]',
          'rounded-[var(--radius-sm)] border border-[var(--color-border)]',
          '[box-shadow:var(--shadow-neo-inset)]',
          'px-4 py-2.5 text-base outline-none',
          'focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-shadow',
          error && 'ring-2 ring-[var(--color-error)]/50',
          className,
        )}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  ),
)
NeoSelect.displayName = 'NeoSelect'
