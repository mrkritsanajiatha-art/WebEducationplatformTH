import type { Metadata } from 'next'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoButton } from '@/components/neo/NeoButton'
import { NeoBadge } from '@/components/neo/NeoBadge'

export const metadata: Metadata = {
  title: '👑 VIP Member',
  description: 'ค้นหาสมาชิก VIP สมาพันธ์แพลตฟอร์มการศึกษาและอาชีพแห่งประเทศไทย',
}

export default function VipPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">👑 ค้นหา VIP Member</h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          ตรวจสอบสถานะสมาชิก VIP สมาพันธ์แพลตฟอร์มการศึกษาและอาชีพแห่งประเทศไทย
        </p>
      </div>

      {/* Search Card */}
      <NeoCard hover={false} className="mb-8">
        <h2 className="font-bold text-lg mb-6">ค้นหาด้วย ชื่อ · นามสกุล · เลขสมาชิก</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <NeoInput
            className="flex-1"
            placeholder="พิมพ์ชื่อ นามสกุล หรือเลขสมาชิก…"
          />
          <NeoButton variant="primary" size="md">ค้นหา</NeoButton>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-3">
          * ระบบซิงค์ข้อมูลจากฐานข้อมูลกลางทุก 1 ชั่วโมง
        </p>
      </NeoCard>

      {/* Example result (Phase 2 จะต่อ Firestore จริง) */}
      <NeoCard hover={false} className="border-l-4 border-[var(--color-success)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-lg">ชื่อ – นามสกุล</h3>
              <NeoBadge variant="vip">✓ VIP Member by สมาพันธ์แพลตฟอร์มฯ</NeoBadge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-[var(--color-text-muted)]">
              <div><span className="font-medium">เลขสมาชิก:</span> VIPXXXXX</div>
              <div><span className="font-medium">จังหวัด:</span> —</div>
              <div><span className="font-medium">สาขา:</span> —</div>
              <div><span className="font-medium">หมดอายุ:</span> —</div>
            </div>
          </div>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
          * ตัวอย่าง — Phase 2 จะเชื่อมต่อฐานข้อมูลจริงจาก Google Sheets
        </p>
      </NeoCard>
    </div>
  )
}
