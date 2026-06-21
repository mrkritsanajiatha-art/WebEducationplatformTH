'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPagesList, savePage, deletePage } from '@/lib/firebase/services/pages'
import type { Page } from '@/types'
import { Timestamp } from 'firebase/firestore'

function toSlug(s: string) { return s.toLowerCase().replace(/[^฀-๿a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

function fmt(ts: Timestamp) {
  try { return ts.toDate().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' }) }
  catch { return '-' }
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    getPagesList().then(setPages).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      const id = await savePage(null, {
        title: newTitle.trim(), slug: toSlug(newTitle), blocks: [],
        seo: { title: newTitle.trim(), description: '', ogImage: '' },
        status: 'draft', template: '',
      })
      setPages(prev => [{ id, title: newTitle.trim(), slug: toSlug(newTitle), blocks: [], seo: { title: newTitle.trim(), description: '', ogImage: '' }, status: 'draft', template: '', createdAt: Timestamp.now(), updatedAt: Timestamp.now() }, ...prev])
      setNewTitle('')
      setShowNew(false)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('ลบหน้านี้?')) return
    await deletePage(id)
    setPages(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">จัดการหน้าเพจ</h1>
        <button onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
          + สร้างหน้าใหม่
        </button>
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="glass rounded-2xl p-5 border border-[var(--color-border)] mb-5 flex gap-3">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="ชื่อหน้า..."
            autoFocus
            className="flex-1 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
          <button type="submit" disabled={creating || !newTitle.trim()}
            className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50">
            {creating ? 'กำลังสร้าง...' : 'สร้าง'}
          </button>
          <button type="button" onClick={() => setShowNew(false)}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm">ยกเลิก</button>
        </form>
      )}

      <div className="glass rounded-2xl border border-[var(--color-border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">กำลังโหลด...</div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-text-muted)]">
            <p className="text-4xl mb-3">🗂️</p>
            <p>ยังไม่มีหน้าเพจ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)] text-xs">
                  <th className="px-4 py-3 font-medium">ชื่อ</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Blocks</th>
                  <th className="px-4 py-3 font-medium">สถานะ</th>
                  <th className="px-4 py-3 font-medium">อัปเดต</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {pages.map(page => (
                  <tr key={page.id} className="hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-4 py-3 font-medium">{page.title}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">/p/{page.slug}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{page.blocks?.length ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${page.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                        {page.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] text-xs">{fmt(page.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/pages/${page.id}`}
                          className="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">
                          แก้ไข
                        </Link>
                        <Link href={`/p/${page.slug}`} target="_blank"
                          className="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">
                          ดู
                        </Link>
                        <button onClick={() => handleDelete(page.id)}
                          className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
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
