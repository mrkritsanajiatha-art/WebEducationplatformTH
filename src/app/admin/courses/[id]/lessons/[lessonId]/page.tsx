'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoTextarea } from '@/components/neo/NeoTextarea'
import { NeoSelect } from '@/components/neo/NeoSelect'
import { NeoButton } from '@/components/neo/NeoButton'
import { getLessonById, saveLesson } from '@/lib/firebase/services/lessons'
import type { CourseLesson, LessonType } from '@/types'

const TYPE_OPTIONS = [
  { value: 'video', label: '🎬 วิดีโอ' },
  { value: 'pdf', label: '📄 PDF' },
  { value: 'pptx', label: '📑 PowerPoint' },
  { value: 'docx', label: '📝 Word' },
  { value: 'text', label: '📃 บทความ' },
  { value: 'quiz', label: '❓ แบบทดสอบ' },
]

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

export default function AdminLessonFormPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id: courseId, lessonId } = use(params)
  const isNew = lessonId === 'new'
  const router = useRouter()
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '', description: '', type: 'video' as LessonType,
    contentUrl: '', durationMin: 0, order: 1, isPreview: false, status: 'draft' as 'draft' | 'published',
  })

  useEffect(() => {
    if (isNew) return
    getLessonById(lessonId).then(data => {
      if (data) setForm({
        title: data.title, description: data.description, type: data.type,
        contentUrl: data.contentUrl, durationMin: data.durationMin,
        order: data.order, isPreview: data.isPreview, status: data.status,
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [isNew, lessonId])

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title.trim()) { alert('กรุณากรอกชื่อบทเรียน'); return }
    setSaving(true)
    try {
      await saveLesson(isNew ? null : lessonId, { ...form, courseId })
      router.push(`/admin/courses/${courseId}/lessons`)
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-20 text-center text-[var(--color-text-muted)]">กำลังโหลด…</div>

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={isNew ? 'เพิ่มบทเรียน' : 'แก้ไขบทเรียน'}
        backHref={`/admin/courses/${courseId}/lessons`}
        backLabel="← บทเรียน"
      />
      <div className="flex flex-col gap-4">
        <NeoInput label="ชื่อบทเรียน *" value={form.title} onChange={e => set('title', e.target.value)} />
        <NeoTextarea label="คำอธิบาย" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
        <div className="grid grid-cols-2 gap-4">
          <NeoSelect label="ประเภท" options={TYPE_OPTIONS} value={form.type} onChange={e => set('type', e.target.value)} />
          <NeoSelect label="สถานะ" options={STATUS_OPTIONS} value={form.status} onChange={e => set('status', e.target.value)} />
        </div>
        <NeoInput label="URL เนื้อหา (วิดีโอ / ลิงก์ไฟล์)" value={form.contentUrl} onChange={e => set('contentUrl', e.target.value)} placeholder="https://" />
        <div className="grid grid-cols-2 gap-4">
          <NeoInput label="ระยะเวลา (นาที)" type="number" value={form.durationMin} onChange={e => set('durationMin', Number(e.target.value))} />
          <NeoInput label="ลำดับ" type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isPreview} onChange={e => set('isPreview', e.target.checked)}
            className="w-4 h-4 accent-[var(--color-primary)]" />
          <span className="text-sm">เปิดเป็นตัวอย่างฟรี (ไม่ต้องสมัคร)</span>
        </label>
        <div className="flex gap-3 pt-2">
          <NeoButton variant="primary" onClick={handleSave} loading={saving}>บันทึก</NeoButton>
          <NeoButton variant="ghost" onClick={() => router.push(`/admin/courses/${courseId}/lessons`)}>ยกเลิก</NeoButton>
        </div>
      </div>
    </div>
  )
}
