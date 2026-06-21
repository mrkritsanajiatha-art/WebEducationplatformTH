'use client'
import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { getEventBySlug, getRegistrationByUserAndEvent, registerEvent, cancelRegistration } from '@/lib/firebase/services/events'
import type { Event as EventData, EventRegistration, EventType } from '@/types'
import { Timestamp } from 'firebase/firestore'

const TYPE_LABELS: Record<EventType, string> = { online: 'ออนไลน์', onsite: 'ออนไซต์', hybrid: 'ไฮบริด' }

function formatDate(ts: Timestamp | null) {
  if (!ts) return '-'
  try { return ts.toDate().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
  catch { return '-' }
}

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { user } = useAuthStore()
  const [event, setEvent] = useState<EventData | null>(null)
  const [registration, setRegistration] = useState<EventRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    getEventBySlug(slug).then(async (ev) => {
      setEvent(ev)
      if (ev && user) {
        const reg = await getRegistrationByUserAndEvent(user.uid, ev.id)
        setRegistration(reg)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug, user])

  async function handleRegister() {
    if (!user || !event) { router.push('/login'); return }
    setActionLoading(true)
    try {
      const regId = await registerEvent({
        eventId: event.id,
        eventTitle: event.title,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'ผู้ใช้',
        userEmail: user.email ?? '',
        status: 'registered',
      })
      setRegistration({ id: regId, eventId: event.id, eventTitle: event.title, userId: user.uid, userName: user.displayName || '', userEmail: user.email ?? '', status: 'registered', registeredAt: Timestamp.now(), updatedAt: Timestamp.now() })
      setEvent(prev => prev ? { ...prev, registeredCount: prev.registeredCount + 1 } : prev)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCancel() {
    if (!registration || !event) return
    if (!confirm('ยกเลิกการลงทะเบียน?')) return
    setActionLoading(true)
    try {
      await cancelRegistration(registration.id, event.id)
      setRegistration(prev => prev ? { ...prev, status: 'cancelled' } : null)
      setEvent(prev => prev ? { ...prev, registeredCount: Math.max(0, prev.registeredCount - 1) } : prev)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-10 text-center text-[var(--color-text-muted)]">กำลังโหลด...</div>
  if (!event) return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <p className="text-[var(--color-text-muted)]">ไม่พบกิจกรรม</p>
      <Link href="/events" className="text-[var(--color-primary)] text-sm mt-2 block">← กลับ</Link>
    </div>
  )

  const isFull = event.capacity > 0 && event.registeredCount >= event.capacity
  const isRegistered = registration?.status === 'registered'
  const isCancelled = registration?.status === 'cancelled'

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/events" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 block">← กลับกิจกรรมทั้งหมด</Link>

      {event.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.coverUrl} alt={event.title} className="w-full h-56 object-cover rounded-2xl mb-6" />
      )}

      <div className="glass rounded-2xl p-6 border border-[var(--color-border)] mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium">
            {TYPE_LABELS[event.type]}
          </span>
          {event.price === 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">ฟรี</span>}
          {event.price > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">฿{event.price.toLocaleString()}</span>}
        </div>
        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>

        <div className="grid sm:grid-cols-2 gap-3 mb-6 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-lg">📅</span>
            <div>
              <p className="text-[var(--color-text-muted)] text-xs">วันที่เริ่ม</p>
              <p className="font-medium">{formatDate(event.startAt)}</p>
            </div>
          </div>
          {event.endAt && (
            <div className="flex items-start gap-2">
              <span className="text-lg">🏁</span>
              <div>
                <p className="text-[var(--color-text-muted)] text-xs">วันที่สิ้นสุด</p>
                <p className="font-medium">{formatDate(event.endAt)}</p>
              </div>
            </div>
          )}
          {event.location && (
            <div className="flex items-start gap-2">
              <span className="text-lg">📍</span>
              <div>
                <p className="text-[var(--color-text-muted)] text-xs">สถานที่</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
          )}
          {event.capacity > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-lg">👥</span>
              <div>
                <p className="text-[var(--color-text-muted)] text-xs">ผู้ลงทะเบียน</p>
                <p className="font-medium">{event.registeredCount} / {event.capacity} คน</p>
              </div>
            </div>
          )}
        </div>

        {/* Registration action */}
        {isRegistered ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium text-center">
              ✅ คุณลงทะเบียนแล้ว
            </div>
            {event.zoomUrl && (
              <a href={event.zoomUrl} target="_blank" rel="noopener noreferrer"
                className="block text-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                เข้าร่วม Zoom
              </a>
            )}
            <button onClick={handleCancel} disabled={actionLoading}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50">
              ยกเลิกการลงทะเบียน
            </button>
          </div>
        ) : isCancelled ? (
          <div className="space-y-3">
            <p className="text-sm text-center text-[var(--color-text-muted)]">คุณได้ยกเลิกการลงทะเบียนแล้ว</p>
            <button onClick={handleRegister} disabled={actionLoading || isFull}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
              {isFull ? 'ที่นั่งเต็มแล้ว' : actionLoading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนอีกครั้ง'}
            </button>
          </div>
        ) : (
          <button onClick={handleRegister} disabled={actionLoading || isFull}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
            {isFull ? 'ที่นั่งเต็มแล้ว' : actionLoading ? 'กำลังลงทะเบียน...' : !user ? 'เข้าสู่ระบบเพื่อลงทะเบียน' : 'ลงทะเบียน'}
          </button>
        )}
      </div>

      {event.description && (
        <div className="glass rounded-2xl p-6 border border-[var(--color-border)]">
          <h2 className="font-bold text-lg mb-4">รายละเอียด</h2>
          <div className="prose prose-sm max-w-none text-[var(--color-text)] whitespace-pre-line leading-relaxed">
            {event.description}
          </div>
        </div>
      )}
    </main>
  )
}
