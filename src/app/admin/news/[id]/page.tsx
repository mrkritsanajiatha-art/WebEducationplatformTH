'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoTextarea } from '@/components/neo/NeoTextarea'
import { NeoSelect } from '@/components/neo/NeoSelect'
import { NeoButton } from '@/components/neo/NeoButton'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getNewsById, saveNews } from '@/lib/firebase/services/news'
import type { NewsStatus } from '@/types'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'ร่าง' },
  { value: 'published', label: 'เผยแพร่' },
  { value: 'scheduled', label: 'กำหนดเวลา' },
]

const CATEGORY_OPTIONS = [
  { value: '', label: '— เลือกหมวดหมู่ —' },
  { value: 'ประกาศ', label: 'ประกาศ' },
  { value: 'กิจกรรม', label: 'กิจกรรม' },
  { value: 'ข่าว', label: 'ข่าว' },
  { value: 'ความรู้', label: 'ความรู้' },
]

function toSlug(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `news-${Date.now()}`
}

export default function AdminNewsFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === 'new'
  const router = useRouter()

  const [title, setTitle]     = useState('')
  const [slug, setSlug]       = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus]   = useState<NewsStatus>('draft')
  const [pinned, setPinned]   = useState(false)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!isNew) {
      getNewsById(id).then(news => {
        if (!news) return
        setTitle(news.title)
        setSlug(news.slug)
        setExcerpt(news.excerpt)
        setContent(news.content)
        setCoverUrl(news.coverUrl)
        setCategory(news.category)
        setStatus(news.status)
        setPinned(news.pinned)
      })
    }
  }, [id, isNew])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('กรุณาใส่หัวข้อข่าว'); return }
    setSaving(true)
    setError('')
    try {
      const finalSlug = slug.trim() || toSlug(title)
      await saveNews(isNew ? null : id, {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverUrl: coverUrl.trim(),
        category,
        tags: [],
        author: { uid: '', name: 'Admin', photoUrl: '' },
        status,
        publishAt: null,
        pinned,
      })
      router.push('/admin/news')
    } catch (e) {
      setError('บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AdminPageHeader
        title={isNew ? '📰 สร้างข่าวสาร' : '📰 แก้ไขข่าวสาร'}
        backHref="/admin/news"
      />

      <form onSubmit={handleSave}>
        <NeoCard hover={false} className="flex flex-col gap-5">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <NeoInput id="title" label="หัวข้อข่าว *" placeholder="หัวข้อข่าวสาร" value={title}
            onChange={e => { setTitle(e.target.value); if (isNew) setSlug(toSlug(e.target.value)) }} required />

          <NeoInput id="slug" label="Slug (URL)" placeholder="news-slug" value={slug}
            onChange={e => setSlug(e.target.value)} />

          <NeoInput id="coverUrl" label="URL รูปภาพปก" placeholder="https://..." value={coverUrl}
            onChange={e => setCoverUrl(e.target.value)} />

          <NeoSelect id="category" label="หมวดหมู่" options={CATEGORY_OPTIONS}
            value={category} onChange={e => setCategory(e.target.value)} />

          <NeoTextarea id="excerpt" label="สรุปย่อ" placeholder="สรุปข่าวย่อๆ…" rows={3}
            value={excerpt} onChange={e => setExcerpt(e.target.value)} />

          <NeoTextarea id="content" label="เนื้อหา (Markdown)" placeholder="# หัวข้อ&#10;&#10;เนื้อหา..." rows={12}
            value={content} onChange={e => setContent(e.target.value)} />

          <div className="flex items-center gap-6">
            <NeoSelect id="status" label="สถานะ" options={STATUS_OPTIONS}
              value={status} onChange={e => setStatus(e.target.value as NewsStatus)} />
            <label className="flex items-center gap-2 mt-6 cursor-pointer">
              <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)}
                className="w-4 h-4 rounded" />
              <span className="text-sm font-medium">ปักหมุด</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <NeoButton type="submit" variant="primary" loading={saving}>บันทึก</NeoButton>
            <NeoButton type="button" variant="ghost" onClick={() => router.push('/admin/news')}>ยกเลิก</NeoButton>
          </div>
        </NeoCard>
      </form>
    </div>
  )
}
