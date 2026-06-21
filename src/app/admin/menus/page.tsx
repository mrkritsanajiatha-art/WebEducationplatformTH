'use client'
import { useState, useEffect } from 'react'
import { getMenuItems, saveMenuItem, deleteMenuItem } from '@/lib/firebase/services/menus'
import type { MenuItem, MenuLocation, UserRole } from '@/types'

const LOCATIONS: MenuLocation[] = ['header', 'footer', 'bottomnav']
const LOC_LABELS: Record<MenuLocation, string> = { header: 'Header', footer: 'Footer', bottomnav: 'Bottom Nav' }

const EMPTY: Omit<MenuItem, 'id'> = { label: '', icon: '', href: '/', type: 'internal', parentId: null, order: 0, roles: ['guest'], visible: true, location: 'header' }

export default function AdminMenusPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<MenuLocation>('header')
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState<Omit<MenuItem, 'id'>>(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getMenuItems().then(setItems).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function openCreate() { setForm({ ...EMPTY, location: tab }); setEditing({ id: '', ...EMPTY, location: tab }) }
  function openEdit(item: MenuItem) { const { id, ...rest } = item; setForm(rest); setEditing(item) }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const id = await saveMenuItem(editing.id || null, form)
      const updated = { id, ...form }
      setItems(prev => editing.id ? prev.map(x => x.id === editing.id ? updated : x) : [...prev, updated])
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('ลบรายการเมนูนี้?')) return
    await deleteMenuItem(id)
    setItems(prev => prev.filter(x => x.id !== id))
  }

  const set = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))
  const tabItems = items.filter(x => x.location === tab).sort((a, b) => a.order - b.order)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">จัดการเมนู</h1>
        <button onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
          + เพิ่มเมนู
        </button>
      </div>

      {/* Location tabs */}
      <div className="flex gap-2 mb-5">
        {LOCATIONS.map(loc => (
          <button key={loc} onClick={() => setTab(loc)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === loc ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-card)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10'}`}>
            {LOC_LABELS[loc]} ({items.filter(x => x.location === loc).length})
          </button>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] w-full max-w-md p-6 [box-shadow:var(--shadow-float)]">
            <h2 className="font-bold text-lg mb-4">{editing.id ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">Icon</label>
                  <input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🏠"
                    className="w-full px-2 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-center text-lg focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">ชื่อ</label>
                  <input value={form.label} onChange={e => set('label', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">URL / Href</label>
                <input value={form.href} onChange={e => set('href', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-mono focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">ประเภทลิงก์</label>
                  <select value={form.type} onChange={e => set('type', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]">
                    <option value="internal">ภายใน</option>
                    <option value="external">ภายนอก</option>
                    <option value="page">หน้า</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">ตำแหน่ง</label>
                  <select value={form.location} onChange={e => set('location', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]">
                    {LOCATIONS.map(l => <option key={l} value={l}>{LOC_LABELS[l]}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">ลำดับ</label>
                <input type="number" min={0} value={form.order} onChange={e => set('order', +e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.visible} onChange={e => set('visible', e.target.checked)} className="accent-[var(--color-primary)]" />
                  <span className="text-sm">แสดง</span>
                </label>
              </div>
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
        ) : tabItems.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-text-muted)]">
            <p className="text-4xl mb-3">☰</p><p>ยังไม่มีรายการเมนูใน {LOC_LABELS[tab]}</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {tabItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <span className="text-xl w-8 text-center">{item.icon || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] font-mono">{item.href}</p>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">#{item.order}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.visible ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {item.visible ? 'แสดง' : 'ซ่อน'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)}
                    className="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg)]">แก้ไข</button>
                  <button onClick={() => handleDelete(item.id)}
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
