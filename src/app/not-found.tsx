import Link from 'next/link'
import { NeoButton } from '@/components/neo/NeoButton'
import { PublicPageLayout } from '@/components/layout/PublicPageLayout'

export default function NotFound() {
  return (
    <PublicPageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold mb-4">404 — ไม่พบหน้านี้</h1>
        <p className="text-[var(--color-text-muted)] text-lg mb-8 max-w-md">
          หน้าที่คุณกำลังหาอาจถูกย้าย ลบ หรือไม่เคยมีอยู่
        </p>
        <div className="flex gap-4">
          <Link href="/"><NeoButton variant="primary">กลับหน้าแรก</NeoButton></Link>
          <Link href="/courses"><NeoButton variant="secondary">ดูหลักสูตร</NeoButton></Link>
        </div>
      </div>
    </PublicPageLayout>
  )
}
