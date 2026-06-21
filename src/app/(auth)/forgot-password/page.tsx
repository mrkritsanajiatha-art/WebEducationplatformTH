'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoButton } from '@/components/neo/NeoButton'
import { useAuthStore } from '@/stores/auth'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuthStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      if (code === 'auth/user-not-found') {
        setError('ไม่พบบัญชีที่ใช้อีเมลนี้')
      } else {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={56} className="text-[var(--color-success)]" />
        </div>
        <h1 className="text-2xl font-bold mb-3">ส่งอีเมลแล้ว!</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">
          ตรวจสอบอีเมล <strong>{email}</strong> เพื่อรีเซ็ตรหัสผ่าน
          (อาจใช้เวลาสักครู่ หรืออยู่ในโฟลเดอร์สแปม)
        </p>
        <Link href="/login">
          <NeoButton variant="primary" fullWidth>
            <ArrowLeft size={16} />
            กลับไปหน้าเข้าสู่ระบบ
          </NeoButton>
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-2">ลืมรหัสผ่าน?</h1>
      <p className="text-center text-[var(--color-text-muted)] text-sm mb-8">
        กรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <NeoInput
          id="email"
          type="email"
          label="อีเมล"
          placeholder="your@email.com"
          icon={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <NeoButton type="submit" variant="primary" fullWidth loading={loading} size="lg">
          ส่งลิงก์รีเซ็ตรหัสผ่าน
        </NeoButton>
      </form>

      <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
        <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline flex items-center justify-center gap-1">
          <ArrowLeft size={14} />
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </p>
    </>
  )
}
