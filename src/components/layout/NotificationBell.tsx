'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { getNotificationsByUser, markAsRead } from '@/lib/firebase/services/notifications'
import type { Notification, NotificationType } from '@/types'

const TYPE_ICONS: Record<NotificationType, string> = {
  info: 'ℹ️', success: '✅', warning: '⚠️', event: '🎟️', payment: '💰', course: '🎓',
}

export function NotificationBell() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    getNotificationsByUser(user.uid, 10).then(setNotifications).catch(() => {})
  }, [user])

  const unread = notifications.filter(n => !n.read).length

  async function handleClick(n: Notification) {
    setOpen(false)
    if (!n.read) {
      await markAsRead(n.id)
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
    }
  }

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-white/60 transition-colors"
        aria-label="การแจ้งเตือน"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-80 bg-[var(--color-card)] rounded-xl [box-shadow:var(--shadow-float)] border border-[var(--color-border)] z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
              <span className="text-sm font-semibold">การแจ้งเตือน</span>
              <Link href="/notifications" onClick={() => setOpen(false)} className="text-xs text-[var(--color-primary)] hover:underline">ดูทั้งหมด</Link>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-8">ยังไม่มีการแจ้งเตือน</p>
              ) : (
                notifications.slice(0, 5).map(n => (
                  <Link
                    key={n.id}
                    href={n.link || '/notifications'}
                    onClick={() => handleClick(n)}
                    className={`flex gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] transition-colors ${!n.read ? 'bg-[var(--color-primary)]/5' : ''}`}
                  >
                    <span className="text-base flex-shrink-0">{TYPE_ICONS[n.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${!n.read ? 'text-[var(--color-primary)]' : ''}`}>{n.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-0.5">{n.body}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] flex-shrink-0 mt-1" />}
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
