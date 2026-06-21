'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getEventsList } from '@/lib/firebase/services/events'
import type { Event, EventType } from '@/types'
import { Timestamp } from 'firebase/firestore'

const TYPE_LABELS: Record<EventType, string> = { online: 'ออนไลน์', onsite: 'ออนไซต์', hybrid: 'ไฮบริด' }
const TYPE_COLORS: Record<EventType, string> = {
  online: 'bg-blue-100 text-blue-700',
  onsite: 'bg-green-100 text-green-700',
  hybrid: 'bg-purple-100 text-purple-700',
}

function formatDate(ts: Timestamp | null) {
  if (!ts) return '-'
  try {
    return ts.toDate().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return '-' }
}

function EventCard({ event }: { event: Event }) {
  const isFull = event.capacity > 0 && event.registeredCount >= event.capacity
  return (
    <Link href={`/events/${event.slug}`} className="block glass rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all">
      {event.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.coverUrl} alt={event.title} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 gradient-primary flex items-center justify-center text-white text-4xl">🎟️</div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[event.type]}`}>
            {TYPE_LABELS[event.type]}
          </span>
          {isFull && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">เต็ม</span>}
          {event.price === 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">ฟรี</span>}
        </div>
        <h3 className="font-bold text-base mb-1 line-clamp-2">{event.title}</h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">📅 {formatDate(event.startAt)}</p>
        {event.location && <p className="text-xs text-[var(--color-text-muted)]">📍 {event.location}</p>}
        {event.capacity > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
              <span>ผู้ลงทะเบียน</span>
              <span>{event.registeredCount}/{event.capacity}</span>
            </div>
            <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] rounded-full"
                style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filter, setFilter] = useState<EventType | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEventsList({ status: 'published' })
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter)

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">กิจกรรม</h1>
        <p className="text-[var(--color-text-muted)]">ร่วมกิจกรรมสัมมนา อบรม และงานประชุมต่าง ๆ</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'online', 'onsite', 'hybrid'] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === t
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10'
            }`}
          >
            {t === 'all' ? 'ทั้งหมด' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse border border-[var(--color-border)]">
              <div className="h-44 bg-[var(--color-border)]" />
              <div className="p-5 space-y-2">
                <div className="h-4 bg-[var(--color-border)] rounded w-3/4" />
                <div className="h-3 bg-[var(--color-border)] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-3">🎟️</p>
          <p>ยังไม่มีกิจกรรมในขณะนี้</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </main>
  )
}
