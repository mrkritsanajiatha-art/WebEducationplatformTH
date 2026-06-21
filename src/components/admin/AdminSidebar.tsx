'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/Logo'

interface NavItem {
  label: string
  href: string
  icon: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const ADMIN_NAV: NavSection[] = [
  {
    title: 'ภาพรวม',
    items: [
      { label: 'Dashboard', href: '/admin', icon: '📊' },
    ],
  },
  {
    title: 'เนื้อหา',
    items: [
      { label: 'ข่าวสาร', href: '/admin/news', icon: '📰' },
      { label: 'หลักสูตร', href: '/admin/courses', icon: '🎓' },
      { label: 'ดาวน์โหลด', href: '/admin/downloads', icon: '📥' },
      { label: 'AI Hub', href: '/admin/ai-hub', icon: '🤖' },
      { label: 'Prompt Hub', href: '/admin/prompts', icon: '💡' },
    ],
  },
  {
    title: 'สมาชิก',
    items: [
      { label: 'ผู้ใช้งาน', href: '/admin/users', icon: '👥' },
      { label: 'VIP Members', href: '/admin/vip', icon: '👑' },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { label: 'การชำระเงิน', href: '/admin/payments', icon: '💰' },
      { label: 'กิจกรรม', href: '/admin/events', icon: '🎟️' },
      { label: 'ใบประกาศนียบัตร', href: '/admin/certificates', icon: '📜' },
    ],
  },
  {
    title: 'ชุมชน',
    items: [
      { label: 'Community', href: '/admin/community', icon: '💬' },
      { label: 'การแจ้งเตือน', href: '/admin/notifications', icon: '🔔' },
    ],
  },
  {
    title: 'เว็บไซต์',
    items: [
      { label: 'หน้าเพจ', href: '/admin/pages', icon: '🗂️' },
      { label: 'เมนู', href: '/admin/menus', icon: '☰' },
      { label: 'แบนเนอร์', href: '/admin/banners', icon: '🖼️' },
    ],
  },
  {
    title: 'ระบบ',
    items: [
      { label: 'ตั้งค่าเว็บไซต์', href: '/admin/settings', icon: '⚙️' },
      { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
    ],
  },
]

interface AdminSidebarProps {
  onClose?: () => void
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <aside className="flex flex-col h-full bg-[var(--color-text)] text-white w-60 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
          <Logo size="sm" showName={false} noLink />
          <span className="font-bold text-sm text-white leading-tight">
            Admin<br/>
            <span className="text-white/60 font-normal text-xs">แผงควบคุม</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
        {ADMIN_NAV.map((section) => (
          <div key={section.title}>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest px-2 mb-1">
              {section.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive(item.href)
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
        >
          <span>🌐</span>
          <span>ดูหน้าเว็บไซต์</span>
        </Link>
      </div>
    </aside>
  )
}
