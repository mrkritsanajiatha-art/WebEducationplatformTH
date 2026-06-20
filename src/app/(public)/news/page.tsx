import type { Metadata } from 'next'
import { NeoCard } from '@/components/neo/NeoCard'

export const metadata: Metadata = { title: '📰 ข่าวสาร' }

export default function NewsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
      <h1 className="text-4xl font-bold mb-3 text-center">📰 ข่าวสาร</h1>
      <p className="text-center text-[var(--color-text-muted)] text-lg mb-12">
        ข่าวสาร ประกาศ และกิจกรรมจากสมาพันธ์แพลตฟอร์มฯ
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <NeoCard key={i} className="flex flex-col gap-4">
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-4xl">📰</div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">20 มิถุนายน 2569</p>
              <h3 className="font-bold text-lg leading-tight mb-2">ชื่อข่าวสารตัวอย่าง {i}</h3>
              <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                รายละเอียดข่าวสารตัวอย่าง ระบบจะดึงข้อมูลจริงจาก Firestore ใน Phase 3
              </p>
            </div>
          </NeoCard>
        ))}
      </div>
      <p className="text-center text-[var(--color-text-muted)] text-sm mt-12 italic">
        * Phase 3 จะเชื่อมต่อ News CMS จริง
      </p>
    </div>
  )
}
