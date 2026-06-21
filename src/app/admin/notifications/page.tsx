'use client'
import { useState } from 'react'
import { sendNotification } from '@/lib/firebase/services/notifications'
import type { NotificationType } from '@/types'

const TYPES: { value: NotificationType; label: string; icon: string }[] = [
  { value: 'info', label: 'ข้อมูลทั่วไป', icon: 'ℹ️' },
  { value: 'success', label: 'สำเร็จ', icon: '✅' },
  { value: 'warning', label: 'แจ้งเตือน', icon: '⚠️' },
  { value: 'event', label: 'กิจกรรม', icon: '🎟️' },
  { value: 'payment', label: 'การชำระเงิน', icon: '💰' },
  { value: 'course', label: 'คอร์สเรียน', icon: '🎓' },
]

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({ title: '', body: '', type: 'info' as NotificationType, link: '', target: 'all' as 'all' | 'uid', userId: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) { setError('กรุณาใส่หัวข้อและเนื้อหา'); return }
    setSending(true)
    setError('')
    setSuccess(false)
    try {
      await sendNotification({
        userId: form.target === 'all' ? null : form.userId || null,
        title: form.title.trim(),
        body: form.body.trim(),
        type: form.type,
        link: form.link.trim() || undefined,
      })
      setSuccess(true)
      setForm(prev => ({ ...prev, title: '', body: '', link: '' }))
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold mb-6">ส่งการแจ้งเตือน</h1>

      <form onSubmit={handleSend} className="glass rounded-2xl p-6 border border-[var(--color-border)] space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">ส่งถึง</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="all" checked={form.target === 'all'} onChange={() => set('target', 'all')} className="accent-[var(--color-primary)]" />
              <span className="text-sm">ทุกคน (Broadcast)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="uid" checked={form.target === 'uid'} onChange={() => set('target', 'uid')} className="accent-[var(--color-primary)]" />
              <span className="text-sm">ผู้ใช้เฉพาะ (UID)</span>
            </label>
          </div>
          {form.target === 'uid' && (
            <input value={form.userId} onChange={e => set('userId', e.target.value)} placeholder="User UID"
              className="mt-2 w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm font-mono focus:outline-none focus:border-[var(--color-primary)]" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ประเภทการแจ้งเตือน</label>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => set('type', t.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${
                  form.type === t.value ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'border-[var(--color-border)] hover:bg-[var(--color-bg)]'
                }`}>
                <span>{t.icon}</span>
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">หัวข้อ *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">เนื้อหา *</label>
          <textarea value={form.body} onChange={e => set('body', e.target.value)} rows={3}
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm resize-none focus:outline-none focus:border-[var(--color-primary)]" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ลิงก์ (ไม่บังคับ)</label>
          <input value={form.link} onChange={e => set('link', e.target.value)} placeholder="/events/..."
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
        </div>

        {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
        {success && <p className="text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">✅ ส่งการแจ้งเตือนสำเร็จแล้ว</p>}

        <button type="submit" disabled={sending}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
          {sending ? 'กำลังส่ง...' : '📤 ส่งการแจ้งเตือน'}
        </button>
      </form>

      <div className="mt-4 p-4 glass rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
        <p className="font-medium mb-1">หมายเหตุ</p>
        <ul className="space-y-1 text-xs list-disc pl-4">
          <li>Broadcast (userId = null) — ผู้ใช้ทุกคนจะเห็นเมื่อเปิดหน้า /notifications</li>
          <li>ผู้ใช้เฉพาะ — ใส่ UID ของผู้ใช้ที่ต้องการแจ้ง</li>
          <li>ลิงก์คือ path ภายในเว็บ เช่น /events/slug หรือ /courses/slug</li>
        </ul>
      </div>
    </div>
  )
}
