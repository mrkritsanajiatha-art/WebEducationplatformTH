import type { Metadata } from 'next'
import { NeoCard } from '@/components/neo/NeoCard'
import { defaultSiteConfig } from '@/config/site'

export const metadata: Metadata = { title: 'ติดต่อเรา' }

export default function ContactPage() {
  const s = defaultSiteConfig
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">☎ ติดต่อเรา</h1>
        <p className="text-[var(--color-text-muted)] text-lg">เราพร้อมให้ความช่วยเหลือและตอบทุกคำถามของคุณ</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <NeoCard hover={false}>
          <h2 className="text-lg font-bold mb-6">ข้อมูลติดต่อ</h2>
          <div className="space-y-5 text-sm">
            <div className="flex gap-3">
              <span className="text-xl flex-shrink-0">📍</span>
              <div>
                <p className="font-medium">ที่อยู่</p>
                <address className="not-italic text-[var(--color-text-muted)] leading-relaxed mt-1">
                  {s.address.street}<br />{s.address.subdistrict}<br />
                  {s.address.district}<br />{s.address.province} {s.address.postalCode}
                </address>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl flex-shrink-0">💬</span>
              <div>
                <p className="font-medium">LINE OA</p>
                <a href={s.lineUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline mt-1 block">
                  {s.lineOaName}
                </a>
                <p className="text-[var(--color-text-muted)]">ID: {s.lineId}</p>
              </div>
            </div>
          </div>

          <a
            href={s.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center justify-center gap-2 bg-[#06C755] text-white rounded-2xl py-3 font-medium hover:bg-[#05b34c] transition-colors"
          >
            <span>💬</span> ติดต่อผ่าน LINE OA
          </a>
        </NeoCard>

        <NeoCard hover={false}>
          <h2 className="text-lg font-bold mb-6">แผนที่</h2>
          <div className="aspect-video bg-blue-50 rounded-xl flex items-center justify-center">
            <p className="text-[var(--color-text-muted)] text-sm text-center px-4">
              📍 {s.address.street}<br />
              {s.address.district} {s.address.province}
            </p>
          </div>
        </NeoCard>
      </div>
    </div>
  )
}
