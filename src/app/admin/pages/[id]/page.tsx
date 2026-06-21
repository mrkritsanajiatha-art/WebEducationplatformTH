'use client'
import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getPageById, savePage, updateBlocks } from '@/lib/firebase/services/pages'
import type { Page, PageBlock, BlockType } from '@/types'

const BLOCK_TYPES: { type: BlockType; icon: string; label: string; defaultProps: Record<string, unknown> }[] = [
  { type: 'hero', icon: '🏔️', label: 'Hero Banner', defaultProps: { heading: 'ยินดีต้อนรับ', subheading: 'คำอธิบายสั้น ๆ เกี่ยวกับองค์กร', buttonText: 'เริ่มต้นเลย', buttonHref: '/', bgImageUrl: '', overlay: true } },
  { type: 'section', icon: '📄', label: 'Section', defaultProps: { title: 'หัวข้อส่วนนี้', content: 'เนื้อหาของส่วนนี้...', imageUrl: '', imagePosition: 'right', bgColor: '' } },
  { type: 'cards', icon: '🃏', label: 'Cards', defaultProps: { title: 'บริการของเรา', columns: 3, items: [{ title: 'บริการ 1', description: 'คำอธิบาย', icon: '⭐', href: '/' }] } },
  { type: 'cta', icon: '📣', label: 'Call to Action', defaultProps: { heading: 'พร้อมเริ่มต้นแล้วหรือยัง?', subheading: 'เข้าร่วมกับเราวันนี้', buttonText: 'สมัครเลย', buttonHref: '/login', bgColor: '' } },
  { type: 'html', icon: '💻', label: 'HTML', defaultProps: { content: '<p>เนื้อหา HTML ที่ต้องการ</p>' } },
  { type: 'gallery', icon: '🖼️', label: 'Gallery', defaultProps: { title: 'แกลเลอรี่', columns: 3, items: [{ url: '', alt: 'ภาพ 1', caption: '' }] } },
  { type: 'stats', icon: '📊', label: 'Statistics', defaultProps: { title: 'ตัวเลขที่น่าภาคภูมิใจ', items: [{ value: '1,000+', label: 'สมาชิก', icon: '👥' }, { value: '50+', label: 'คอร์ส', icon: '🎓' }] } },
  { type: 'faq', icon: '❓', label: 'FAQ', defaultProps: { title: 'คำถามที่พบบ่อย', items: [{ question: 'คำถามตัวอย่าง?', answer: 'คำตอบตัวอย่าง...' }] } },
  { type: 'partners', icon: '🤝', label: 'Partners', defaultProps: { title: 'พันธมิตรของเรา', items: [{ name: 'พันธมิตร 1', logoUrl: '', href: '#' }] } },
]

function toSlug(s: string) { return s.toLowerCase().replace(/[^฀-๿a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

export default function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editJson, setEditJson] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [meta, setMeta] = useState({ title: '', slug: '', seoTitle: '', seoDesc: '', status: 'draft' as 'draft' | 'published' })
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    getPageById(id).then(p => {
      if (p) {
        setPage(p)
        setMeta({ title: p.title, slug: p.slug, seoTitle: p.seo?.title ?? '', seoDesc: p.seo?.description ?? '', status: p.status })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const blocks = page?.blocks ?? []

  function addBlock(type: BlockType) {
    const def = BLOCK_TYPES.find(b => b.type === type)
    if (!def || !page) return
    const newBlock: PageBlock = { type, props: def.defaultProps, order: blocks.length }
    const updated = [...blocks, newBlock]
    setPage(p => p ? { ...p, blocks: updated } : p)
    setShowAddBlock(false)
    setEditingIdx(updated.length - 1)
    setEditJson(JSON.stringify(def.defaultProps, null, 2))
  }

  function openEdit(idx: number) {
    setEditingIdx(idx)
    setEditJson(JSON.stringify(blocks[idx].props, null, 2))
    setJsonError('')
  }

  function applyJson() {
    if (editingIdx === null) return
    try {
      const parsed = JSON.parse(editJson)
      const updated = blocks.map((b, i) => i === editingIdx ? { ...b, props: parsed } : b)
      setPage(p => p ? { ...p, blocks: updated } : p)
      setEditingIdx(null)
      setJsonError('')
    } catch {
      setJsonError('JSON ไม่ถูกต้อง')
    }
  }

  function moveBlock(idx: number, dir: -1 | 1) {
    const target = idx + dir
    if (target < 0 || target >= blocks.length) return
    const updated = [...blocks]
    ;[updated[idx], updated[target]] = [updated[target], updated[idx]]
    updated.forEach((b, i) => { b.order = i })
    setPage(p => p ? { ...p, blocks: updated } : p)
    setEditingIdx(null)
  }

  function removeBlock(idx: number) {
    if (!confirm('ลบ block นี้?')) return
    const updated = blocks.filter((_, i) => i !== idx).map((b, i) => ({ ...b, order: i }))
    setPage(p => p ? { ...p, blocks: updated } : p)
    if (editingIdx === idx) setEditingIdx(null)
  }

  async function handleSave() {
    if (!page) return
    setSaving(true)
    setSaveMsg(null)
    try {
      await savePage(id, {
        title: meta.title,
        slug: meta.slug || toSlug(meta.title),
        blocks: page.blocks,
        seo: { title: meta.seoTitle || meta.title, description: meta.seoDesc, ogImage: page.seo?.ogImage ?? '' },
        status: meta.status,
        template: page.template ?? '',
      })
      setSaveMsg({ ok: true, text: '✅ บันทึกสำเร็จ' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setSaveMsg({ ok: false, text: `❌ บันทึกไม่สำเร็จ: ${msg}` })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-[var(--color-text-muted)]">กำลังโหลด...</div>
  if (!page) return <div className="p-8 text-center"><p className="text-[var(--color-text-muted)]">ไม่พบหน้านี้</p><Link href="/admin/pages" className="text-[var(--color-primary)] text-sm">← กลับ</Link></div>

  return (
    <div className="flex gap-6 min-h-full">
      {/* Block list */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/admin/pages" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">← กลับ</Link>
          <h1 className="text-xl font-bold flex-1 min-w-0 truncate">{meta.title}</h1>
          <Link href={`/p/${meta.slug}`} target="_blank" className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">ดูหน้า</Link>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
            {saving ? 'กำลังบันทึก...' : '💾 บันทึก'}
          </button>
        </div>

        {saveMsg && (
          <div className={`mb-4 px-4 py-2.5 rounded-xl text-sm ${saveMsg.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {saveMsg.text}
          </div>
        )}

        {/* Blocks */}
        <div className="space-y-3 mb-5">
          {blocks.length === 0 && (
            <div className="text-center py-12 text-[var(--color-text-muted)] border-2 border-dashed border-[var(--color-border)] rounded-2xl">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-sm">ยังไม่มี block กดปุ่มด้านล่างเพื่อเพิ่ม</p>
            </div>
          )}
          {blocks.map((block, idx) => {
            const def = BLOCK_TYPES.find(b => b.type === block.type)
            return (
              <div key={idx} className={`glass rounded-2xl border transition-all ${editingIdx === idx ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]'}`}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xl">{def?.icon ?? '📦'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{def?.label ?? block.type}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {typeof block.props.heading === 'string' ? block.props.heading :
                       typeof block.props.title === 'string' ? block.props.title :
                       block.type}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => moveBlock(idx, -1)} disabled={idx === 0}
                      className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] disabled:opacity-30 transition-colors" title="ขึ้น">↑</button>
                    <button onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1}
                      className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] disabled:opacity-30 transition-colors" title="ลง">↓</button>
                    <button onClick={() => editingIdx === idx ? setEditingIdx(null) : openEdit(idx)}
                      className={`text-xs px-2 py-1 rounded-lg border transition-colors ${editingIdx === idx ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-[var(--color-border)] hover:bg-[var(--color-bg)]'}`}>
                      {editingIdx === idx ? 'ปิด' : 'แก้ไข'}
                    </button>
                    <button onClick={() => removeBlock(idx)}
                      className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">ลบ</button>
                  </div>
                </div>

                {/* JSON editor for this block */}
                {editingIdx === idx && (
                  <div className="border-t border-[var(--color-border)] p-4">
                    <p className="text-xs font-mono text-[var(--color-text-muted)] mb-2">Props (JSON)</p>
                    <textarea
                      value={editJson}
                      onChange={e => { setEditJson(e.target.value); setJsonError('') }}
                      rows={10}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-xs font-mono resize-y focus:outline-none focus:border-[var(--color-primary)]"
                    />
                    {jsonError && <p className="text-xs text-[var(--color-error)] mt-1">{jsonError}</p>}
                    <div className="flex gap-2 mt-2">
                      <button onClick={applyJson}
                        className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium hover:opacity-90">
                        ✓ ใช้ Props นี้
                      </button>
                      <button onClick={() => setEditJson(JSON.stringify(blocks[idx].props, null, 2))}
                        className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs hover:bg-[var(--color-bg)]">
                        รีเซ็ต
                      </button>
                    </div>
                    <details className="mt-3">
                      <summary className="text-xs text-[var(--color-text-muted)] cursor-pointer">ดู Props Template</summary>
                      <pre className="mt-2 text-xs bg-[var(--color-bg)] p-3 rounded-lg overflow-auto">
                        {JSON.stringify(def?.defaultProps ?? {}, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button onClick={() => setShowAddBlock(!showAddBlock)}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-[var(--color-primary)] text-[var(--color-primary)] font-medium text-sm hover:bg-[var(--color-primary)]/5 transition-colors">
          + เพิ่ม Block
        </button>

        {/* Block picker */}
        {showAddBlock && (
          <div className="mt-3 glass rounded-2xl border border-[var(--color-border)] p-4">
            <p className="text-sm font-semibold mb-3">เลือกประเภท Block</p>
            <div className="grid grid-cols-3 gap-2">
              {BLOCK_TYPES.map(b => (
                <button key={b.type} onClick={() => addBlock(b.type)}
                  className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all text-left">
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-xs font-medium">{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metadata sidebar */}
      <div className="w-72 flex-shrink-0">
        <div className="glass rounded-2xl border border-[var(--color-border)] p-5 space-y-4 sticky top-4">
          <h2 className="font-semibold text-sm">ตั้งค่าหน้า</h2>
          <div>
            <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">ชื่อหน้า</label>
            <input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">Slug (URL)</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[var(--color-text-muted)]">/p/</span>
              <input value={meta.slug} onChange={e => setMeta(m => ({ ...m, slug: e.target.value }))}
                className="flex-1 px-2 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-xs font-mono focus:outline-none focus:border-[var(--color-primary)]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">สถานะ</label>
            <select value={meta.status} onChange={e => setMeta(m => ({ ...m, status: e.target.value as 'draft' | 'published' }))}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]">
              <option value="draft">ฉบับร่าง</option>
              <option value="published">เผยแพร่</option>
            </select>
          </div>
          <hr className="border-[var(--color-border)]" />
          <h3 className="font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wide">SEO</h3>
          <div>
            <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">SEO Title</label>
            <input value={meta.seoTitle} onChange={e => setMeta(m => ({ ...m, seoTitle: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-[var(--color-text-muted)]">SEO Description</label>
            <textarea value={meta.seoDesc} onChange={e => setMeta(m => ({ ...m, seoDesc: e.target.value }))}
              rows={3} className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm resize-none focus:outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div className="pt-2 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)]">{blocks.length} blocks</p>
          </div>
        </div>
      </div>
    </div>
  )
}
