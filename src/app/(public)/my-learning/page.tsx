'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoBadge } from '@/components/neo/NeoBadge'
import { NeoButton } from '@/components/neo/NeoButton'
import { getEnrollmentsByUser } from '@/lib/firebase/services/enrollments'
import { useAuthStore } from '@/stores/auth'
import type { CourseEnrollment } from '@/types'

const STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'info' | 'success' | 'vip' }> = {
  pending:   { label: 'รอชำระเงิน', variant: 'default' },
  active:    { label: 'กำลังเรียน', variant: 'info' },
  completed: { label: 'เรียนจบแล้ว', variant: 'success' },
  cancelled: { label: 'ยกเลิก', variant: 'vip' },
}

export default function MyLearningPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login?redirect=/my-learning'); return }
    if (!user) return
    getEnrollmentsByUser(user.uid)
      .then(setEnrollments)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, authLoading, router])

  if (authLoading || loading) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[var(--color-text-muted)]">กำลังโหลด…</div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">📚 การเรียนของฉัน</h1>
        <p className="text-[var(--color-text-muted)]">หลักสูตรที่คุณลงทะเบียนไว้</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎓</p>
          <p className="text-xl font-bold mb-2">ยังไม่ได้ลงทะเบียนหลักสูตรใด</p>
          <p className="text-[var(--color-text-muted)] mb-6">ค้นหาหลักสูตรที่น่าสนใจและเริ่มเรียนได้เลย</p>
          <Link href="/courses"><NeoButton variant="primary">ดูหลักสูตรทั้งหมด</NeoButton></Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {enrollments.map(e => {
            const badge = STATUS_BADGE[e.status] ?? STATUS_BADGE.active
            return (
              <NeoCard key={e.id} className="flex items-center gap-4" size="sm">
                <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  {e.courseCoverUrl
                    ? <img src={e.courseCoverUrl} alt={e.courseTitle} className="w-full h-full object-cover" />
                    : <span className="text-2xl">🎓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold truncate">{e.courseTitle}</p>
                    <NeoBadge variant={badge.variant}>{badge.label}</NeoBadge>
                  </div>
                  {e.status === 'active' && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[var(--color-bg)] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full gradient-primary" style={{ width: `${e.progress}%` }} />
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">{e.progress}%</span>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {e.status === 'pending' && e.paymentId && (
                    <Link href={`/payment/${e.paymentId}`}>
                      <NeoButton variant="primary" size="sm">ชำระเงิน</NeoButton>
                    </Link>
                  )}
                  {e.status === 'active' && (
                    <Link href={`/my-learning/${e.courseId}`}>
                      <NeoButton variant="primary" size="sm">เรียนต่อ →</NeoButton>
                    </Link>
                  )}
                  {e.status === 'completed' && e.certificateId && (
                    <Link href={`/certificates/${e.certificateId}`}>
                      <NeoButton variant="secondary" size="sm">🏆 ใบประกาศ</NeoButton>
                    </Link>
                  )}
                </div>
              </NeoCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
