'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoBadge } from '@/components/neo/NeoBadge'
import { NeoButton } from '@/components/neo/NeoButton'
import { getCoursesList } from '@/lib/firebase/services/courses'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { Course } from '@/types'

const ACCESS_BADGE: Record<string, { label: string; variant: 'vip' | 'info' | 'default' }> = {
  vip:    { label: 'VIP เท่านั้น', variant: 'vip' },
  member: { label: 'สมาชิก', variant: 'info' },
  guest:  { label: 'ฟรี', variant: 'default' },
}

const PLACEHOLDER: Course[] = [
  { id: '1', title: 'การใช้ AI ในการจัดการเรียนการสอน', slug: '', summary: 'เรียนรู้วิธีใช้ AI เพื่อพัฒนาการเรียนการสอน', description: '', categoryId: '', coverUrl: '', gallery: [], instructors: [{ name: 'ดร.ชื่อวิทยากร', title: '', photoUrl: '', bio: '' }], price: 1500, accessLevel: 'member', startDate: null, endDate: null, zoomUrl: '', youtubeUrl: '', enrollmentOpen: true, capacity: 0, enrollCount: 0, lessonCount: 0, durationMin: 0, status: 'published', tags: [], createdAt: null as never, updatedAt: null as never },
  { id: '2', title: 'NotebookLM เพื่องานวิจัยในชั้นเรียน', slug: '', summary: 'ใช้ NotebookLM วิเคราะห์เอกสารวิจัย', description: '', categoryId: '', coverUrl: '', gallery: [], instructors: [{ name: 'รศ.ดร.ชื่อวิทยากร', title: '', photoUrl: '', bio: '' }], price: 2000, accessLevel: 'vip', startDate: null, endDate: null, zoomUrl: '', youtubeUrl: '', enrollmentOpen: true, capacity: 0, enrollCount: 0, lessonCount: 0, durationMin: 0, status: 'published', tags: [], createdAt: null as never, updatedAt: null as never },
  { id: '3', title: 'Canva AI สำหรับครูยุคดิจิทัล', slug: '', summary: 'สร้างสื่อการสอนด้วย Canva AI', description: '', categoryId: '', coverUrl: '', gallery: [], instructors: [{ name: 'อ.ชื่อวิทยากร', title: '', photoUrl: '', bio: '' }], price: 0, accessLevel: 'guest', startDate: null, endDate: null, zoomUrl: '', youtubeUrl: '', enrollmentOpen: true, capacity: 0, enrollCount: 0, lessonCount: 0, durationMin: 0, status: 'published', tags: [], createdAt: null as never, updatedAt: null as never },
]

export default function CoursesPage() {
  const [items, setItems] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    withFirestoreTimeout(getCoursesList({ status: 'published', maxItems: 24 }))
      .then(data => setItems(data.length ? data : PLACEHOLDER))
      .catch(() => setItems(PLACEHOLDER))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">🎓 หลักสูตรอบรม</h1>
        <p className="text-[var(--color-text-muted)] text-lg">พัฒนาทักษะวิชาชีพด้าน AI นวัตกรรม และการศึกษาดิจิทัล</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-72 rounded-[var(--radius)] bg-[var(--color-card)] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const badge = ACCESS_BADGE[item.accessLevel]
            return (
              <Link key={item.id} href={item.slug ? `/courses/${item.slug}` : '#'} className="block">
                <NeoCard className="h-full flex flex-col gap-4">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl overflow-hidden flex items-center justify-center">
                    {item.coverUrl
                      ? <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                      : <span className="text-5xl">🎓</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <NeoBadge variant={badge.variant}>{badge.label}</NeoBadge>
                      {item.enrollmentOpen && <NeoBadge variant="success">รับสมัคร</NeoBadge>}
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{item.title}</h3>
                    {item.instructors[0] && (
                      <p className="text-sm text-[var(--color-text-muted)]">วิทยากร: {item.instructors[0].name}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                    <span className="font-bold text-[var(--color-primary)] text-lg">
                      {item.price === 0 ? 'ฟรี' : `฿${item.price.toLocaleString('th-TH')}`}
                    </span>
                    <NeoButton variant="primary" size="sm" type="button">สมัครเรียน</NeoButton>
                  </div>
                </NeoCard>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
