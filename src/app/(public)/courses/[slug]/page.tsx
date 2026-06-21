'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NeoButton } from '@/components/neo/NeoButton'
import { NeoBadge } from '@/components/neo/NeoBadge'
import { getCourseBySlug } from '@/lib/firebase/services/courses'
import { getEnrollmentByUserAndCourse, createEnrollment } from '@/lib/firebase/services/enrollments'
import { createPayment } from '@/lib/firebase/services/payments'
import { useAuthStore } from '@/stores/auth'
import type { Course, CourseEnrollment } from '@/types'

const ACCESS_LABEL: Record<string, string> = { guest: 'ฟรี', member: 'สมาชิก', vip: 'VIP เท่านั้น' }

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrollLoading, setEnrollLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getCourseBySlug(slug)
      .then(data => { if (data) setCourse(data); else setNotFound(true) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!user || !course) return
    getEnrollmentByUserAndCourse(user.uid, course.id)
      .then(setEnrollment)
      .catch(() => {})
  }, [user, course])

  const handleEnroll = async () => {
    if (!course) return
    if (!user) { router.push(`/login?redirect=/courses/${slug}`); return }
    setEnrollLoading(true)
    try {
      if (course.price === 0) {
        await createEnrollment({
          userId: user.uid, courseId: course.id,
          courseTitle: course.title, courseCoverUrl: course.coverUrl, courseSlug: course.slug,
          status: 'active', paymentId: null, progress: 0,
          completedLessons: [], completedAt: null, certificateId: null,
        })
        router.push('/my-learning')
      } else {
        const paymentId = await createPayment({
          userId: user.uid, userEmail: user.email ?? '',
          userName: user.displayName ?? '', courseId: course.id,
          courseTitle: course.title, amount: course.price,
          method: 'bank_transfer', status: 'pending',
          slipUrl: null, note: '', verifiedBy: null, verifiedAt: null,
        })
        await createEnrollment({
          userId: user.uid, courseId: course.id,
          courseTitle: course.title, courseCoverUrl: course.coverUrl, courseSlug: course.slug,
          status: 'pending', paymentId, progress: 0,
          completedLessons: [], completedAt: null, certificateId: null,
        })
        router.push(`/payment/${paymentId}`)
      }
    } catch (e) {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setEnrollLoading(false)
    }
  }

  if (loading || authLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[var(--color-text-muted)]">กำลังโหลด…</div>
  )
  if (notFound || !course) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-4xl mb-4">🎓</p>
      <h1 className="text-2xl font-bold mb-2">ไม่พบหลักสูตร</h1>
      <Link href="/courses"><NeoButton variant="primary">กลับไปดูหลักสูตรทั้งหมด</NeoButton></Link>
    </div>
  )

  const EnrollButton = () => {
    if (enrollment?.status === 'active') return (
      <Link href={`/my-learning/${course.id}`} className="block">
        <NeoButton variant="primary" fullWidth size="lg">เรียนต่อ →</NeoButton>
      </Link>
    )
    if (enrollment?.status === 'pending' && enrollment.paymentId) return (
      <Link href={`/payment/${enrollment.paymentId}`} className="block">
        <NeoButton variant="primary" fullWidth size="lg">ชำระเงิน →</NeoButton>
      </Link>
    )
    if (enrollment?.status === 'completed') return (
      <Link href={`/certificates/${enrollment.certificateId}`} className="block">
        <NeoButton variant="secondary" fullWidth size="lg">🏆 ดูใบประกาศ</NeoButton>
      </Link>
    )
    if (!course.enrollmentOpen) return (
      <NeoButton variant="secondary" fullWidth disabled>ปิดรับสมัคร</NeoButton>
    )
    return (
      <NeoButton variant="primary" fullWidth size="lg" onClick={handleEnroll} loading={enrollLoading}>
        {course.price === 0 ? 'สมัครเรียนฟรี' : `สมัครเรียน ฿${course.price.toLocaleString('th-TH')}`}
      </NeoButton>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Link href="/courses"><NeoButton variant="ghost" size="sm" className="mb-6">← หลักสูตรทั้งหมด</NeoButton></Link>
          {course.coverUrl && (
            <img src={course.coverUrl} alt={course.title} className="w-full aspect-video object-cover rounded-2xl mb-6" />
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            <NeoBadge variant={course.accessLevel === 'vip' ? 'vip' : course.accessLevel === 'member' ? 'info' : 'default'}>
              {ACCESS_LABEL[course.accessLevel]}
            </NeoBadge>
            {course.enrollmentOpen && <NeoBadge variant="success">รับสมัครอยู่</NeoBadge>}
          </div>
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          {course.summary && <p className="text-lg text-[var(--color-text-muted)] mb-6">{course.summary}</p>}

          {course.instructors.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold mb-3">วิทยากร</h2>
              {course.instructors.map((ins, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  {ins.photoUrl && <img src={ins.photoUrl} alt={ins.name} className="w-10 h-10 rounded-full object-cover" />}
                  <div>
                    <p className="font-medium">{ins.name}</p>
                    {ins.title && <p className="text-sm text-[var(--color-text-muted)]">{ins.title}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {course.description && (
            <div>
              <h2 className="font-bold mb-3">รายละเอียดหลักสูตร</h2>
              <div className="text-[var(--color-text)] whitespace-pre-wrap leading-relaxed">{course.description}</div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[var(--color-card)] rounded-[var(--radius)] [box-shadow:var(--shadow-neo)] p-6 sticky top-20">
            <p className="text-3xl font-bold text-[var(--color-primary)] mb-4">
              {course.price === 0 ? 'ฟรี' : `฿${course.price.toLocaleString('th-TH')}`}
            </p>
            <EnrollButton />
            <div className="mt-5 flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
              {course.capacity > 0 && <p>จำนวนรับ: {course.capacity} คน</p>}
              {course.durationMin > 0 && <p>ระยะเวลา: {course.durationMin} นาที</p>}
              {course.lessonCount > 0 && <p>จำนวนบทเรียน: {course.lessonCount}</p>}
              <p>ผู้ลงทะเบียนแล้ว: {course.enrollCount} คน</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
