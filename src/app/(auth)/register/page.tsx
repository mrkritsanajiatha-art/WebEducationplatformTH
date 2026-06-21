'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, UserPlus } from 'lucide-react'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoButton } from '@/components/neo/NeoButton'
import { useAuthStore } from '@/stores/auth'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, signInWithGoogle } = useAuthStore()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const getErrorMessage = (code: string) => {
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น',
      'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
      'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
    }
    return map[code] ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, displayName)
      router.push('/')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(getErrorMessage(code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      router.push('/')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(getErrorMessage(code))
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-2">สมัครสมาชิก</h1>
      <p className="text-center text-[var(--color-text-muted)] text-sm mb-8">
        สมัครฟรี! เข้าถึงหลักสูตร AI Hub และ Community
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <NeoButton
        variant="secondary"
        fullWidth
        onClick={handleGoogle}
        loading={googleLoading}
        className="mb-4"
        type="button"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        สมัครด้วย Google
      </NeoButton>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border)]" />
        </div>
        <div className="relative flex justify-center text-xs text-[var(--color-text-muted)]">
          <span className="bg-[var(--color-card)] px-3">หรือ</span>
        </div>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <NeoInput
          id="displayName"
          type="text"
          label="ชื่อ-นามสกุล"
          placeholder="กรุณากรอกชื่อของคุณ"
          icon={<User size={16} />}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
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
        <NeoInput
          id="password"
          type="password"
          label="รหัสผ่าน"
          placeholder="อย่างน้อย 6 ตัวอักษร"
          icon={<Lock size={16} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <NeoInput
          id="confirm"
          type="password"
          label="ยืนยันรหัสผ่าน"
          placeholder="พิมพ์รหัสผ่านอีกครั้ง"
          icon={<Lock size={16} />}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <NeoButton type="submit" variant="primary" fullWidth loading={loading} size="lg">
          <UserPlus size={18} />
          สมัครสมาชิกฟรี
        </NeoButton>
      </form>

      <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
        การสมัครสมาชิกแสดงว่าคุณยอมรับ{' '}
        <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">นโยบายความเป็นส่วนตัว</Link>
      </p>

      <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
        มีบัญชีอยู่แล้ว?{' '}
        <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </>
  )
}
