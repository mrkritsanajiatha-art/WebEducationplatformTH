'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { getPaymentsList } from '@/lib/firebase/services/payments'
import type { Payment, PaymentStatus } from '@/types'

const STATUS_TABS: { label: string; value: PaymentStatus | 'all' }[] = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'รอชำระ', value: 'pending' },
  { label: 'รอตรวจสอบ', value: 'verifying' },
  { label: 'อนุมัติแล้ว', value: 'approved' },
  { label: 'ปฏิเสธ', value: 'rejected' },
]

function formatDate(ts: { toDate?: () => Date } | null | undefined) {
  if (!ts?.toDate) return '-'
  return ts.toDate().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function AdminPaymentsPage() {
  const [items, setItems] = useState<Payment[]>([])
  const [filtered, setFiltered] = useState<Payment[]>([])
  const [tab, setTab] = useState<PaymentStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPaymentsList({ maxItems: 100 })
      .then(data => { setItems(data); setFiltered(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setFiltered(tab === 'all' ? items : items.filter(i => i.status === tab))
  }, [tab, items])

  return (
    <div>
      <AdminPageHeader title="การชำระเงิน" />

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              tab === t.value
                ? 'gradient-primary text-white [box-shadow:var(--shadow-neo-sm)]'
                : 'bg-[var(--color-card)] text-[var(--color-text-muted)] [box-shadow:var(--shadow-neo-sm)]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-[var(--color-card)] rounded-[var(--radius)] animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">ไม่มีรายการ</div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius)] [box-shadow:var(--shadow-neo)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-card)] text-[var(--color-text-muted)]">
              <tr>
                <th className="text-left px-4 py-3">ผู้ชำระ</th>
                <th className="text-left px-4 py-3">หลักสูตร</th>
                <th className="text-right px-4 py-3">จำนวน</th>
                <th className="text-center px-4 py-3">สถานะ</th>
                <th className="text-left px-4 py-3">วันที่</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map(p => (
                <tr key={p.id} className="bg-[var(--color-bg)] hover:bg-[var(--color-card)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.userName || '-'}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{p.userEmail}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate">{p.courseTitle}</td>
                  <td className="px-4 py-3 text-right font-medium">฿{p.amount.toLocaleString('th-TH')}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={p.status === 'verifying' ? 'scheduled' : p.status === 'approved' ? 'published' : p.status === 'rejected' ? 'archived' : 'draft'} />
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] text-xs">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/payments/${p.id}`}
                      className="text-[var(--color-primary)] hover:underline text-xs font-medium">ดูรายละเอียด</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
