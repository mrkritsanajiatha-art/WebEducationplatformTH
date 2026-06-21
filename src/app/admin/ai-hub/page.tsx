'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoButton } from '@/components/neo/NeoButton'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { getAiArticlesList, deleteAiArticle } from '@/lib/firebase/services/aiArticles'
import type { AiArticle } from '@/types'

const CATEGORY_LABEL: Record<string, string> = {
  gemini: 'Gemini', chatgpt: 'ChatGPT', notebooklm: 'NotebookLM', canva: 'Canva AI', other: 'อื่นๆ',
}

export default function AdminAiHubPage() {
  const [items, setItems] = useState<AiArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAiArticlesList().then(setItems).catch(() => setError('โหลดข้อมูลไม่สำเร็จ')).finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`ลบ "${title}" ใช่ไหม?`)) return
    await deleteAiArticle(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader title="🤖 AI Hub" createHref="/admin/ai-hub/new" />
      {error && <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">{error}</div>}

      <NeoCard hover={false} size="sm">
        {loading ? (
          <div className="flex justify-center py-12 text-[var(--color-text-muted)]">กำลังโหลด…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🤖</p>
            <p className="font-medium mb-1">ยังไม่มีบทความ AI Hub</p>
            <Link href="/admin/ai-hub/new">
              <NeoButton variant="primary" size="sm" className="mt-4">+ สร้างบทความ</NeoButton>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-2 px-3 font-semibold">หัวข้อ</th>
                  <th className="text-left py-2 px-3 font-semibold">หมวด</th>
                  <th className="text-left py-2 px-3 font-semibold">สถานะ</th>
                  <th className="text-right py-2 px-3 font-semibold">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-bg)]">
                    <td className="py-2.5 px-3">
                      <p className="font-medium line-clamp-1">{item.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">/{item.slug}</p>
                    </td>
                    <td className="py-2.5 px-3 text-[var(--color-text-muted)]">{CATEGORY_LABEL[item.category] ?? item.category}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={item.status} /></td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/ai-hub/${item.id}`}>
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
