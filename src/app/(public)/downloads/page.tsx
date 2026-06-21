'use client'
import { useEffect, useState } from 'react'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoBadge } from '@/components/neo/NeoBadge'
import { NeoButton } from '@/components/neo/NeoButton'
import { getDownloadsList } from '@/lib/firebase/services/downloads'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { Download } from '@/types'

const FILE_ICON: Record<string, string> = { pdf: '📄', docx: '📝', xlsx: '📊', pptx: '📑', zip: '🗜️' }
const ACCESS_LABEL: Record<string, string> = { guest: 'ทุกคน', member: 'สมาชิก', vip: 'VIP' }
const ACCESS_VARIANT: Record<string, 'default' | 'info' | 'vip'> = { guest: 'default', member: 'info', vip: 'vip' }

const CATEGORIES = ['ทั้งหมด', 'เอกสารวิชาการ', 'แบบฟอร์ม', 'สื่อการสอน', 'วิจัย', 'อื่นๆ']

export default function DownloadsPage() {
  const [items, setItems]         = useState<Download[]>([])
  const [filtered, setFiltered]   = useState<Download[]>([])
  const [category, setCategory]   = useState('ทั้งหมด')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    withFirestoreTimeout(getDownloadsList({ maxItems: 50 }))
      .then(data => { setItems(data); setFiltered(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setFiltered(category === 'ทั้งหมด' ? items : items.filter(i => i.category === category))
  }, [category, items])

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">⬇ ดาวน์โหลด</h1>
        <p className="text-[var(--color-text-muted)] text-lg">เอกสาร สื่อการสอน แบบฟอร์ม และทรัพยากรสำหรับครู</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? 'gradient-primary text-white [box-shadow:var(--shadow-neo-sm)]'
                : 'bg-[var(--color-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] [box-shadow:var(--shadow-neo-sm)]'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => <div key={i} className="h-20 rounded-[var(--radius)] bg-[var(--color-card)] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-3">📁</p>
          <p>ยังไม่มีไฟล์ดาวน์โหลด — ผู้ดูแลระบบสามารถเพิ่มได้ที่ Admin Panel</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(item => (
            <NeoCard key={item.id} className="flex items-center gap-4" size="sm">
              <div className="text-3xl w-10 flex-shrink-0 text-center">{FILE_ICON[item.fileType] ?? '📁'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium truncate">{item.title}</p>
                  <NeoBadge variant={ACCESS_VARIANT[item.accessLevel] ?? 'default'}>
                    {ACCESS_LABEL[item.accessLevel] ?? item.accessLevel}
                  </NeoBadge>
                  {item.category && <NeoBadge variant="info">{item.category}</NeoBadge>}
                </div>
                {item.description && <p className="text-sm text-[var(--color-text-muted)] mt-0.5 line-clamp-1">{item.description}</p>}
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 uppercase font-mono">{item.fileType} · {item.downloadCount} ครั้ง</p>
              </div>
              <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <NeoButton variant="primary" size="sm">⬇ ดาวน์โหลด</NeoButton>
              </a>
            </NeoCard>
          ))}
        </div>
      )}
    </div>
  )
}
