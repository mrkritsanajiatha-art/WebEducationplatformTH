'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { getPostsList } from '@/lib/firebase/services/communityPosts'
import type { CommunityPost, CommunityCategory } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'
import { Timestamp } from 'firebase/firestore'

const CATEGORIES: { value: CommunityCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'ai', label: 'AI & Tech' },
  { value: 'canva', label: 'Canva' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'notebooklm', label: 'NotebookLM' },
  { value: 'research', label: 'งานวิจัย' },
  { value: 'innovation', label: 'นวัตกรรม' },
  { value: 'wpa', label: 'WPA' },
]

function timeAgo(ts: Timestamp | null) {
  if (!ts) return ''
  try {
    return formatDistanceToNow(ts.toDate(), { addSuffix: true, locale: th })
  } catch {
    return ''
  }
}

function PostCard({ post }: { post: CommunityPost }) {
  const preview = post.content.length > 240 ? post.content.slice(0, 240) + '…' : post.content
  const catLabel = CATEGORIES.find(c => c.value === post.category)?.label ?? post.category
  return (
    <Link href={`/community/${post.id}`} className="block glass rounded-2xl p-5 hover:shadow-lg transition-all border border-[var(--color-border)] hover:border-[var(--color-primary)]/30">
      <div className="flex items-center gap-3 mb-3">
        {post.author.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.author.photoUrl} alt={post.author.name} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
            {post.author.name[0]}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold">{post.author.name}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{timeAgo(post.createdAt)}</p>
        </div>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium">
          {catLabel}
        </span>
      </div>
      <p className="text-sm text-[var(--color-text)] leading-relaxed whitespace-pre-line">{preview}</p>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--color-border)] text-[var(--color-text-muted)] text-xs">
        <span>❤️ {post.likeCount}</span>
        <span>💬 {post.commentCount}</span>
      </div>
    </Link>
  )
}

export default function CommunityPage() {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [category, setCategory] = useState<CommunityCategory | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPostsList({ category: category === 'all' ? undefined : category })
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">ชุมชน</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">แชร์ประสบการณ์ แลกเปลี่ยนความรู้</p>
        </div>
        {user && (
          <Link href="/community/new" className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
            ✏️ เขียนโพสต์
          </Link>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === c.value
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-2xl p-5 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-border)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[var(--color-border)] rounded w-32" />
                  <div className="h-2 bg-[var(--color-border)] rounded w-20" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[var(--color-border)] rounded" />
                <div className="h-3 bg-[var(--color-border)] rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-medium">ยังไม่มีโพสต์ในหมวดนี้</p>
          {user && <Link href="/community/new" className="text-sm text-[var(--color-primary)] mt-2 block">เป็นคนแรกที่แชร์ →</Link>}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </main>
  )
}
