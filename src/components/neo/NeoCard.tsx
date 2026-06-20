import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface NeoCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  size?: 'sm' | 'md' | 'lg'
  glass?: boolean
}

export function NeoCard({ className, hover = true, size = 'md', glass = false, children, ...props }: NeoCardProps) {
  const padding = { sm: 'p-4', md: 'p-6', lg: 'p-8' }[size]

  return (
    <div
      className={cn(
        'rounded-[var(--radius)] transition-all duration-300',
        glass
          ? 'glass'
          : 'bg-[var(--color-card)] [box-shadow:var(--shadow-neo)]',
        hover && 'hover:-translate-y-1 hover:[box-shadow:var(--shadow-float)] cursor-pointer',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
