import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PublicPageLayout } from '@/components/layout/PublicPageLayout'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoButton } from '@/components/neo/NeoButton'
import { NeoStat } from '@/components/neo/NeoStat'
import { defaultSiteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'หน้าแรก',
  description: defaultSiteConfig.description,
}

const STATS = [
  { label: 'สมาชิกทั้งหมด',  value: 5000, icon: '👥', color: 'primary'   as const },
  { label: 'VIP Member',      value: 1200, icon: '👑', color: 'success'   as const },
  { label: 'หลักสูตร',        value: 48,   icon: '🎓', color: 'secondary' as const },
  { label: 'ผู้เรียนออนไลน์', value: 3800, icon: '📚', color: 'accent'    as const },
]

const FEATURES = [
  { icon: '🤖', title: 'AI Hub',            desc: 'รวมความรู้ AI สำหรับครู Gemini · ChatGPT · NotebookLM · Canva AI' },
  { icon: '🎓', title: 'หลักสูตรอบรม',     desc: 'พัฒนาทักษะวิชาชีพ งานวิจัย นวัตกรรมกับวิทยากรผู้เชี่ยวชาญ' },
  { icon: '📚', title: 'ห้องเรียนออนไลน์',  desc: 'เรียนที่ไหน เวลาไหนก็ได้ ผ่านวิดีโอ PDF เอกสาร ครบจบในที่เดียว' },
  { icon: '👑', title: 'VIP Member',        desc: 'สิทธิประโยชน์พิเศษ คอร์สพรีเมียม ทรัพยากรแบบ exclusive' },
  { icon: '👥', title: 'Community',          desc: 'แชร์ประสบการณ์ แลกเปลี่ยนเรียนรู้ในชุมชนครูทั่วประเทศ' },
  { icon: '📄', title: 'Prompt Hub',         desc: 'คลัง prompt AI สำหรับครู ค้นหา คัดลอก นำไปใช้ได้ทันที' },
]

export default function HomePage() {
  return (
    <PublicPageLayout>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-[var(--color-bg)] to-cyan-50 py-20 lg:py-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[var(--color-primary)] px-4 py-1.5 rounded-full text-sm font-medium border border-blue-100 mb-6">
              <span>🚀</span> Education Super Platform ระดับประเทศ
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--color-text)] leading-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              พัฒนาครู
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
                {' '}สู่อนาคต{' '}
              </span>
              ด้วย AI & นวัตกรรม
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-8">
              {defaultSiteConfig.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/courses"><NeoButton variant="primary" size="lg">เริ่มเรียนเลย</NeoButton></Link>
              <Link href="/vip"><NeoButton variant="secondary" size="lg">ค้นหา VIP Member</NeoButton></Link>
            </div>
            <a
              href={defaultSiteConfig.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-white [box-shadow:var(--shadow-neo-sm)] px-5 py-3 rounded-2xl hover:shadow-[var(--shadow-float)] transition-all"
            >
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-semibold text-sm text-[var(--color-text)]">{defaultSiteConfig.lineOaName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{defaultSiteConfig.lineId}</p>
              </div>
            </a>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full opacity-10 blur-xl" />
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                <Image
                  src={defaultSiteConfig.logoUrl}
                  alt={defaultSiteConfig.orgNameTh}
                  width={240}
                  height={240}
                  className="object-contain drop-shadow-2xl"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => <NeoStat key={s.label} {...s} />)}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>บริการของเรา</h2>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto">
            ครบครันทุกมิติการพัฒนาวิชาชีพ จาก AI ถึงนวัตกรรม จากหลักสูตรถึงชุมชนครู
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <NeoCard key={f.title} className="flex flex-col gap-4">
              <span className="text-4xl w-14 h-14 flex items-center justify-center bg-blue-50 rounded-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{f.desc}</p>
              </div>
            </NeoCard>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 pb-20">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-[var(--radius-lg)] p-10 lg:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              เริ่มต้นการเดินทางพัฒนาวิชาชีพ
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              สมัครสมาชิกฟรี เข้าถึงหลักสูตร AI Hub Community และอีกมากมาย
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <NeoButton variant="secondary" size="lg" className="!bg-white !text-[var(--color-primary)]">
                  สมัครสมาชิกฟรี
                </NeoButton>
              </Link>
              <Link href="/courses">
                <NeoButton variant="ghost" size="lg" className="!text-white border border-white/30">
                  ดูหลักสูตรทั้งหมด
                </NeoButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  )
}
