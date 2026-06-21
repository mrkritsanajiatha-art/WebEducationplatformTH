'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { getNotificationsByUser, markAsRead, markAllAsRead } from '@/lib/firebase/services/notifications'
import type { Notification, NotificationType } from '@/types'
import { Timestamp } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

const TYPE_ICONS: Record<NotificationType, string> = {
  info: 'ℹ️', success: '✅', warning: '⚠️', event: '🎟️', payment: '💰', course: '🎓',
}

function timeAgo(ts: Timestamp) {
  try { return formatDistanceToNow(ts.toDate(), { addSuffix: true, locale: th }) } catch { return '' }
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user, loading } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (user) {
      getNotificationsByUser(user.uid).then(n => { setNotifications(n); setFetching(false) }).catch(() => setFetching(false))
    }
  }, [user, loading, router])

  async function handleRead(n: Notification) {
    if (!n.read) {
      await markAsRead(n.id)
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
    }
    if (n.link) router.push(n.link)
  }

  async function handleMarkAll() {
    if (!user) return
    await markAllAsRead(user.uid)
    setNotifications(prev => prev.map(x => ({ ...x, read: true })))
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">การแจ้งเตือน</h1>
          {unread > 0 && <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{unread} ยังไม่ได้อ่าน</p>}
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAll} className="text-sm text-[var(--color-primary)] hover:underline">
            อ่านทั้งหมด
          </button>
        )}
      </div>

      {fetching ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-xl p-4 animate-pulse border border-[var(--color-border)]">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-border)] flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[var(--color-border)] rounded w-2/3" />
                  <div className="h-3 bg-[var(--color-border)] rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-3">🔔</p>
          <p>ยังไม่มีการแจ้งเตือน</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <button
              key={n.id}
              onClick={() => handleRead(n)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                n.read
                  ? 'bg-[var(--color-card)] border-[var(--color-border)]'
                  : 'glass border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5'
              }`}
            >
              <div className="flex gap-3 items-start">
                <span className="text-xl flex-shrink-0">{TYPE_ICONS[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${!n.read ? 'text-[var(--color-primary)]' : ''}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{n.body}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  )
}
