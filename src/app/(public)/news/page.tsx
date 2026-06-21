'use client'
import { useEffect, useState } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoBadge } from '@/components/neo/NeoBadge'
import { getNewsList } from '@/lib/firebase/services/news'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { News } from '@/types'

function formatThaiDate(ts: { toDate?: () => Date } | null | undefined) {
  if (!ts?.toDate) return ''
  return ts.toDate().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

const PLACEHOLDER: News[] = [
  { id: '1', title: 'ข่าวสารตัวอย่าง — ระบบจะดึงข้อมูลจริงเมื่อเพิ่มข่าวในหลังบ้าน', slug: '', excerpt: 'รายละเอียดข่าวสาร', content: '', coverUrl: '', category: 'ประกาศ', tags: [], author: { uid: '', name: '', photoUrl: '' }, status: 'published', publishAt: null, viewCount: 0, pinned: false, createdAt: null as never, updatedAt: null as never },
]

export default function NewsPage() {
  const [items, setItems] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    withFirestoreTimeout(getNewsList({ status: 'published', maxItems: 20 }))
      .then(data => setItems(data.length ? data : PLACEHOLDER))
      .catch(() => setItems(PLACEHOLDER))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">📰 ข่าวสาร</h1>
        <p className="text-[var(--color-text-muted)] text-lg">ข่าวสาร ประกาศ และกิจกรรมจากสมาพันธ์แพลตฟอร์มฯ</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 rounded-[var(--radius)] bg-[var(--color-card)] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <Link key={item.id} href={item.slug ? `/news/${item.slug}` : '#'} className="block">
              <NeoCard className="h-full flex flex-col gap-4">
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                  {item.coverUrl
                    ? <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                    : <span className="text-4xl">📰</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {item.pinned && <NeoBadge variant="vip">ปักหมุด</NeoBadge>}
                    {item.category && <NeoBadge variant="info">{item.category}</NeoBadge>}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">{formatThaiDate(item.publishAt ?? item.createdAt)}</p>
                  <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{item.excerpt}</p>
                </div>
              </NeoCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
