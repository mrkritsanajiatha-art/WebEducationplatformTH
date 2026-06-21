'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { NeoButton } from '@/components/neo/NeoButton'
import { NeoBadge } from '@/components/neo/NeoBadge'
import { getNewsBySlug } from '@/lib/firebase/services/news'
import type { News } from '@/types'

function formatThaiDate(ts: { toDate?: () => Date } | null | undefined) {
  if (!ts?.toDate) return ''
  return ts.toDate().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getNewsBySlug(slug)
      .then(data => { if (data) setNews(data); else setNotFound(true) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center text-[var(--color-text-muted)]">กำลังโหลด…</div>
  )

  if (notFound || !news) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-4xl mb-4">📰</p>
      <h1 className="text-2xl font-bold mb-2">ไม่พบข่าวสาร</h1>
      <p className="text-[var(--color-text-muted)] mb-6">ข่าวที่คุณค้นหาอาจถูกลบหรือยังไม่เผยแพร่</p>
      <Link href="/news"><NeoButton variant="primary">กลับไปหน้าข่าวสาร</NeoButton></Link>
    </div>
  )

  return (
    <article className="max-w-3xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {news.category && <NeoBadge variant="info">{news.category}</NeoBadge>}
          {news.pinned && <NeoBadge variant="vip">ปักหมุด</NeoBadge>}
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-3">{news.title}</h1>
        <p className="text-[var(--color-text-muted)] text-sm">
          {formatThaiDate(news.publishAt ?? news.createdAt)}
          {news.author?.name && ` · ${news.author.name}`}
        </p>
      </div>

      {news.coverUrl && (
        <img src={news.coverUrl} alt={news.title} className="w-full aspect-video object-cover rounded-2xl mb-8" />
      )}

      {news.excerpt && (
        <p className="text-lg text-[var(--color-text-muted)] border-l-4 border-[var(--color-primary)] pl-4 mb-8 italic">
          {news.excerpt}
        </p>
      )}

      <div className="prose prose-lg max-w-none text-[var(--color-text)] whitespace-pre-wrap leading-relaxed">
        {news.content}
      </div>

      <div className="mt-10 pt-6 border-t border-[var(--color-border)]">
        <Link href="/news"><NeoButton variant="ghost">← กลับไปหน้าข่าวสาร</NeoButton></Link>
      </div>
    </article>
  )
}
