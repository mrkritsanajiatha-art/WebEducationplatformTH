'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllPostsAdmin, updatePost, deletePost } from '@/lib/firebase/services/communityPosts'
import type { CommunityPost } from '@/types'
import { Timestamp } from 'firebase/firestore'

function fmt(ts: Timestamp) {
  try { return ts.toDate().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }) }
  catch { return '-' }
}

const STATUS_BADGE: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700',
  hidden: 'bg-amber-100 text-amber-700',
  removed: 'bg-red-100 text-red-700',
}

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAllPostsAdmin().then(setPosts).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function toggleStatus(post: CommunityPost) {
    const next = post.status === 'published' ? 'hidden' : 'published'
    await updatePost(post.id, { status: next })
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: next } : p))
  }

  async function handleDelete(id: string) {
    if (!confirm('ลบโพสต์นี้?')) return
    await deletePost(id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = posts.filter(p =>
    p.author.name.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">จัดการ Community</h1>
        <span className="text-sm text-[var(--color-text-muted)]">{posts.length} โพสต์</span>
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ค้นหาโพสต์..."
          className="w-full max-w-xs px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div className="glass rounded-2xl border border-[var(--color-border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">ไม่มีโพสต์</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map(post => (
              <div key={post.id} className="p-4 hover:bg-[var(--color-bg)] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{post.author.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_BADGE[post.status] ?? ''}`}>
                        {post.status}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-border)] px-1.5 py-0.5 rounded-full">{post.category}</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
                      <span>❤️ {post.likeCount}</span>
                      <span>💬 {post.commentCount}</span>
                      <span>{fmt(post.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/community/${post.id}`} target="_blank" className="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">
                      ดู
                    </Link>
                    <button onClick={() => toggleStatus(post)} className="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">
                      {post.status === 'published' ? 'ซ่อน' : 'เผยแพร่'}
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
