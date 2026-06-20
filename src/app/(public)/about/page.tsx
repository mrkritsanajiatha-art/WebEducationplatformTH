import type { Metadata } from 'next'
import { NeoCard } from '@/components/neo/NeoCard'
import { defaultSiteConfig } from '@/config/site'

export const metadata: Metadata = { title: 'เกี่ยวกับองค์กร' }

export default function AboutPage() {
  const s = defaultSiteConfig
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">🏢 เกี่ยวกับองค์กร</h1>
        <p className="text-[var(--color-text-muted)] text-lg">{s.orgNameEn}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <NeoCard hover={false}>
          <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">วิสัยทัศน์ (Vision)</h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            เป็นศูนย์กลางการพัฒนาวิชาชีพครูและบุคลากรทางการศึกษาระดับประเทศ
            ด้วยการประยุกต์ใช้เทคโนโลยี AI นวัตกรรม และแพลตฟอร์มดิจิทัลขั้นสูง
          </p>
        </NeoCard>
        <NeoCard hover={false}>
          <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">พันธกิจ (Mission)</h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            พัฒนาครูและบุคลากรการศึกษาด้วยหลักสูตรที่ทันสมัย
            สร้างชุมชนแห่งการเรียนรู้และแลกเปลี่ยนประสบการณ์อย่างยั่งยืน
          </p>
        </NeoCard>
      </div>

      <NeoCard hover={false} className="mb-8">
        <h2 className="text-xl font-bold mb-6">ข้อมูลติดต่อ</h2>
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold mb-1">ที่อยู่</p>
            <address className="not-italic text-[var(--color-text-muted)] leading-relaxed">
              {s.address.street}<br />
              {s.address.subdistrict}<br />
              {s.address.district}<br />
              {s.address.province} {s.address.postalCode}
            </address>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-semibold mb-1">LINE OA</p>
              <a href={s.lineUrl} target="_blank" rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline">
                {s.lineOaName} ({s.lineId})
              </a>
            </div>
          </div>
        </div>
      </NeoCard>
    </div>
  )
}
