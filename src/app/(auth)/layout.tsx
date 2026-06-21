import type { Metadata } from 'next'
import { Logo } from '@/components/shared/Logo'

export const metadata: Metadata = { title: 'เข้าสู่ระบบ' }

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'var(--color-bg)' }}>
      {/* Logo links to / internally */}
      <Logo size="md" showName orgName="สมาพันธ์แพลตฟอร์มฯ" className="mb-8" />

      {/* Card */}
      <div className="w-full max-w-md bg-[var(--color-card)] rounded-[var(--radius)]
        [box-shadow:var(--shadow-neo)] p-8">
        {children}
      </div>

      <p className="mt-6 text-sm text-[var(--color-text-muted)]">
        © 2569 สมาพันธ์แพลตฟอร์มการศึกษาและอาชีพแห่งประเทศไทย
      </p>
    </div>
  )
}
