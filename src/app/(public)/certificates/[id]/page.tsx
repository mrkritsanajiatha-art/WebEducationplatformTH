'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { NeoButton } from '@/components/neo/NeoButton'
import { getCertificateById } from '@/lib/firebase/services/certificates'
import type { Certificate } from '@/types'

function formatDate(ts: { toDate?: () => Date } | null | undefined) {
  if (!ts?.toDate) return ''
  return ts.toDate().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [cert, setCert] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCertificateById(id).then(setCert).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-[var(--color-text-muted)]">กำลังโหลด…</div>

  if (!cert) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-4xl mb-4">❌</p>
      <h1 className="text-2xl font-bold mb-2">ไม่พบใบประกาศ</h1>
      <p className="text-[var(--color-text-muted)] mb-6">ใบประกาศนี้ไม่มีอยู่ในระบบหรืออาจถูกยกเลิก</p>
      <Link href="/"><NeoButton variant="primary">กลับหน้าหลัก</NeoButton></Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Certificate card */}
      <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-blue-700 rounded-3xl p-1 mb-8 [box-shadow:var(--shadow-neo)]">
        <div className="bg-white rounded-[calc(var(--radius)*1.5)] p-10 text-center relative overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[var(--color-primary)] rounded-tl-2xl opacity-30" />
          <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[var(--color-primary)] rounded-tr-2xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[var(--color-primary)] rounded-bl-2xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[var(--color-primary)] rounded-br-2xl opacity-30" />

          <p className="text-5xl mb-4">🏆</p>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">ใบประกาศนียบัตร</p>
          <p className="text-gray-600 text-sm mb-6">สมาพันธ์แพลตฟอร์มการศึกษาและอาชีพแห่งประเทศไทย</p>

          <p className="text-gray-500 mb-2">มอบให้แก่</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{cert.userName}</h2>

          <p className="text-gray-500 mb-2">เพื่อแสดงว่าได้ผ่านการอบรม</p>
          <h3 className="text-xl font-bold text-[var(--color-primary)] mb-8 px-4">{cert.courseTitle}</h3>

          <p className="text-gray-400 text-sm">ออกให้ ณ วันที่ {formatDate(cert.issuedAt)}</p>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400">รหัสยืนยัน: <span className="font-mono">{cert.id}</span></p>
          </div>
        </div>
      </div>

      {/* Verification info */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <span>✓</span> ใบประกาศนี้ได้รับการยืนยันจากระบบ
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mb-6">
          ออกให้แก่ {cert.userEmail} · รหัส {cert.id}
        </p>
        <button onClick={() => window.print()}
          className="text-sm text-[var(--color-primary)] hover:underline">🖨️ พิมพ์ใบประกาศ</button>
      </div>
    </div>
  )
}
