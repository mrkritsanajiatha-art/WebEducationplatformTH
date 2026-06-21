'use client'
import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getEventById, saveEvent } from '@/lib/firebase/services/events'
import type { Event as EventData, EventStatus, EventType, AccessLevel } from '@/types'

function toSlug(s: string) { return s.toLowerCase().replace(/[^฀-๿a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

const EMPTY: Omit<EventData, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'> = {
  title: '', slug: '', description: '', coverUrl: '', type: 'online', status: 'draft',
  startAt: null, endAt: null, location: '', zoomUrl: '', capacity: 0, price: 0,
  accessLevel: 'guest', tags: [],
}

export default function AdminEventFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const isNew = id === 'new'
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    getEventById(id).then(ev => {
      if (ev) {
        const { id: _id, createdAt: _c, updatedAt: _u, registeredCount: _r, ...rest } = ev
        setForm(rest)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id, isNew])

  const set = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setError('กรุณาใส่ชื่อกิจกรรม'); return }
    const slug = form.slug || toSlug(form.title)
    setSaving(true)
    setError('')
    try {
      await saveEvent(isNew ? null : id, { ...form, slug })
      router.push('/admin/events')
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-[var(--color-text-muted)]">กำลังโหลด...</div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/events" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">← กลับ</Link>
        <h1 className="text-xl font-bold">{isNew ? 'เพิ่มกิจกรรมใหม่' : 'แก้ไขกิจกรรม'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="glass rounded-2xl p-5 border border-[var(--color-border)] space-y-4">
          <h2 className="font-semibold text-sm text-[var(--color-text-muted)] uppercase tracking-wide">ข้อมูลพื้นฐาน</h2>
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อกิจกรรม *</label>
            <input value={form.title} onChange={e => { set('title', e.target.value); if (!form.slug) set('slug', toSlug(e.target.value)) }}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input value={form.slug} onChange={e => set('slug', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm font-mono focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">รายละเอียด</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={5} className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm resize-none focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ภาพปก (URL)</label>
            <input value={form.coverUrl} onChange={e => set('coverUrl', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-[var(--color-border)] space-y-4">
          <h2 className="font-semibold text-sm text-[var(--color-text-muted)] uppercase tracking-wide">รูปแบบ & เวลา</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ประเภท</label>
              <select value={form.type} onChange={e => set('type', e.target.value as EventType)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]">
                <option value="online">ออนไลน์</option>
                <option value="onsite">ออนไซต์</option>
                <option value="hybrid">ไฮบริด</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">สถานะ</label>
              <select value={form.status} onChange={e => set('status', e.target.value as EventStatus)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]">
                <option value="draft">ฉบับร่าง</option>
                <option value="published">เผยแพร่</option>
                <option value="cancelled">ยกเลิก</option>
                <option value="completed">เสร็จสิ้น</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">วันที่เริ่ม</label>
              <input type="datetime-local" onChange={e => { const d = e.target.value ? new Date(e.target.value) : null; set('startAt', d ? { toDate: () => d, seconds: d.getTime()/1000, nanoseconds: 0 } : null) }}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">วันที่สิ้นสุด</label>
              <input type="datetime-local" onChange={e => { const d = e.target.value ? new Date(e.target.value) : null; set('endAt', d ? { toDate: () => d, seconds: d.getTime()/1000, nanoseconds: 0 } : null) }}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">สถานที่จัดงาน</label>
            <input value={form.location} onChange={e => set('location', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zoom URL</label>
            <input value={form.zoomUrl} onChange={e => set('zoomUrl', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-[var(--color-border)] space-y-4">
          <h2 className="font-semibold text-sm text-[var(--color-text-muted)] uppercase tracking-wide">ที่นั่ง & ราคา</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">จำนวนที่นั่ง</label>
              <input type="number" min={0} value={form.capacity} onChange={e => set('capacity', +e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">0 = ไม่จำกัด</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ราคา (บาท)</label>
              <input type="number" min={0} value={form.price} onChange={e => set('price', +e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">เข้าถึงได้โดย</label>
              <select value={form.accessLevel} onChange={e => set('accessLevel', e.target.value as AccessLevel)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]">
                <option value="guest">ทุกคน</option>
                <option value="member">สมาชิก</option>
                <option value="vip">VIP เท่านั้น</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

        <div className="flex gap-3">
          <Link href="/admin/events" className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-center hover:bg-[var(--color-bg)] transition-colors">
            ยกเลิก
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
            {saving ? 'กำลังบันทึก...' : isNew ? 'สร้างกิจกรรม' : 'บันทึก'}
          </button>
        </div>
      </form>
    </div>
  )
}
