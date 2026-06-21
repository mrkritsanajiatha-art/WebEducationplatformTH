'use client'
import { use, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/firebase/services/pages'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { Page } from '@/types'

export default function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [page, setPage] = useState<Page | null | 'loading'>('loading')

  useEffect(() => {
    getPageBySlug(slug).then(p => setPage(p)).catch(() => setPage(null))
  }, [slug])

  if (page === 'loading') return (
    <div className="min-h-[400px] flex items-center justify-center text-[var(--color-text-muted)]">กำลังโหลด...</div>
  )
  if (!page) return notFound()

  const sorted = [...(page.blocks ?? [])].sort((a, b) => a.order - b.order)

  return (
    <main>
      {sorted.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
      {sorted.length === 0 && (
        <div className="min-h-[400px] flex items-center justify-center text-[var(--color-text-muted)]">
          <p>หน้านี้ยังไม่มีเนื้อหา</p>
        </div>
      )}
    </main>
  )
}
