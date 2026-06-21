'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoTextarea } from '@/components/neo/NeoTextarea'
import { NeoSelect } from '@/components/neo/NeoSelect'
import { NeoButton } from '@/components/neo/NeoButton'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getAiArticleById, saveAiArticle } from '@/lib/firebase/services/aiArticles'
import type { AiArticle, AccessLevel } from '@/types'

const CATEGORY_OPTIONS = [
  { value: 'gemini', label: 'Gemini' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'notebooklm', label: 'NotebookLM' },
  { value: 'canva', label: 'Canva AI' },
  { value: 'other', label: 'อื่นๆ' },
]

const STATUS_OPTIONS = [
  { value: 'draft', label: 'ร่าง' },
  { value: 'published', label: 'เผยแพร่' },
]

const ACCESS_OPTIONS = [
  { value: 'guest', label: 'ทุกคน' },
  { value: 'member', label: 'สมาชิก' },
  { value: 'vip', label: 'VIP เท่านั้น' },
]

function toSlug(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `ai-${Date.now()}`
}

export default function AdminAiHubFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === 'new'
  const router = useRouter()

  const [title, setTitle]       = useState('')
  const [slug, setSlug]         = useState('')
  const [summary, setSummary]   = useState('')
  const [content, setContent]   = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [category, setCategory] = useState<AiArticle['category']>('gemini')
  const [accessLevel, setAccess] = useState<AccessLevel>('guest')
  const [status, setStatus]     = useState<'draft' | 'published'>('draft')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (!isNew) {
      getAiArticleById(id).then(a => {
        if (!a) return
        setTitle(a.title); setSlug(a.slug); setSummary(a.summary); setContent(a.content)
        setCoverUrl(a.coverUrl); setCategory(a.category); setAccess(a.accessLevel); setStatus(a.status)
      })
    }
  }, [id, isNew])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('กรุณาใส่หัวข้อ'); return }
    setSaving(true); setError('')
    try {
      await saveAiArticle(isNew ? null : id, {
        title: title.trim(),
        slug: slug.trim() || toSlug(title),
        summary: summary.trim(),
        content: content.trim(),
        coverUrl: coverUrl.trim(),
        category,
        tags: [],
        accessLevel,
        status,
      })
      router.push('/admin/ai-hub')
    } catch {
      setError('บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AdminPageHeader title={isNew ? '🤖 สร้างบทความ AI Hub' : '🤖 แก้ไขบทความ'} backHref="/admin/ai-hub" />
      <form onSubmit={handleSave}>
        <NeoCard hover={false} className="flex flex-col gap-5">
          {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          <NeoInput id="title" label="หัวข้อ *" placeholder="ชื่อบทความ" value={title}
            onChange={e => { setTitle(e.target.value); if (isNew) setSlug(toSlug(e.target.value)) }} required />
          <NeoInput id="slug" label="Slug (URL)" placeholder="ai-article-slug" value={slug} onChange={e => setSlug(e.target.value)} />
          <NeoInput id="coverUrl" label="URL รูปภาพปก" placeholder="https://..." value={coverUrl} onChange={e => setCoverUrl(e.target.value)} />

          <div className="grid grid-cols-3 gap-4">
            <NeoSelect id="category" label="หมวด AI" options={CATEGORY_OPTIONS} value={category} onChange={e => setCategory(e.target.value as AiArticle['category'])} />
            <NeoSelect id="accessLevel" label="สิทธิ์" options={ACCESS_OPTIONS} value={accessLevel} onChange={e => setAccess(e.target.value as AccessLevel)} />
            <NeoSelect id="status" label="สถานะ" options={STATUS_OPTIONS} value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published')} />
          </div>

          <NeoTextarea id="summary" label="สรุปย่อ" placeholder="สรุปบทความสั้นๆ…" rows={3} value={summary} onChange={e => setSummary(e.target.value)} />
          <NeoTextarea id="content" label="เนื้อหา (Markdown)" placeholder="# หัวข้อ&#10;&#10;เนื้อหา..." rows={14} value={content} onChange={e => setContent(e.target.value)} />

          <div className="flex gap-3 pt-2">
            <NeoButton type="submit" variant="primary" loading={saving}>บันทึก</NeoButton>
            <NeoButton type="button" variant="ghost" onClick={() => router.push('/admin/ai-hub')}>ยกเลิก</NeoButton>
          </div>
        </NeoCard>
      </form>
    </div>
  )
}
