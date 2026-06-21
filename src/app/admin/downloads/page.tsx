'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoButton } from '@/components/neo/NeoButton'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getDownloadsList, deleteDownload } from '@/lib/firebase/services/downloads'
import type { Download } from '@/types'

const ACCESS_LABEL: Record<string, string> = { guest: 'ทุกคน', member: 'สมาชิก', vip: 'VIP' }
const FILE_ICON: Record<string, string> = { pdf: '📄', docx: '📝', xlsx: '📊', pptx: '📑', zip: '🗜️' }

export default function AdminDownloadsPage() {
  const [items, setItems] = useState<Download[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDownloadsList().then(setItems).catch(() => setError('โหลดข้อมูลไม่สำเร็จ')).finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`ลบ "${title}" ใช่ไหม?`)) return
    await deleteDownload(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader title="📥 ดาวน์โหลด" createHref="/admin/downloads/new" />

      {error && <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">{error}</div>}

      <NeoCard hover={false} size="sm">
        {loading ? (
          <div className="flex justify-center py-12 text-[var(--color-text-muted)]">กำลังโหลด…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📥</p>
            <p className="font-medium mb-1">ยังไม่มีไฟล์ดาวน์โหลด</p>
            <Link href="/admin/downloads/new">
              <NeoButton variant="primary" size="sm" className="mt-4">+ เพิ่มไฟล์</NeoButton>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-2 px-3 font-semibold">ชื่อไฟล์</th>
                  <th className="text-left py-2 px-3 font-semibold">หมวด</th>
                  <th className="text-left py-2 px-3 font-semibold">ประเภท</th>
                  <th className="text-left py-2 px-3 font-semibold">สิทธิ์</th>
                  <th className="text-right py-2 px-3 font-semibold">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-bg)]">
                    <td className="py-2.5 px-3">
                      <p className="font-medium line-clamp-1">{FILE_ICON[item.fileType] ?? '📁'} {item.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.fileName}</p>
                    </td>
                    <td className="py-2.5 px-3 text-[var(--color-text-muted)]">{item.category || '—'}</td>
                    <td className="py-2.5 px-3 uppercase text-xs font-mono">{item.fileType}</td>
                    <td className="py-2.5 px-3 text-[var(--color-text-muted)]">{ACCESS_LABEL[item.accessLevel] ?? item.accessLevel}</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/downloads/${item.id}`}>
                          <NeoButton variant="ghost" size="sm">แก้ไข</NeoButton>
                        </Link>
                        <NeoButton variant="danger" size="sm" onClick={() => handleDelete(item.id, item.title)}>ลบ</NeoButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </NeoCard>
    </div>
  )
}
