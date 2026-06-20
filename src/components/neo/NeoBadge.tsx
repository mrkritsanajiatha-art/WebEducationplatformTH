import { cn } from '@/lib/utils'

type BadgeVariant = 'vip' | 'success' | 'warning' | 'error' | 'info' | 'default'

interface NeoBadgeProps {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}

const styles: Record<BadgeVariant, string> = {
  vip:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error:   'bg-red-50 text-red-700 border-red-200',
  info:    'bg-blue-50 text-blue-700 border-blue-200',
  default: 'bg-slate-50 text-slate-600 border-slate-200',
}

export function NeoBadge({ variant = 'default', className, children }: NeoBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
