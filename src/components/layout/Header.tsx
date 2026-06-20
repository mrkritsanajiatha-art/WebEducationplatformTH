'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/Logo'
import { NeoButton } from '@/components/neo/NeoButton'
import { NAV_ITEMS } from '@/config/site'
import type { SiteSettings } from '@/types'

interface HeaderProps {
  settings?: Partial<SiteSettings>
}

export function Header({ settings }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/30">
      <nav className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Logo
          logoUrl={settings?.logoUrl}
          orgName="สมาพันธ์แพลตฟอร์มฯ"
          size="sm"
          showName={true}
          className="flex-shrink-0"
        />

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1 ml-4 flex-1">
          {NAV_ITEMS.slice(0, 7).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/60'
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-white/60 transition-colors" aria-label="ค้นหา">
            <Search size={18} />
          </button>
          <NeoButton variant="primary" size="sm" className="hidden sm:inline-flex">
            เข้าสู่ระบบ
          </NeoButton>
          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-white/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="เมนู"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden glass border-t border-white/30">
          <ul className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                    pathname === item.href
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text)] hover:bg-white/60'
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <NeoButton variant="primary" fullWidth>เข้าสู่ระบบ</NeoButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
