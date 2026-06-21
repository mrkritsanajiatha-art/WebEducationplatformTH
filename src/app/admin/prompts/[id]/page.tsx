'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoTextarea } from '@/components/neo/NeoTextarea'
import { NeoSelect } from '@/components/neo/NeoSelect'
import { NeoButton } from '@/components/neo/NeoButton'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getPromptById, savePrompt } from '@/lib/firebase/services/prompts'
import type { Prompt, AccessLevel } from '@/types'

const CATEGORY_OPTIONS = [
  { value: 'teaching', label: 'การสอน' },
  { value: 'research', label: 'วิจัย' },
  { value: 'admin', label: 'บริหาร' },
  { value: 'creative', label: 'สร้างสรรค์' },
  { value: 'ai', label: 'AI' },
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

export default function AdminPromptFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === 'new'
  const router = useRouter()

  const [title, setTitle]           = useState('')
  const [description, setDesc]      = useState('')
  const [content, setContent]       = useState('')
  const [category, setCategory]     = useState<Prompt['category']>('teaching')
  const [tags, setTags]             = useState('')
  const [accessLevel, setAccess]    = useState<AccessLevel>('guest')
  const [status, setStatus]         = useState<'draft' | 'published'>('draft')
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    if (!isNew) {
      getPromptById(id).then(p => {
        if (!p) return
        setTitle(p.title); setDesc(p.description); setContent(p.content)
        setCategory(p.category); setTags(p.tags.join(', ')); setAccess(p.accessLevel); setStatus(p.status)
      })
    }
  }, [id, isNew])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError('กรุณาใส่ชื่อและเนื้อหา Prompt'); return }
    setSaving(true); setError('')
    try {
      await savePrompt(isNew ? null : id, {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        accessLevel,
        status,
      })
      router.push('/admin/prompts')
    } catch {
      setError('บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AdminPageHeader title={isNew ? '💡 เพิ่ม Prompt' : '💡 แก้ไข Prompt'} backHref="/admin/prompts" />
      <form onSubmit={handleSave}>
        <NeoCard hover={false} className="flex flex-col gap-5">
          {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          <NeoInput id="title" label="ชื่อ Prompt *" placeholder="ชื่อ prompt…" value={title} onChange={e => setTitle(e.target.value)} required />
          <NeoInput id="description" label="คำอธิบาย" placeholder="ใช้สำหรับ…" value={description} onChange={e => setDesc(e.target.value)} />

          <div className="grid grid-cols-3 gap-4">
            <NeoSelect id="category" label="หมวด" options={CATEGORY_OPTIONS} value={category} onChange={e => setCategory(e.target.value as Prompt['category'])} />
            <NeoSelect id="accessLevel" label="สิทธิ์" options={ACCESS_OPTIONS} value={accessLevel} onChange={e => setAccess(e.target.value as AccessLevel)} />
            <NeoSelect id="status" label="สถานะ" options={STATUS_OPTIONS} value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published')} />
          </div>

          <NeoInput id="tags" label="แท็ก (คั่นด้วยจุลภาค)" placeholder="AI, Gemini, วPA" value={tags} onChange={e => setTags(e.target.value)} />

          <NeoTextarea id="content" label="เนื้อหา Prompt *" placeholder="คุณคือผู้เชี่ยวชาญด้าน…&#10;&#10;โปรด..." rows={12}
            value={content} onChange={e => setContent(e.target.value)} required />

          <div className="flex gap-3 pt-2">
            <NeoButton type="submit" variant="primary" loading={saving}>บันทึก</NeoButton>
            <NeoButton type="button" variant="ghost" onClick={() => router.push('/admin/prompts')}>ยกเลิก</NeoButton>
          </div>
        </NeoCard>
      </form>
    </div>
  )
}
