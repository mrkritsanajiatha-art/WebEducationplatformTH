import { cn } from '@/lib/utils'
import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface NeoTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const NeoTextarea = forwardRef<HTMLTextAreaElement, NeoTextareaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'w-full bg-[var(--color-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
          'rounded-[var(--radius-sm)] border border-[var(--color-border)]',
          '[box-shadow:var(--shadow-neo-inset)]',
          'px-4 py-2.5 text-base outline-none resize-y min-h-[120px]',
          'focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-shadow',
          error && 'ring-2 ring-[var(--color-error)]/50',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  ),
)
NeoTextarea.displayName = 'NeoTextarea'
