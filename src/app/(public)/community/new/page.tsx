'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { createPost } from '@/lib/firebase/services/communityPosts'
import type { CommunityCategory } from '@/types'

const CATEGORIES: { value: CommunityCategory; label: string }[] = [
  { value: 'ai', label: 'AI & Technology' },
  { value: 'canva', label: 'Canva' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'notebooklm', label: 'NotebookLM' },
  { value: 'research', label: 'งานวิจัย' },
  { value: 'innovation', label: 'นวัตกรรม' },
  { value: 'wpa', label: 'WPA' },
]

export default function NewPostPage() {
  const router = useRouter()
  const { user, role, loading } = useAuthStore()
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<CommunityCategory>('ai')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (content.trim().length < 10) { setError('กรุณาเขียนเนื้อหาอย่างน้อย 10 ตัวอักษร'); return }
    setSubmitting(true)
    setError('')
    try {
      await createPost({
        authorId: user.uid,
        author: { name: user.displayName || user.email?.split('@')[0] || 'ผู้ใช้', photoUrl: user.photoURL || '', role },
        category,
        content: content.trim(),
        media: [],
        status: 'published',
        pinned: false,
      })
      router.push('/community')
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/community" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 block">← กลับชุมชน</Link>
      <h1 className="text-2xl font-bold mb-6">เขียนโพสต์ใหม่</h1>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 border border-[var(--color-border)] space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">หมวดหมู่</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                type="button"
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">เนื้อหา</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="แชร์ความรู้ ประสบการณ์ หรือความคิดเห็น..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm resize-none focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{content.length} ตัวอักษร</p>
        </div>

        {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Link href="/community" className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-center hover:bg-[var(--color-bg)] transition-colors">
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={submitting || content.trim().length < 10}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {submitting ? 'กำลังโพสต์...' : 'โพสต์'}
          </button>
        </div>
      </form>
    </main>
  )
}
