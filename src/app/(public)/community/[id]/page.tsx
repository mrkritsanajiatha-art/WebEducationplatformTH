'use client'
import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { getPostById, toggleLike, checkLiked, deletePost } from '@/lib/firebase/services/communityPosts'
import { getCommentsByPost, addComment, deleteComment } from '@/lib/firebase/services/communityComments'
import type { CommunityPost, CommunityComment } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'
import { Timestamp } from 'firebase/firestore'

function timeAgo(ts: Timestamp | null) {
  if (!ts) return ''
  try { return formatDistanceToNow(ts.toDate(), { addSuffix: true, locale: th }) } catch { return '' }
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, role } = useAuthStore()
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPostById(id),
      getCommentsByPost(id),
    ]).then(([p, c]) => {
      setPost(p)
      setLikeCount(p?.likeCount ?? 0)
      setComments(c)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (user) checkLiked(id, user.uid).then(setLiked)
  }, [id, user])

  async function handleLike() {
    if (!user) { router.push('/login'); return }
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(prev => prev + (newLiked ? 1 : -1))
    await toggleLike(id, user.uid, liked)
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !commentText.trim()) return
    setSubmitting(true)
    try {
      const authorName = user.displayName || user.email?.split('@')[0] || 'ผู้ใช้'
      const newId = await addComment({
        postId: id,
        authorId: user.uid,
        author: { name: authorName, photoUrl: user.photoURL || '', role },
        content: commentText.trim(),
      })
      setComments(prev => [...prev, {
        id: newId, postId: id, authorId: user.uid,
        author: { name: authorName, photoUrl: user.photoURL || '', role },
        content: commentText.trim(),
        createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
      }])
      setCommentText('')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteComment(cId: string) {
    await deleteComment(cId, id)
    setComments(prev => prev.filter(c => c.id !== cId))
  }

  async function handleDeletePost() {
    if (!confirm('ลบโพสต์นี้?')) return
    await deletePost(id)
    router.push('/community')
  }

  const isOwner = user?.uid === post?.authorId
  const isStaff = ['staff', 'admin', 'superadmin'].includes(role)

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-10 text-center text-[var(--color-text-muted)]">กำลังโหลด...</div>
  if (!post) return <div className="max-w-2xl mx-auto px-4 py-10 text-center"><p className="text-[var(--color-text-muted)]">ไม่พบโพสต์</p><Link href="/community" className="text-[var(--color-primary)] text-sm mt-2 block">← กลับ</Link></div>

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/community" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 block">← กลับชุมชน</Link>

      <div className="glass rounded-2xl p-6 border border-[var(--color-border)] mb-6">
        <div className="flex items-center gap-3 mb-4">
          {post.author.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.author.photoUrl} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
              {post.author.name[0]}
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{timeAgo(post.createdAt)}</p>
          </div>
          {(isOwner || isStaff) && (
            <button onClick={handleDeletePost} className="text-xs text-[var(--color-error)] hover:underline">ลบ</button>
          )}
        </div>
        <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-line">{post.content}</p>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-red-500' : 'text-[var(--color-text-muted)] hover:text-red-400'}`}>
            {liked ? '❤️' : '🤍'} {likeCount}
          </button>
          <span className="text-sm text-[var(--color-text-muted)]">💬 {comments.length}</span>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-3 mb-6">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3">
            {c.author.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.author.photoUrl} alt={c.author.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {c.author.name[0]}
              </div>
            )}
            <div className="flex-1 bg-[var(--color-card)] rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold">{c.author.name}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{timeAgo(c.createdAt)}</span>
                {(user?.uid === c.authorId || isStaff) && (
                  <button onClick={() => handleDeleteComment(c.id)} className="ml-auto text-xs text-[var(--color-error)] hover:underline">ลบ</button>
                )}
              </div>
              <p className="text-sm whitespace-pre-line">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleComment} className="flex gap-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
            {(user.displayName || 'U')[0]}
          </div>
          <div className="flex-1 flex gap-2">
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="เขียนความคิดเห็น..."
              rows={2}
              className="flex-1 resize-none px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50 self-end"
            >
              ส่ง
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-center text-[var(--color-text-muted)]">
          <Link href="/login" className="text-[var(--color-primary)]">เข้าสู่ระบบ</Link> เพื่อแสดงความคิดเห็น
        </p>
      )}
    </main>
  )
}
