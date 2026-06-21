'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getEventsList, deleteEvent } from '@/lib/firebase/services/events'
import type { Event as EventData, EventStatus, EventType } from '@/types'
import { Timestamp } from 'firebase/firestore'

const STATUS_BADGE: Record<EventStatus, string> = {
  published: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}
const STATUS_LABELS: Record<EventStatus, string> = { published: 'เผยแพร่', draft: 'ฉบับร่าง', cancelled: 'ยกเลิก', completed: 'เสร็จสิ้น' }
const TYPE_LABELS: Record<EventType, string> = { online: 'ออนไลน์', onsite: 'ออนไซต์', hybrid: 'ไฮบริด' }

function fmt(ts: Timestamp | null) {
  if (!ts) return '-'
  try { return ts.toDate().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' }) }
  catch { return '-' }
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')

  useEffect(() => {
    getEventsList().then(setEvents).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('ลบกิจกรรมนี้?')) return
    await deleteEvent(id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const filtered = statusFilter === 'all' ? events : events.filter(e => e.status === statusFilter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">จัดการกิจกรรม</h1>
        <Link href="/admin/events/new" className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
          + เพิ่มกิจกรรม
        </Link>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'published', 'draft', 'cancelled', 'completed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-card)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10'
            }`}
          >
            {s === 'all' ? 'ทั้งหมด' : STATUS_LABELS[s]} {s === 'all' ? `(${events.length})` : `(${events.filter(e => e.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl border border-[var(--color-border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">ยังไม่มีกิจกรรม</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)] text-xs">
                  <th className="px-4 py-3 font-medium">ชื่อกิจกรรม</th>
                  <th className="px-4 py-3 font-medium">ประเภท</th>
                  <th className="px-4 py-3 font-medium">วันที่</th>
                  <th className="px-4 py-3 font-medium">ที่นั่ง</th>
                  <th className="px-4 py-3 font-medium">สถานะ</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map(event => (
                  <tr key={event.id} className="hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-4 py-3 font-medium max-w-[200px] truncate">{event.title}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{TYPE_LABELS[event.type]}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{fmt(event.startAt)}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">
                      {event.capacity > 0 ? `${event.registeredCount}/${event.capacity}` : '∞'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[event.status]}`}>
                        {STATUS_LABELS[event.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/events/${event.id}`} className="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">
                          แก้ไข
                        </Link>
                        <button onClick={() => handleDelete(event.id)} className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
