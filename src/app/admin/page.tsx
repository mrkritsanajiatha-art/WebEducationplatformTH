import type { Metadata } from 'next'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoStat } from '@/components/neo/NeoStat'

export const metadata: Metadata = { title: 'Dashboard | Admin' }

const QUICK_LINKS = [
  { label: 'จัดการข่าวสาร', href: '/admin/news', icon: '📰', desc: 'สร้าง แก้ไข เผยแพร่ข่าวสาร' },
  { label: 'จัดการหลักสูตร', href: '/admin/courses', icon: '🎓', desc: 'เพิ่ม/แก้ไขหลักสูตรออนไลน์' },
  { label: 'VIP Members', href: '/admin/vip', icon: '👑', desc: 'ดูและจัดการสมาชิก VIP' },
  { label: 'ตั้งค่าเว็บไซต์', href: '/admin/settings', icon: '⚙️', desc: 'แก้ไขข้อมูลองค์กร ธีม โลโก้' },
  { label: 'การชำระเงิน', href: '/admin/payments', icon: '💰', desc: 'รายการสลิปและการอนุมัติ' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📈', desc: 'สถิติผู้เข้าชมและการใช้งาน' },
]

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">แผงควบคุม</h1>
        <p className="text-[var(--color-text-muted)]">ยินดีต้อนรับสู่ Education Super Platform Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <NeoStat label="สมาชิกทั้งหมด" value="5,000" icon="👥" />
        <NeoStat label="VIP Member" value="1,200" icon="👑" color="warning" />
        <NeoStat label="หลักสูตร" value="48" icon="🎓" color="success" />
        <NeoStat label="ผู้เรียนออนไลน์" value="3,800" icon="🖥️" color="accent" />
      </div>

      {/* Quick links */}
      <NeoCard hover={false} className="mb-8">
        <h2 className="font-bold text-lg mb-4">เมนูด่วน</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-bg)]
                hover:bg-[var(--color-primary)]/5 hover:-translate-y-0.5
                transition-all duration-200 group"
            >
              <span className="text-2xl mt-0.5">{link.icon}</span>
              <div>
                <p className="font-semibold text-sm group-hover:text-[var(--color-primary)] transition-colors">
                  {link.label}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{link.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </NeoCard>

      {/* System status */}
      <NeoCard hover={false}>
        <h2 className="font-bold text-lg mb-4">สถานะระบบ</h2>
        <div className="flex flex-col gap-3">
          {[
            { label: 'Firebase Firestore', ok: true },
            { label: 'Firebase Auth', ok: true },
            { label: 'Firebase Storage', ok: true },
            { label: 'Admin SDK (Service Account)', ok: false, note: 'ต้องตั้งค่า FIREBASE_ADMIN_PRIVATE_KEY' },
            { label: 'VIP Sync (Google Sheets)', ok: false, note: 'ต้องตั้งค่า Cloud Function' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
              <span className="text-sm">{item.label}</span>
              <div className="flex items-center gap-2">
                {item.note && <span className="text-xs text-[var(--color-text-muted)]">{item.note}</span>}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  item.ok
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.ok ? '● พร้อมใช้งาน' : '○ รอการตั้งค่า'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </NeoCard>
    </div>
  )
}
