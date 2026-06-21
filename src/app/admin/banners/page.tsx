'use client'
import { useState, useEffect } from 'react'
import { getBannersList, saveBanner, deleteBanner, toggleBanner } from '@/lib/firebase/services/banners'
import type { Banner } from '@/types'

const EMPTY: Omit<Banner, 'id'> = { title: '', imageUrl: '', mobileImageUrl: '', link: '', position: 'hero', order: 0, active: true, startAt: null, endAt: null }
const POSITIONS = ['hero', 'strip', 'popup'] as const

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState<Omit<Banner, 'id'>>(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getBannersList().then(setBanners).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function openCreate() { setForm(EMPTY); setEditing({ id: '', ...EMPTY }) }
  function openEdit(b: Banner) { const { id, ...rest } = b; setForm(rest); setEditing(b) }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const id = await saveBanner(editing.id || null, form)
      const updated = { id, ...form }
      setBanners(prev => editing.id ? prev.map(b => b.id === editing.id ? updated : b) : [updated, ...prev])
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('ลบแบนเนอร์นี้?')) return
    await deleteBanner(id)
    setBanners(prev => prev.filter(b => b.id !== id))
  }

  async function handleToggle(id: string, active: boolean) {
    await toggleBanner(id, !active)
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !active } : b))
  }

  const set = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">จัดการแบนเนอร์</h1>
        <button onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
          + เพิ่มแบนเนอร์
        </button>
      </div>

      {/* Form modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] w-full max-w-lg p-6 [box-shadow:var(--shadow-float)]">
            <h2 className="font-bold text-lg mb-4">{editing.id ? 'แก้ไขแบนเนอร์' : 'เพิ่มแบนเนอร์ใหม่'}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อ</label>
                <input value={form.title} onChange={e => set('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">รูปภาพ (URL)</label>
                <input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">รูปมือถือ (URL)</label>
                <input value={form.mobileImageUrl} onChange={e => set('mobileImageUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ลิงก์</label>
                <input value={form.link} onChange={e => set('link', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">ตำแหน่ง</label>
                  <select value={form.position} onChange={e => set('position', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]">
                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ลำดับ</label>
                  <input type="number" min={0} value={form.order} onChange={e => set('order', +e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-[var(--color-primary)]" />
                <span className="text-sm">เปิดใช้งาน</span>
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditing(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm hover:bg-[var(--color-bg)]">ยกเลิก</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50">
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl border border-[var(--color-border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">กำลังโหลด...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-text-muted)]">
            <p className="text-4xl mb-3">🖼️</p><p>ยังไม่มีแบนเนอร์</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {banners.map(b => (
              <div key={b.id} className="flex items-center gap-4 p-4">
                {b.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.imageUrl} alt={b.title} className="w-24 h-14 object-cover rounded-xl flex-shrink-0" />
                ) : (
                  <div className="w-24 h-14 rounded-xl bg-[var(--color-border)] flex items-center justify-center text-2xl flex-shrink-0">🖼️</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{b.title || '(ไม่มีชื่อ)'}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{b.position} · ลำดับ {b.order}</p>
                  {b.link && <p className="text-xs text-[var(--color-text-muted)] truncate">{b.link}</p>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button onClick={() => handleToggle(b.id, b.active)}
                    className={`text-xs px-2 py-1 rounded-lg border transition-colors ${b.active ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-[var(--color-border)] text-[var(--color-text-muted)]'}`}>
                    {b.active ? 'เปิด' : 'ปิด'}
                  </button>
                  <button onClick={() => openEdit(b)}
                    className="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg)]">แก้ไข</button>
                  <button onClick={() => handleDelete(b.id)}
                    className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">ลบ</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
