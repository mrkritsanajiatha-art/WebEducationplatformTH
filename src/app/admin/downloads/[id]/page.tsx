'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoTextarea } from '@/components/neo/NeoTextarea'
import { NeoSelect } from '@/components/neo/NeoSelect'
import { NeoButton } from '@/components/neo/NeoButton'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getDownloadById, saveDownload } from '@/lib/firebase/services/downloads'
import type { FileType, AccessLevel } from '@/types'

const FILE_TYPES = [
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'DOCX' },
  { value: 'xlsx', label: 'XLSX' },
  { value: 'pptx', label: 'PPTX' },
  { value: 'zip', label: 'ZIP' },
]

const ACCESS_OPTIONS = [
  { value: 'guest', label: 'ทุกคน (ไม่ต้องล็อกอิน)' },
  { value: 'member', label: 'สมาชิก' },
  { value: 'vip', label: 'VIP เท่านั้น' },
]

const CATEGORY_OPTIONS = [
  { value: '', label: '— เลือกหมวดหมู่ —' },
  { value: 'เอกสารวิชาการ', label: 'เอกสารวิชาการ' },
  { value: 'แบบฟอร์ม', label: 'แบบฟอร์ม' },
  { value: 'สื่อการสอน', label: 'สื่อการสอน' },
  { value: 'วิจัย', label: 'วิจัย' },
  { value: 'อื่นๆ', label: 'อื่นๆ' },
]

export default function AdminDownloadFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === 'new'
  const router = useRouter()

  const [title, setTitle]         = useState('')
  const [description, setDesc]    = useState('')
  const [category, setCategory]   = useState('')
  const [fileUrl, setFileUrl]     = useState('')
  const [fileName, setFileName]   = useState('')
  const [fileType, setFileType]   = useState<FileType>('pdf')
  const [fileSize, setFileSize]   = useState(0)
  const [accessLevel, setAccess]  = useState<AccessLevel>('guest')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!isNew) {
      getDownloadById(id).then(d => {
        if (!d) return
        setTitle(d.title); setDesc(d.description); setCategory(d.category)
        setFileUrl(d.fileUrl); setFileName(d.fileName); setFileType(d.fileType)
        setFileSize(d.fileSize); setAccess(d.accessLevel)
      })
    }
  }, [id, isNew])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !fileUrl.trim()) { setError('กรุณาใส่ชื่อและ URL ไฟล์'); return }
    setSaving(true); setError('')
    try {
      await saveDownload(isNew ? null : id, {
        title: title.trim(), description: description.trim(), category,
        fileUrl: fileUrl.trim(), fileName: fileName.trim() || title.trim(),
        fileType, fileSize, accessLevel,
      })
      router.push('/admin/downloads')
    } catch {
      setError('บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AdminPageHeader title={isNew ? '📥 เพิ่มไฟล์ดาวน์โหลด' : '📥 แก้ไขไฟล์'} backHref="/admin/downloads" />
      <form onSubmit={handleSave}>
        <NeoCard hover={false} className="flex flex-col gap-5">
          {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          <NeoInput id="title" label="ชื่อไฟล์ *" placeholder="ชื่อเอกสาร" value={title} onChange={e => setTitle(e.target.value)} required />
          <NeoSelect id="category" label="หมวดหมู่" options={CATEGORY_OPTIONS} value={category} onChange={e => setCategory(e.target.value)} />
          <NeoTextarea id="description" label="คำอธิบาย" placeholder="รายละเอียดเอกสาร…" rows={3} value={description} onChange={e => setDesc(e.target.value)} />
          <NeoInput id="fileUrl" label="URL ไฟล์ *" placeholder="https://..." value={fileUrl} onChange={e => setFileUrl(e.target.value)} required />
          <NeoInput id="fileName" label="ชื่อไฟล์ที่แสดง" placeholder="document.pdf" value={fileName} onChange={e => setFileName(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <NeoSelect id="fileType" label="ประเภทไฟล์" options={FILE_TYPES} value={fileType} onChange={e => setFileType(e.target.value as FileType)} />
            <NeoSelect id="accessLevel" label="สิทธิ์การเข้าถึง" options={ACCESS_OPTIONS} value={accessLevel} onChange={e => setAccess(e.target.value as AccessLevel)} />
          </div>
          <div className="flex gap-3 pt-2">
            <NeoButton type="submit" variant="primary" loading={saving}>บันทึก</NeoButton>
            <NeoButton type="button" variant="ghost" onClick={() => router.push('/admin/downloads')}>ยกเลิก</NeoButton>
          </div>
        </NeoCard>
      </form>
    </div>
  )
}
