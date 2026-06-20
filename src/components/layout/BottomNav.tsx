'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BOTTOM_NAV_ITEMS } from '@/config/site'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/30 safe-area-bottom">
      <ul className="flex items-center justify-around py-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
                  active
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)]'
                )}
              >
                <span className={cn('text-xl leading-none', active && 'scale-110 transition-transform')}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
