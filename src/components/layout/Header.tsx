'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/Logo'
import { NeoButton } from '@/components/neo/NeoButton'
import { NAV_ITEMS } from '@/config/site'
import { useAuthStore } from '@/stores/auth'
import { NotificationBell } from '@/components/layout/NotificationBell'
import type { SiteSettings } from '@/types'

interface HeaderProps {
  settings?: Partial<SiteSettings>
}

export function Header({ settings }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, role, loading, signOut } = useAuthStore()

  const handleSignOut = async () => {
    setAvatarOpen(false)
    await signOut()
    router.push('/')
  }

  const displayName = user?.displayName ?? user?.email ?? ''
  const initial = displayName[0]?.toUpperCase() ?? '?'
  const isAdmin = role === 'admin' || role === 'superadmin'

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
          <NotificationBell />

          {!loading && !user && (
            <Link href="/login">
              <NeoButton variant="primary" size="sm" className="hidden sm:inline-flex">
                เข้าสู่ระบบ
              </NeoButton>
            </Link>
          )}

          {!loading && user && (
            <div className="relative">
              <button
                onClick={() => setAvatarOpen(!avatarOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-white/60 transition-colors"
              >
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.photoURL} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {initial}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium max-w-[96px] truncate">
                  {displayName}
                </span>
              </button>

              {avatarOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAvatarOpen(false)} />
                  <div className="absolute right-0 mt-1 w-48 bg-[var(--color-card)] rounded-xl
                    [box-shadow:var(--shadow-float)] border border-[var(--color-border)] z-20 overflow-hidden py-1">
                    <div className="px-4 py-2.5 border-b border-[var(--color-border)]">
                      <p className="text-sm font-medium truncate">{displayName}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{role}</p>
                    </div>
                    <Link
                      href="/my-learning"
                      onClick={() => setAvatarOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <span>📚</span>
                      การเรียนของฉัน
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setAvatarOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--color-bg)] transition-colors"
                      >
                        <LayoutDashboard size={14} />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[var(--color-error)] hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      ออกจากระบบ
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

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
              {user ? (
                <NeoButton variant="danger" fullWidth onClick={handleSignOut}>
                  ออกจากระบบ
                </NeoButton>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <NeoButton variant="primary" fullWidth>เข้าสู่ระบบ</NeoButton>
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
