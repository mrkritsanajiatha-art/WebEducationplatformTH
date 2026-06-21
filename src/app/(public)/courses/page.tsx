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

const PLACEHOLDER: Course[] = [
  { id: '1', title: 'พัฒนา PA ด้วย AI ยุคใหม่ สำหรับครูไทย', slug: '', summary: '', description: '', categoryId: 'pa', coverUrl: '', gallery: [], instructors: [{ name: 'อ.ดร.สมหวัง วิทยา', title: '', photoUrl: '', bio: '' }], price: 0, accessLevel: 'guest', startDate: null, endDate: null, zoomUrl: '', youtubeUrl: '', enrollmentOpen: true, capacity: 0, enrollCount: 3820, lessonCount: 12, durationMin: 360, status: 'published', tags: [], createdAt: null as never, updatedAt: null as never },
  { id: '2', title: 'NotebookLM เพื่องานวิจัยในชั้นเรียน', slug: '', summary: '', description: '', categoryId: 'pa', coverUrl: '', gallery: [], instructors: [{ name: 'รศ.ดร.วิรัช ปัญญา', title: '', photoUrl: '', bio: '' }], price: 290, accessLevel: 'member', startDate: null, endDate: null, zoomUrl: '', youtubeUrl: '', enrollmentOpen: true, capacity: 0, enrollCount: 1250, lessonCount: 8, durationMin: 240, status: 'published', tags: [], createdAt: null as never, updatedAt: null as never },
  { id: '3', title: 'Canva AI สำหรับครูยุคดิจิทัล สร้างสื่อสวยใน 10 นาที', slug: '', summary: '', description: '', categoryId: 'innovation', coverUrl: '', gallery: [], instructors: [{ name: 'อ.ชลิดา ออกแบบ', title: '', photoUrl: '', bio: '' }], price: 390, accessLevel: 'member', startDate: null, endDate: null, zoomUrl: '', youtubeUrl: '', enrollmentOpen: true, capacity: 0, enrollCount: 2100, lessonCount: 10, durationMin: 300, status: 'published', tags: [], createdAt: null as never, updatedAt: null as never },
  { id: '4', title: 'Prompt Engineering สำหรับครู เขียนคำสั่ง AI ให้ปัง', slug: '', summary: '', description: '', categoryId: 'ai', coverUrl: '', gallery: [], instructors: [{ name: 'อ.รัตนา เทคโน', title: '', photoUrl: '', bio: '' }], price: 490, accessLevel: 'vip', startDate: null, endDate: null, zoomUrl: '', youtubeUrl: '', enrollmentOpen: true, capacity: 0, enrollCount: 980, lessonCount: 14, durationMin: 420, status: 'published', tags: [], createdAt: null as never, updatedAt: null as never },
  { id: '5', title: 'วิจัยในชั้นเรียน 5 บท ทำได้จริงใน 1 เทอม', slug: '', summary: '', description: '', categoryId: 'pa', coverUrl: '', gallery: [], instructors: [{ name: 'ผศ.ดร.วิรัช ปัญญา', title: '', photoUrl: '', bio: '' }], price: 290, accessLevel: 'member', startDate: null, endDate: null, zoomUrl: '', youtubeUrl: '', enrollmentOpen: true, capacity: 0, enrollCount: 1680, lessonCount: 9, durationMin: 270, status: 'published', tags: [], createdAt: null as never, updatedAt: null as never },
  { id: '6', title: 'ChatGPT สร้างแผนการสอน Active Learning', slug: '', summary: '', description: '', categoryId: 'ai', coverUrl: '', gallery: [], instructors: [{ name: 'อ.ดร.สมหวัง วิทยา', title: '', photoUrl: '', bio: '' }], price: 0, accessLevel: 'guest', startDate: null, endDate: null, zoomUrl: '', youtubeUrl: '', enrollmentOpen: true, capacity: 0, enrollCount: 4200, lessonCount: 11, durationMin: 330, status: 'published', tags: [], createdAt: null as never, updatedAt: null as never },
]

/* Deterministic pseudo-rating from id so cards look populated without real data */
function seededRating(id: string) {
  let n = 0
  for (const ch of id) n = (n + ch.charCodeAt(0)) % 100
  return 4.3 + (n % 7) / 10 // 4.3–4.9
}

function toCardData(c: Course, i: number): CourseCardData {
  const badge = c.accessLevel === 'vip' ? 'VIP' : c.price === 0 ? 'ฟรี' : i < 2 ? 'ฮิต' : undefined
  return {
    href: c.slug ? `/courses/${c.slug}` : '#',
    title: c.title,
    instructor: c.instructors[0]?.name,
    org: 'สมาพันธ์แพลตฟอร์มฯ',
    price: c.price,
    rating: seededRating(c.id),
    reviews: c.enrollCount ? Math.round(c.enrollCount * 0.18) : undefined,
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
      .then(data => setItems(data.length ? data : PLACEHOLDER))
      .catch(() => setItems(PLACEHOLDER))
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
      {!loading && (
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
        <div className="text-center py-16 rounded-[var(--radius)] bg-[var(--color-card)]" style={{ border: 'var(--border-card)' }}>
          <p className="font-semibold mb-1">ไม่พบหลักสูตรที่ตรงกัน</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>ลองเปลี่ยนหมวดหมู่หรือคำค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((c, i) => <CourseCard key={c.id} data={toCardData(c, i)} />)}
        </div>
      )}
    </div>
  )
}
