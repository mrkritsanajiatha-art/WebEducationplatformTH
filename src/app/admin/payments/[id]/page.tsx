'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { NeoButton } from '@/components/neo/NeoButton'
import { NeoCard } from '@/components/neo/NeoCard'
import { getPaymentById, updatePaymentStatus } from '@/lib/firebase/services/payments'
import { getEnrollmentByUserAndCourse, updateEnrollmentStatus } from '@/lib/firebase/services/enrollments'
import { issueCertificate } from '@/lib/firebase/services/certificates'
import { useAuthStore } from '@/stores/auth'
import type { Payment } from '@/types'

const STATUS_LABEL: Record<string, string> = {
  pending: 'รอชำระเงิน', verifying: 'รอตรวจสอบ', approved: 'อนุมัติแล้ว', rejected: 'ปฏิเสธ',
}
const STATUS_COLOR: Record<string, string> = {
  pending: 'text-yellow-600', verifying: 'text-blue-600', approved: 'text-green-600', rejected: 'text-red-600',
}

function formatDate(ts: { toDate?: () => Date } | null | undefined) {
  if (!ts?.toDate) return '-'
  return ts.toDate().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminPaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuthStore()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    getPaymentById(id).then(setPayment).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const handleApprove = async () => {
    if (!payment || !user) return
    setActionLoading(true)
    try {
      await updatePaymentStatus(id, 'approved', { verifiedBy: user.uid, verifiedAt: null })
      const enrollment = await getEnrollmentByUserAndCourse(payment.userId, payment.courseId)
      if (enrollment) {
        await updateEnrollmentStatus(enrollment.id, 'active')
      }
      alert('อนุมัติการชำระเงินแล้ว')
      router.push('/admin/payments')
    } catch (e) {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!payment) return
    if (!confirm('ยืนยันการปฏิเสธการชำระเงิน?')) return
    setActionLoading(true)
    try {
      await updatePaymentStatus(id, 'rejected')
      const enrollment = await getEnrollmentByUserAndCourse(payment.userId, payment.courseId)
      if (enrollment) await updateEnrollmentStatus(enrollment.id, 'cancelled')
      router.push('/admin/payments')
    } catch (e) {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setActionLoading(false)
    }
  }

  const handleIssueCert = async () => {
    if (!payment || !user) return
    setActionLoading(true)
    try {
      const certId = await issueCertificate({
        userId: payment.userId,
        userName: payment.userName,
        userEmail: payment.userEmail,
        courseId: payment.courseId,
        courseTitle: payment.courseTitle,
        templateId: '',
      })
      const enrollment = await getEnrollmentByUserAndCourse(payment.userId, payment.courseId)
      if (enrollment) {
        await updateEnrollmentStatus(enrollment.id, 'completed', { certificateId: certId, completedAt: null })
      }
      alert(`ออกใบประกาศสำเร็จ ID: ${certId}`)
    } catch (e) {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="py-20 text-center text-[var(--color-text-muted)]">กำลังโหลด…</div>
  if (!payment) return <div className="py-20 text-center text-[var(--color-text-muted)]">ไม่พบรายการ</div>

  return (
    <div className="max-w-2xl">
      <AdminPageHeader title="รายละเอียดการชำระเงิน" backHref="/admin/payments" backLabel="← กลับ" />

      <NeoCard className="mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-[var(--color-text-muted)]">สถานะ</p>
            <p className={`font-bold text-base ${STATUS_COLOR[payment.status]}`}>{STATUS_LABEL[payment.status]}</p></div>
          <div><p className="text-[var(--color-text-muted)]">จำนวนเงิน</p>
            <p className="font-bold text-base text-[var(--color-primary)]">฿{payment.amount.toLocaleString('th-TH')}</p></div>
          <div><p className="text-[var(--color-text-muted)]">ผู้ชำระ</p>
            <p className="font-medium">{payment.userName || '-'}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{payment.userEmail}</p></div>
          <div><p className="text-[var(--color-text-muted)]">หลักสูตร</p>
            <p className="font-medium">{payment.courseTitle}</p></div>
          <div><p className="text-[var(--color-text-muted)]">วันที่สมัคร</p>
            <p>{formatDate(payment.createdAt)}</p></div>
          <div><p className="text-[var(--color-text-muted)]">วิธีชำระ</p>
            <p>{payment.method === 'bank_transfer' ? 'โอนเงิน' : payment.method === 'promptpay' ? 'พร้อมเพย์' : 'ฟรี'}</p></div>
        </div>
      </NeoCard>

      {payment.slipUrl && (
        <NeoCard className="mb-6">
          <p className="font-medium mb-3">หลักฐานการชำระเงิน</p>
          <img src={payment.slipUrl} alt="สลิปโอนเงิน" className="max-w-sm rounded-xl border border-[var(--color-border)]" />
        </NeoCard>
      )}

      {payment.status === 'verifying' && (
        <div className="flex gap-3">
          <NeoButton variant="primary" onClick={handleApprove} loading={actionLoading}>✓ อนุมัติ</NeoButton>
          <NeoButton variant="danger" onClick={handleReject} loading={actionLoading}>✕ ปฏิเสธ</NeoButton>
        </div>
      )}
      {payment.status === 'approved' && (
        <NeoButton variant="secondary" onClick={handleIssueCert} loading={actionLoading}>🎓 ออกใบประกาศ</NeoButton>
      )}
    </div>
  )
}
