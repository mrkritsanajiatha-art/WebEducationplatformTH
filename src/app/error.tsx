'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <html lang="th">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-bg)]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold mb-3">เกิดข้อผิดพลาด</h1>
            <p className="text-[var(--color-text-muted)] mb-8 text-sm leading-relaxed">
              ขออภัยในความไม่สะดวก เกิดข้อผิดพลาดที่ไม่คาดคิด
              {error.digest && <span className="block mt-1 font-mono text-xs opacity-60">#{error.digest}</span>}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
              >
                ลองใหม่อีกครั้ง
              </button>
              <Link href="/" className="px-6 py-2.5 rounded-xl border border-[var(--color-border)] font-medium hover:bg-[var(--color-card)] transition-colors">
                กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
