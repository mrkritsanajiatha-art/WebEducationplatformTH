'use client'
import { use, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoButton } from '@/components/neo/NeoButton'
import { getPaymentById, updatePaymentSlip } from '@/lib/firebase/services/payments'
import { useAuthStore } from '@/stores/auth'
import type { Payment } from '@/types'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', 'payment-slips')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.secure_url as string
}

const BANK_INFO = {
  name: 'นายยุทธ อัครางกูร',
  bank: 'ธนาคารไทยพาณิชย์ (SCB)',
  account: '4-1016-8624-0',
  promptpay: '062-607-8601',
  qrUrl: 'https://i.postimg.cc/mgvSqRN6/unnamed.jpg',
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuthStore()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getPaymentById(id).then(setPayment).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async () => {
    if (!file || !payment) return
    setUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      await updatePaymentSlip(id, url)
      alert('ส่งหลักฐานการชำระเงินแล้ว รอการตรวจสอบจากเจ้าหน้าที่')
      router.push('/my-learning')
    } catch {
      alert('เกิดข้อผิดพลาดในการอัปโหลด กรุณาลองใหม่')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="max-w-lg mx-auto px-4 py-20 text-center text-[var(--color-text-muted)]">กำลังโหลด…</div>
  if (!payment) return <div className="max-w-lg mx-auto px-4 py-20 text-center">ไม่พบรายการชำระเงิน</div>

  if (payment.status === 'approved') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">✅</p>
        <h1 className="text-2xl font-bold mb-2">ชำระเงินสำเร็จแล้ว</h1>
        <p className="text-[var(--color-text-muted)] mb-6">คุณสามารถเข้าเรียนได้ทันที</p>
        <NeoButton variant="primary" onClick={() => router.push('/my-learning')}>ไปยังการเรียนของฉัน</NeoButton>
      </div>
    )
  }

  if (payment.status === 'verifying') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">⏳</p>
        <h1 className="text-2xl font-bold mb-2">กำลังตรวจสอบการชำระเงิน</h1>
        <p className="text-[var(--color-text-muted)] mb-6">เจ้าหน้าที่จะตรวจสอบและอนุมัติภายใน 1-2 วันทำการ</p>
        <NeoButton variant="secondary" onClick={() => router.push('/my-learning')}>กลับหน้าการเรียน</NeoButton>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">💳 ชำระเงิน</h1>
      <p className="text-[var(--color-text-muted)] mb-8">โอนเงินและแนบหลักฐานการชำระเงิน</p>

      {/* Order summary */}
      <NeoCard className="mb-6">
        <p className="text-sm text-[var(--color-text-muted)] mb-1">หลักสูตร</p>
        <p className="font-bold mb-3">{payment.courseTitle}</p>
        <div className="flex justify-between items-center pt-3 border-t border-[var(--color-border)]">
          <span className="text-[var(--color-text-muted)]">ยอดชำระ</span>
          <span className="text-2xl font-bold text-[var(--color-primary)]">฿{payment.amount.toLocaleString('th-TH')}</span>
        </div>
      </NeoCard>

      {/* Bank info */}
      <NeoCard className="mb-6">
        <p className="font-bold mb-4">ข้อมูลการโอนเงิน</p>
        <div className="flex gap-4">
          {/* QR Code */}
          <div className="flex-shrink-0">
            <img src={BANK_INFO.qrUrl} alt="QR Code พร้อมเพย์" className="w-32 h-32 rounded-xl border border-[var(--color-border)] object-contain bg-white" />
            <p className="text-xs text-center text-[var(--color-text-muted)] mt-1">สแกน QR Code</p>
          </div>
          {/* Account details */}
          <div className="flex-1 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">ธนาคาร</span>
              <span className="font-medium text-right">{BANK_INFO.bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">ชื่อบัญชี</span>
              <span className="font-medium text-right">{BANK_INFO.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-muted)]">เลขบัญชี</span>
              <span className="font-bold font-mono text-[var(--color-primary)]">{BANK_INFO.account}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">พร้อมเพย์</span>
              <span className="font-bold font-mono text-[var(--color-primary)]">{BANK_INFO.promptpay}</span>
            </div>
          </div>
        </div>
      </NeoCard>

      {/* Slip upload */}
      <NeoCard className="mb-6">
        <p className="font-bold mb-4">แนบหลักฐานการโอนเงิน</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        {preview ? (
          <div className="relative mb-4">
            <img src={preview} alt="สลิป" className="w-full max-h-64 object-contain rounded-xl border border-[var(--color-border)]" />
            <button onClick={() => { setPreview(null); setFile(null) }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-[var(--color-border)] rounded-xl py-10 flex flex-col items-center gap-2 hover:border-[var(--color-primary)] transition-colors">
            <span className="text-3xl">📸</span>
            <p className="text-sm text-[var(--color-text-muted)]">คลิกเพื่ออัปโหลดรูปสลิป</p>
          </button>
        )}

        <NeoButton variant="primary" fullWidth size="lg" onClick={handleSubmit} loading={uploading} disabled={!file}>
          ส่งหลักฐานการชำระเงิน
        </NeoButton>
      </NeoCard>
    </div>
  )
}
