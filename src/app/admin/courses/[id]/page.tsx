'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoTextarea } from '@/components/neo/NeoTextarea'
import { NeoSelect } from '@/components/neo/NeoSelect'
import { NeoButton } from '@/components/neo/NeoButton'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getCourseById, saveCourse } from '@/lib/firebase/services/courses'
import type { CourseStatus, AccessLevel } from '@/types'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'ร่าง' },
  { value: 'published', label: 'เผยแพร่' },
  { value: 'archived', label: 'เก็บถาวร' },
]

const ACCESS_OPTIONS = [
  { value: 'guest', label: 'ทุกคน' },
  { value: 'member', label: 'สมาชิก' },
  { value: 'vip', label: 'VIP เท่านั้น' },
]

function toSlug(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `course-${Date.now()}`
}

export default function AdminCourseFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === 'new'
  const router = useRouter()

  const [title, setTitle]         = useState('')
  const [slug, setSlug]           = useState('')
  const [summary, setSummary]     = useState('')
  const [description, setDesc]    = useState('')
  const [coverUrl, setCoverUrl]   = useState('')
  const [price, setPrice]         = useState(0)
  const [accessLevel, setAccess]  = useState<AccessLevel>('guest')
  const [status, setStatus]       = useState<CourseStatus>('draft')
  const [capacity, setCapacity]   = useState(0)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!isNew) {
      getCourseById(id).then(c => {
        if (!c) return
        setTitle(c.title); setSlug(c.slug); setSummary(c.summary); setDesc(c.description)
        setCoverUrl(c.coverUrl); setPrice(c.price); setAccess(c.accessLevel)
        setStatus(c.status); setCapacity(c.capacity)
      })
    }
  }, [id, isNew])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('กรุณาใส่ชื่อหลักสูตร'); return }
    setSaving(true); setError('')
    try {
      await saveCourse(isNew ? null : id, {
        title: title.trim(),
        slug: slug.trim() || toSlug(title),
        summary: summary.trim(),
        description: description.trim(),
        categoryId: '',
        coverUrl: coverUrl.trim(),
        gallery: [],
        instructors: [],
        price,
        accessLevel,
        startDate: null,
        endDate: null,
        zoomUrl: '',
        youtubeUrl: '',
        enrollmentOpen: true,
        capacity,
        durationMin: 0,
        status,
        tags: [],
      })
      router.push('/admin/courses')
    } catch {
      setError('บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AdminPageHeader title={isNew ? '🎓 สร้างหลักสูตร' : '🎓 แก้ไขหลักสูตร'} backHref="/admin/courses" />
      <form onSubmit={handleSave}>
        <NeoCard hover={false} className="flex flex-col gap-5">
          {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          <NeoInput id="title" label="ชื่อหลักสูตร *" placeholder="ชื่อหลักสูตร" value={title}
            onChange={e => { setTitle(e.target.value); if (isNew) setSlug(toSlug(e.target.value)) }} required />
          <NeoInput id="slug" label="Slug (URL)" placeholder="course-slug" value={slug} onChange={e => setSlug(e.target.value)} />
          <NeoInput id="coverUrl" label="URL รูปภาพปก" placeholder="https://..." value={coverUrl} onChange={e => setCoverUrl(e.target.value)} />
          <NeoTextarea id="summary" label="สรุปย่อ" placeholder="สรุปหลักสูตรสั้นๆ…" rows={3} value={summary} onChange={e => setSummary(e.target.value)} />
          <NeoTextarea id="description" label="รายละเอียดหลักสูตร" placeholder="รายละเอียดเต็ม…" rows={8} value={description} onChange={e => setDesc(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <NeoInput id="price" label="ราคา (บาท) — 0 = ฟรี" type="number" min="0"
              value={price} onChange={e => setPrice(Number(e.target.value))} />
            <NeoInput id="capacity" label="รับจำนวน (0 = ไม่จำกัด)" type="number" min="0"
              value={capacity} onChange={e => setCapacity(Number(e.target.value))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NeoSelect id="accessLevel" label="สิทธิ์การเข้าถึง" options={ACCESS_OPTIONS}
              value={accessLevel} onChange={e => setAccess(e.target.value as AccessLevel)} />
            <NeoSelect id="status" label="สถานะ" options={STATUS_OPTIONS}
              value={status} onChange={e => setStatus(e.target.value as CourseStatus)} />
          </div>

          <div className="flex gap-3 pt-2">
            <NeoButton type="submit" variant="primary" loading={saving}>บันทึก</NeoButton>
            <NeoButton type="button" variant="ghost" onClick={() => router.push('/admin/courses')}>ยกเลิก</NeoButton>
          </div>
        </NeoCard>
      </form>
    </div>
  )
}
