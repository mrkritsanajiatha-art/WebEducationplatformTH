'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Bell, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'

interface AdminTopbarProps {
  onMenuClick: () => void
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const router = useRouter()
  const { user, signOut } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const avatarUrl = user?.photoURL
  const displayName = user?.displayName ?? user?.email ?? 'Admin'
  const initial = displayName[0]?.toUpperCase() ?? 'A'

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6
      bg-[var(--color-card)] border-b border-[var(--color-border)]
      [box-shadow:0_2px_8px_rgba(0,0,0,.06)] flex-shrink-0">

      {/* Left: mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-colors"
        aria-label="เปิดเมนู"
      >
        <Menu size={20} />
      </button>
      <div className="hidden lg:block" />

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-colors"
          aria-label="การแจ้งเตือน"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-error)]" />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl
              hover:bg-[var(--color-bg)] transition-colors text-sm"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                {initial}
              </div>
            )}
            <span className="hidden sm:block font-medium max-w-[120px] truncate">
              {displayName}
            </span>
            <ChevronDown size={14} className="text-[var(--color-text-muted)]" />
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              {/* Menu */}
              <div className="absolute right-0 mt-1 w-48 bg-[var(--color-card)] rounded-xl
                [box-shadow:var(--shadow-float)] border border-[var(--color-border)]
                z-20 overflow-hidden py-1">
                <div className="px-4 py-2.5 border-b border-[var(--color-border)]">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); router.push('/admin/profile') }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[var(--color-bg)] transition-colors"
                >
                  <User size={14} />
                  โปรไฟล์
                </button>
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
      </div>
    </header>
  )
}
