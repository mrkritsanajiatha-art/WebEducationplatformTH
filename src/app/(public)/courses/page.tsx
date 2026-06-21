'use client'
import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Bot, BarChart2, BookOpen, GraduationCap } from 'lucide-react'
import { CourseCard, type CourseCardData } from '@/components/course/CourseCard'
import { getCoursesList } from '@/lib/firebase/services/courses'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { Course } from '@/types'

const ACCENTS: [string, string][] = [
  ['#1E3A8A', '#2563EB'], ['#0C4A2E', '#059669'],
  ['#312E81', '#7C3AED'], ['#78350F', '#D97706'],
]
const ICONS = [Bot, BarChart2, BookOpen, GraduationCap]

const CATEGORIES = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'ai', label: 'AI & เทคโนโลยี' },
  { key: 'pa', label: 'พัฒนา PA & วิจัย' },
  { key: 'innovation', label: 'นวัตกรรมการสอน' },
  { key: 'free', label: 'คอร์สฟรี' },
]

function toCardData(c: Course, i: number): CourseCardData {
  const badge = c.accessLevel === 'vip' ? 'VIP' : c.price === 0 ? 'ฟรี' : undefined
  return {
    href: c.slug ? `/courses/${c.slug}` : '#',
    title: c.title,
    instructor: c.instructors[0]?.name,
    org: 'สมาพันธ์แพลตฟอร์มฯ',
    price: c.price,
    learners: c.enrollCount || undefined,
    durationHrs: c.durationMin ? Math.round(c.durationMin / 60) : undefined,
    level: c.accessLevel === 'vip' ? 'ขั้นสูง' : 'ทุกระดับ',
    badge,
    coverUrl: c.coverUrl || undefined,
    Icon: ICONS[i % ICONS.length],
    accent: ACCENTS[i % ACCENTS.length],
  }
}

export default function CoursesPage() {
  const [items, setItems] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')

  useEffect(() => {
    withFirestoreTimeout(getCoursesList({ status: 'published', maxItems: 24 }))
      .then(data => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return items.filter(c => {
      const matchCat =
        cat === 'all' ? true : cat === 'free' ? c.price === 0 : c.categoryId === cat
      const matchQ = !q.trim() || c.title.toLowerCase().includes(q.trim().toLowerCase())
      return matchCat && matchQ
    })
  }, [items, cat, q])

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
          หลักสูตรอบรมทั้งหมด
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          พัฒนาทักษะวิชาชีพด้าน AI · นวัตกรรม · งานวิจัย และการศึกษาดิจิทัล
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-7">
        <div className="flex items-center gap-2 rounded-[var(--radius)] px-4 py-2.5 mb-4 bg-[var(--color-card)]"
          style={{ border: 'var(--border-card)' }}>
          <Search size={17} style={{ color: 'var(--color-text-muted)' }} />
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="ค้นหาหลักสูตร เช่น AI, วิจัย, Canva..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--color-text)' }}
          />
          <SlidersHorizontal size={16} style={{ color: 'var(--color-text-muted)' }} />
        </div>
        <div className="flex gap-2 overflow-x-auto scroll-row">
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors"
              style={cat === c.key
                ? { background: 'var(--color-primary)', color: '#fff' }
                : { background: 'var(--color-card)', color: 'var(--color-text-muted)', border: 'var(--border-card)' }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
          พบ {filtered.length} หลักสูตร
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="rounded-[var(--radius)] bg-[var(--color-card)] animate-pulse"
              style={{ border: 'var(--border-card)', height: 280 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-[var(--radius)] bg-[var(--color-card)]" style={{ border: 'var(--border-card)' }}>
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#1A56DB,#0EA5E9)' }}>
            <GraduationCap size={26} className="text-white" strokeWidth={1.5} />
          </div>
          {items.length === 0 ? (
            <>
              <p className="font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-heading)' }}>หลักสูตรกำลังจะเปิดเร็วๆ นี้</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                ทีมงานสมาพันธ์ฯ กำลังจัดเตรียมหลักสูตรคุณภาพ<br />ติดตามได้เร็วๆ นี้
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-heading)' }}>ไม่พบหลักสูตรที่ตรงกัน</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>ลองเปลี่ยนหมวดหมู่หรือคำค้นหา</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((c, i) => <CourseCard key={c.id} data={toCardData(c, i)} />)}
        </div>
      )}
    </div>
  )
}
