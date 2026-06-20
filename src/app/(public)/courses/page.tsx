import type { Metadata } from 'next'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoBadge } from '@/components/neo/NeoBadge'
import { NeoButton } from '@/components/neo/NeoButton'

export const metadata: Metadata = {
  title: '🎓 หลักสูตรอบรม',
  description: 'หลักสูตรอบรมพัฒนาวิชาชีพครูและบุคลากรการศึกษา',
}

const DUMMY_COURSES = [
  { title: 'การใช้ AI ในการจัดการเรียนการสอน', instructor: 'ดร.ชื่อวิทยากร', price: 1500, status: 'open' as const, date: 'เร็วๆ นี้', badge: 'member' as const },
  { title: 'NotebookLM เพื่องานวิจัยในชั้นเรียน',  instructor: 'รศ.ดร.ชื่อวิทยากร', price: 2000, status: 'open' as const, date: 'เร็วๆ นี้', badge: 'vip' as const },
  { title: 'Canva AI สำหรับครูยุคดิจิทัล',         instructor: 'อ.ชื่อวิทยากร', price: 0,    status: 'open' as const, date: 'เร็วๆ นี้', badge: 'default' as const },
]

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">🎓 หลักสูตรอบรม</h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          พัฒนาทักษะวิชาชีพด้าน AI นวัตกรรม และการศึกษาดิจิทัล
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_COURSES.map((course) => (
          <NeoCard key={course.title} className="flex flex-col gap-4">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center text-5xl">
              🎓
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <NeoBadge variant={course.badge === 'vip' ? 'vip' : course.badge === 'member' ? 'info' : 'default'}>
                  {course.badge === 'vip' ? 'VIP เท่านั้น' : course.badge === 'member' ? 'สมาชิก' : 'ฟรี'}
                </NeoBadge>
                <NeoBadge variant="success">รับสมัครอยู่</NeoBadge>
              </div>
              <h3 className="font-bold text-lg leading-tight mb-2">{course.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">วิทยากร: {course.instructor}</p>
              <p className="text-sm text-[var(--color-text-muted)]">วันที่: {course.date}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
              <span className="font-bold text-[var(--color-primary)] text-lg">
                {course.price === 0 ? 'ฟรี' : `฿${course.price.toLocaleString('th-TH')}`}
              </span>
              <NeoButton variant="primary" size="sm">สมัครเรียน</NeoButton>
            </div>
          </NeoCard>
        ))}
      </div>
      <p className="text-center text-[var(--color-text-muted)] text-sm mt-12 italic">
        * Phase 3 จะดึงหลักสูตรจาก Firestore จริง
      </p>
    </div>
  )
}
