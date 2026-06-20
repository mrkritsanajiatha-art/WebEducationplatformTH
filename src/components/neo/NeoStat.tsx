import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/utils'

interface NeoStatProps {
  label: string
  value: number | string
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'accent'
  className?: string
}

const colorMap = {
  primary:   'text-[var(--color-primary)]   bg-blue-50',
  secondary: 'text-[var(--color-secondary)] bg-sky-50',
  success:   'text-[var(--color-success)]   bg-green-50',
  warning:   'text-[var(--color-warning)]   bg-amber-50',
  accent:    'text-[var(--color-accent)]    bg-cyan-50',
}

export function NeoStat({ label, value, icon, color = 'primary', className }: NeoStatProps) {
  const display = typeof value === 'number' ? formatNumber(value) : value
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-[var(--radius)] bg-[var(--color-card)] p-6',
        '[box-shadow:var(--shadow-neo)]',
        className
      )}
    >
      {icon && (
        <span className={cn('text-2xl w-10 h-10 flex items-center justify-center rounded-xl', colorMap[color])}>
          {icon}
        </span>
      )}
      <div>
        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
        <p className={cn('text-3xl font-bold mt-1', `text-[var(--color-${color})]`)}>{display}</p>
      </div>
    </div>
  )
}
