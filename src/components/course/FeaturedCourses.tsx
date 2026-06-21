'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Bot, BarChart2, BookOpen, GraduationCap } from 'lucide-react'
import { CourseCard, type CourseCardData } from './CourseCard'
import { getCoursesList } from '@/lib/firebase/services/courses'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { Course } from '@/types'

const ACCENTS: [string, string][] = [
  ['#1E3A8A', '#2563EB'], ['#0C4A2E', '#059669'],
  ['#312E81', '#7C3AED'], ['#78350F', '#D97706'],
]
const ICONS = [Bot, BarChart2, BookOpen, GraduationCap]

function toCardData(c: Course, i: number): CourseCardData {
  const badge = c.accessLevel === 'vip' ? 'VIP' : c.price === 0 ? 'ฟรี' : undefined
  return {
    href: c.slug ? `/courses/${c.slug}` : '/courses',
    title: c.title,
    instructor: c.instructors?.[0]?.name,
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

/** Renders the "หลักสูตรแนะนำ" section only when real published courses exist. */
export function FeaturedCourses() {
  const [items, setItems] = useState<Course[] | null>(null)

  useEffect(() => {
    withFirestoreTimeout(getCoursesList({ status: 'published', maxItems: 8 }))
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  // Loading or no real courses → render nothing (no fake placeholders)
  if (!items || items.length === 0) return null

  const cards = items.map(toCardData)

  return (
    <section className="px-3 sm:px-4 lg:px-5 pb-5">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>หลักสูตรแนะนำ</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>เริ่มเรียนได้เลยวันนี้</p>
        </div>
        <Link href="/courses" className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
          ดูทั้งหมด <ChevronRight size={13} strokeWidth={2} />
        </Link>
      </div>

      {/* Mobile: scroll */}
      <div className="flex lg:hidden scroll-row">
        {cards.map((c, i) => (
          <div key={i} className="w-52"><CourseCard data={c} /></div>
        ))}
      </div>
      {/* Desktop: grid */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {cards.slice(0, 4).map((c, i) => <CourseCard key={i} data={c} />)}
      </div>
    </section>
  )
}
