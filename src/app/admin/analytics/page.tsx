'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDashboardStats, getRecentActivity, type DashboardStats, type RecentActivity } from '@/lib/firebase/services/analytics'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

const STAT_CARDS = (s: DashboardStats) => [
  { icon: '👥', label: 'ผู้ใช้ทั้งหมด', value: s.totalUsers.toLocaleString(), color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/users' },
  { icon: '🎓', label: 'หลักสูตรที่เผยแพร่', value: s.totalCourses.toLocaleString(), color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/courses' },
  { icon: '📚', label: 'การลงทะเบียนเรียน', value: s.totalEnrollments.toLocaleString(), color: 'text-indigo-600', bg: 'bg-indigo-50', href: '/admin/payments' },
  { icon: '✅', label: 'กำลังเรียนอยู่', value: s.activeEnrollments.toLocaleString(), color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/payments' },
  { icon: '⏳', label: 'รอยืนยันการชำระ', value: s.pendingPayments.toLocaleString(), color: 'text-amber-600', bg: 'bg-amber-50', href: '/admin/payments' },
  { icon: '💰', label: 'รายได้รวม (บาท)', value: `฿${s.totalRevenue.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/payments' },
  { icon: '🎟️', label: 'กิจกรรมที่เปิด', value: s.totalEvents.toLocaleString(), color: 'text-rose-600', bg: 'bg-rose-50', href: '/admin/events' },
  { icon: '💬', label: 'โพสต์ชุมชน', value: s.totalPosts.toLocaleString(), color: 'text-cyan-600', bg: 'bg-cyan-50', href: '/admin/community' },
]

const ACTIVITY_ICONS: Record<string, string> = {
  enrollment: '📚', payment: '💳', user: '👤', post: '💬',
}

function timeAgo(d: Date) {
  try { return formatDistanceToNow(d, { addSuffix: true, locale: th }) } catch { return '' }
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  async function load() {
    setLoading(true)
    try {
      const [s, a] = await Promise.all([getDashboardStats(), getRecentActivity(12)])
      setStats(s)
      setActivity(a)
      setLastUpdate(new Date())
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Analytics</h1>
          {lastUpdate && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">อัปเดตล่าสุด: {lastUpdate.toLocaleTimeString('th-TH')}</p>}
        </div>
        <button onClick={load} disabled={loading}
          className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-bg)] disabled:opacity-50 transition-colors">
          {loading ? '⏳ โหลด...' : '🔄 รีเฟรช'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 border border-[var(--color-border)] animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-border)] mb-3" />
              <div className="h-6 bg-[var(--color-border)] rounded w-16 mb-1" />
              <div className="h-3 bg-[var(--color-border)] rounded w-24" />
            </div>
          ))
        ) : stats ? (
          STAT_CARDS(stats).map(card => (
            <Link key={card.label} href={card.href}
              className="glass rounded-2xl p-5 border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center text-xl mb-3`}>
                {card.icon}
              </div>
              <p className={`text-2xl font-extrabold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{card.label}</p>
            </Link>
          ))
        ) : (
          <div className="col-span-4 text-center py-8 text-[var(--color-text-muted)]">ไม่สามารถโหลดข้อมูลได้</div>
        )}
      </div>

      {/* Recent activity */}
      <div className="glass rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-bold">กิจกรรมล่าสุด</h2>
        </div>
        {activity.length === 0 && !loading ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">ยังไม่มีกิจกรรม</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {activity.map((a, i) => (
              <div key={`${a.id}-${i}`} className="flex items-center gap-3 px-5 py-3.5">
                <span className="text-xl flex-shrink-0">{ACTIVITY_ICONS[a.type] ?? '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{a.sub}</p>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] flex-shrink-0">{timeAgo(a.time)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'จัดการผู้ใช้', href: '/admin/users', icon: '👥' },
          { label: 'อนุมัติการชำระ', href: '/admin/payments', icon: '💰' },
          { label: 'เพิ่มหลักสูตร', href: '/admin/courses', icon: '🎓' },
          { label: 'ส่งแจ้งเตือน', href: '/admin/notifications', icon: '🔔' },
        ].map(l => (
          <Link key={l.href} href={l.href}
            className="flex items-center gap-2 px-4 py-3 glass rounded-xl border border-[var(--color-border)] text-sm font-medium hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 transition-all">
            <span>{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
