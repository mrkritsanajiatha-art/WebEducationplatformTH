'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import {
  Search, X, Crown, CheckCircle2, Loader2, Download, ImageDown,
  ShieldCheck, BadgeCheck, Phone, MessageCircle,
} from 'lucide-react'
import type { VipSheetMember } from '@/app/api/vip-sheets/route'
import { verifyVipMember, getVerifiedIds, submitVipApplication } from '@/lib/firebase/services/vip'

function fuzzyMatch(member: VipSheetMember, query: string): boolean {
  if (!query) return false
  const q = query.toLowerCase().replace(/\s+/g, '')
  const full = `${member.prefix}${member.firstName}${member.lastName}`.toLowerCase().replace(/\s+/g, '')
  const fullSpaced = `${member.prefix} ${member.firstName} ${member.lastName}`.toLowerCase()
  return full.includes(q) || fullSpaced.includes(query.toLowerCase())
}

const SOURCE_GRADIENT: Record<string, [string, string]> = {
  'ฐาน 1': ['#1E3A8A', '#2563EB'],
  'ฐาน 2': ['#1E3A5A', '#0EA5E9'],
}

/* ── Canvas card generator ── */
async function generateCardImage(member: VipSheetMember, verified: boolean): Promise<string> {
  await document.fonts.ready
  const W = 1080, H = 600
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')!
  const [c1, c2] = SOURCE_GRADIENT[member.source] ?? ['#1E3A8A', '#2563EB']

  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, c1); bg.addColorStop(1, c2)
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

  ctx.save(); ctx.globalAlpha = 0.09; ctx.fillStyle = '#FFFFFF'
  ctx.beginPath(); ctx.arc(W - 60, -40, 230, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(W - 220, H + 60, 170, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(0, 82, W, 1)

  ctx.fillStyle = 'rgba(255,255,255,0.80)'; ctx.font = '400 22px Sarabun, sans-serif'
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
  ctx.fillText('สมาพันธ์แพลตฟอร์มการศึกษาและอาชีพแห่งประเทศไทย', 52, 42)

  ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.18)'
  rr(ctx, W - 228, 14, 176, 56, 28); ctx.fill()
  ctx.fillStyle = '#FDE68A'; ctx.font = 'bold 20px Arial, sans-serif'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('★  VIP MEMBER', W - 140, 42); ctx.restore()

  ctx.fillStyle = 'rgba(253,230,138,0.55)'; ctx.font = '26px Arial, sans-serif'
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
  ctx.fillText('★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★', 52, 140)

  /* Verified / unverified badge */
  ctx.save()
  if (verified) {
    ctx.fillStyle = 'rgba(74,222,128,0.22)'; rr(ctx, 52, 168, 230, 50, 25); ctx.fill()
    ctx.fillStyle = '#4ADE80'; ctx.font = 'bold 22px Sarabun, sans-serif'
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
    ctx.fillText('✓  ยืนยันตัวตนแล้ว', 82, 193)
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.16)'; rr(ctx, 52, 168, 200, 50, 25); ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '400 20px Sarabun, sans-serif'
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
    ctx.fillText('สมาชิก VIP', 82, 193)
  }
  ctx.restore()

  const fullName = [member.prefix, member.firstName, member.lastName].filter(Boolean).join(' ')
  let fs = 66; ctx.font = `bold ${fs}px Kanit, Sarabun, sans-serif`
  while (ctx.measureText(fullName).width > W - 280 && fs > 36) {
    fs -= 2; ctx.font = `bold ${fs}px Kanit, Sarabun, sans-serif`
  }
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
  ctx.fillText(fullName, 52, 348)

  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(52, 376, W - 104, 1)
  ctx.fillStyle = 'rgba(255,255,255,0.60)'; ctx.font = '400 22px Sarabun, sans-serif'
  ctx.textBaseline = 'middle'; ctx.fillText('รหัสสมาชิก VIP', 52, 416)
  ctx.fillStyle = '#93C5FD'; ctx.font = 'bold 38px "Courier New", monospace'
  ctx.fillText(member.memberId, 52, 472)

  ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.18)'
  rr(ctx, W - 192, 390, 140, 100, 16); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.font = 'bold 26px Sarabun, sans-serif'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(member.source, W - 122, 440); ctx.restore()

  ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = '#FFFFFF'
  for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc(52 + i * 60, H - 28, 20, 0, Math.PI * 2); ctx.fill() }
  ctx.restore()

  return canvas.toDataURL('image/png')
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath()
}

/* ═══════════════════════════════════════════════ */
export default function VipPage() {
  const [all, setAll]             = useState<VipSheetMember[]>([])
  const [loadState, setLoadState] = useState<'idle'|'loading'|'done'|'error'>('idle')
  const [query, setQuery]         = useState('')
  const [errors, setErrors]       = useState<string[]>([])
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(new Set())
  const [imgTarget, setImgTarget] = useState<VipSheetMember | null>(null)
  const [verifyTarget, setVerifyTarget] = useState<VipSheetMember | null>(null)

  useEffect(() => {
    setLoadState('loading')
    fetch('/api/vip-sheets')
      .then(r => r.json())
      .then(d => { setAll(d.members ?? []); setErrors(d.errors ?? []); setLoadState('done') })
      .catch(() => setLoadState('error'))
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return all.filter(m => fuzzyMatch(m, query.trim())).slice(0, 50)
  }, [all, query])

  /* Debounced batch check of verified status for current results */
  const idsKey = results.map(m => m.memberId).join('|')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    if (!idsKey) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      getVerifiedIds(idsKey.split('|'))
        .then(setVerifiedIds)
        .catch(() => {})
    }, 450)
    return () => clearTimeout(debounceRef.current)
  }, [idsKey])

  const markVerified = (memberId: string) =>
    setVerifiedIds(prev => new Set(prev).add(memberId.replace(/[/.#$[\]]/g, '_')))

  const isVerified = (memberId: string) => verifiedIds.has(memberId.replace(/[/.#$[\]]/g, '_'))

  const hasQuery = query.trim().length > 0

  return (
    <>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '1.5rem 1rem 6rem' }}>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
            style={{ boxShadow: 'var(--shadow-neo)', background: 'var(--color-bg)' }}>
            <Crown size={28} strokeWidth={1.5} style={{ color: '#D97706' }} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            ค้นหา &amp; ยืนยัน VIP Member
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            ตรวจสอบสถานะสมาชิก VIP สมาพันธ์แพลตฟอร์มการศึกษาและอาชีพแห่งประเทศไทย
          </p>
        </div>

        {/* Apply CTA */}
        <Link href="/vip/apply">
          <div className="rounded-2xl px-5 py-3.5 mb-5 flex items-center gap-3 active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg,#2563EB,#06B6D4)' }}>
            <Crown size={20} className="text-yellow-300 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-bold text-sm leading-tight">ยังไม่ได้เป็น VIP?</p>
              <p className="text-white/70 text-[11px]">สมัครสมาชิก VIP ตลอดชีพ เพียง 499 บาท</p>
            </div>
            <span className="text-white text-lg">→</span>
          </div>
        </Link>

        {/* Search box */}
        <div className="rounded-2xl p-4 mb-5"
          style={{ boxShadow: 'var(--shadow-neo-lg)', background: 'var(--color-bg)' }}>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
            พิมพ์ชื่อ หรือ นามสกุล (ไม่ต้องพิมพ์ให้ครบ)
          </label>
          <div className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ boxShadow: 'var(--shadow-neo-inset)', background: 'var(--color-bg)' }}>
            <Search size={17} strokeWidth={1.8} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <input
              type="text" autoFocus placeholder="เช่น สมชาย, วัง, นางสาว..."
              value={query} onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color: 'var(--color-text-muted)' }}><X size={16} /></button>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {loadState === 'loading' && <><Loader2 size={12} className="animate-spin" /> กำลังโหลดข้อมูล...</>}
            {loadState === 'done'    && <><CheckCircle2 size={12} style={{ color: 'var(--color-success)' }} /> โหลดแล้ว {all.length.toLocaleString()} รายชื่อ</>}
            {loadState === 'error'   && <span style={{ color: 'var(--color-error)' }}>❌ โหลดข้อมูลไม่ได้</span>}
            {errors.length > 0 && loadState === 'done' && <span style={{ color: 'var(--color-warning)' }}>⚠ {errors.join(' · ')}</span>}
          </div>
        </div>

        {/* Results */}
        {hasQuery && results.length > 0 && (
          <div>
            <p className="text-xs mb-3 px-1" style={{ color: 'var(--color-text-muted)' }}>
              พบ {results.length} รายการ{results.length === 50 ? ' (แสดง 50 แรก)' : ''}
            </p>
            <div className="flex flex-col gap-4">
              {results.map((m, i) => (
                <MemberCard
                  key={`${m.memberId}-${i}`}
                  member={m}
                  query={query}
                  verified={isVerified(m.memberId)}
                  onSaveImage={() => setImgTarget(m)}
                  onVerify={() => setVerifyTarget(m)}
                />
              ))}
            </div>
          </div>
        )}

        {hasQuery && results.length === 0 && loadState === 'done' && (
          <div className="rounded-2xl p-8 text-center"
            style={{ boxShadow: 'var(--shadow-neo-inset)', background: 'var(--color-bg)' }}>
            <Search size={36} strokeWidth={1} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} />
            <p className="font-semibold mb-1">ไม่พบรายชื่อที่ตรงกัน</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>ลองพิมพ์บางส่วนของชื่อหรือนามสกุล</p>
          </div>
        )}

        {!hasQuery && loadState !== 'loading' && (
          <div className="rounded-2xl p-8 text-center"
            style={{ boxShadow: 'var(--shadow-neo-inset)', background: 'var(--color-bg)' }}>
            <Crown size={40} strokeWidth={1} className="mx-auto mb-3" style={{ color: '#D97706', opacity: 0.5 }} />
            <p className="font-semibold mb-1">เริ่มพิมพ์เพื่อค้นหา</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              พิมพ์บางส่วนของชื่อ หรือนามสกุล<br />ระบบจะแสดงผลทันที
            </p>
          </div>
        )}
      </div>

      {imgTarget && (
        <CardModal member={imgTarget} verified={isVerified(imgTarget.memberId)} onClose={() => setImgTarget(null)} />
      )}
      {verifyTarget && (
        <VerifyModal
          member={verifyTarget}
          alreadyVerified={isVerified(verifyTarget.memberId)}
          onClose={() => setVerifyTarget(null)}
          onVerified={() => markVerified(verifyTarget.memberId)}
        />
      )}
    </>
  )
}

/* ── Membership card ── */
function MemberCard({ member, query, verified, onSaveImage, onVerify }: {
  member: VipSheetMember; query: string; verified: boolean
  onSaveImage: () => void; onVerify: () => void
}) {
  const [c1, c2] = SOURCE_GRADIENT[member.source] ?? ['#1E3A8A', '#2563EB']
  const gradient = `linear-gradient(135deg,${c1},${c2})`
  const initial  = member.firstName?.[0] ?? '?'

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ boxShadow: 'var(--shadow-neo-lg)', background: 'var(--color-bg)' }}>

      <div className="relative px-5 pt-5 pb-10" style={{ background: gradient }}>
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-6 translate-x-6" style={{ background: '#FFF' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Crown size={13} className="text-yellow-300" strokeWidth={2} />
            <span className="text-white text-[11px] font-bold uppercase tracking-widest">VIP Member</span>
          </div>
          {verified && (
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
              <ShieldCheck size={11} className="text-green-300" />
              <span className="text-white text-[10px] font-semibold">ยืนยันแล้ว</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-4 -mt-6 relative z-10">
        <div className="rounded-xl p-4 flex items-center gap-4"
          style={{ boxShadow: 'var(--shadow-neo)', background: 'var(--color-bg)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
            style={{ background: gradient, boxShadow: '0 4px 12px rgba(37,99,235,0.35)' }}>
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{member.prefix || 'สมาชิก'}</p>
            <p className="font-bold text-base leading-tight">
              <Highlight text={member.firstName} query={query} />{' '}
              <Highlight text={member.lastName}  query={query} />
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <CheckCircle2 size={20} strokeWidth={1.8} style={{ color: verified ? 'var(--color-success)' : 'var(--color-text-muted)', opacity: verified ? 1 : 0.4 }} />
            <span className="text-[9px] font-semibold" style={{ color: verified ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
              {verified ? 'ยืนยัน' : 'รอยืนยัน'}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <div>
            <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'var(--color-text-muted)' }}>รหัสสมาชิก VIP</p>
            <p className="text-sm font-bold tracking-wider" style={{ color: 'var(--color-primary)', fontFamily: 'monospace' }}>{member.memberId}</p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: gradient }}>{member.source}</span>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-5 pb-5 flex gap-2">
        {verified ? (
          <button disabled
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#DCFCE7', color: '#15803D' }}>
            <BadgeCheck size={15} /> ยืนยันตัวตนแล้ว
          </button>
        ) : (
          <button onClick={onVerify}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-white active:scale-[0.97] transition-transform"
            style={{ background: gradient }}>
            <ShieldCheck size={15} /> ยืนยันการเป็น VIP
          </button>
        )}
        <button onClick={onSaveImage}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.97] transition-transform"
          style={{ boxShadow: 'var(--shadow-neo-sm)', background: 'var(--color-bg)', color: 'var(--color-primary)' }}>
          <ImageDown size={15} /> บัตร
        </button>
      </div>
    </div>
  )
}

/* ── Verify modal (1 ชื่อ = 1 VIP) ── */
function VerifyModal({ member, alreadyVerified, onClose, onVerified }: {
  member: VipSheetMember; alreadyVerified: boolean; onClose: () => void; onVerified: () => void
}) {
  const [phone, setPhone]   = useState('')
  const [lineId, setLineId] = useState('')
  const [state, setState]   = useState<'form'|'submitting'|'success'|'already'|'error'>(
    alreadyVerified ? 'already' : 'form',
  )

  const fullName = [member.prefix, member.firstName, member.lastName].filter(Boolean).join(' ')

  const handleConfirm = async () => {
    setState('submitting')
    const res = await verifyVipMember(member)
    if (res.ok) {
      // Optionally attach contact info to the database (best-effort).
      if (phone.trim()) {
        submitVipApplication({
          prefix: member.prefix, firstName: member.firstName, lastName: member.lastName,
          phone: phone.trim(), email: '', lineId: lineId.trim(),
          organization: '', province: '', position: '',
          note: 'ยืนยันตัวตนจากรายชื่อ VIP', slipUrl: null, amount: 0,
          matchedMemberId: member.memberId,
        }).catch(() => {})
      }
      onVerified()
      setState('success')
    } else if (res.reason === 'already') {
      onVerified()
      setState('already')
    } else {
      setState('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl p-5"
        style={{ background: 'var(--color-bg)', boxShadow: 'var(--shadow-neo-lg)' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
            <span className="font-bold">ยืนยันการเป็น VIP</span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X size={18} /></button>
        </div>

        {/* SUCCESS */}
        {state === 'success' && (
          <div className="text-center py-4">
            <CheckCircle2 size={48} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--color-success)' }} />
            <p className="font-bold text-lg mb-1">ยืนยันสำเร็จ!</p>
            <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>{fullName}</p>
            <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
              รหัส {member.memberId} ถูกบันทึกเป็นสมาชิก VIP ที่ยืนยันแล้ว
            </p>
            <button onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#2563EB,#06B6D4)' }}>
              เสร็จสิ้น
            </button>
          </div>
        )}

        {/* ALREADY */}
        {state === 'already' && (
          <div className="text-center py-4">
            <BadgeCheck size={48} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--color-success)' }} />
            <p className="font-bold text-lg mb-1">รหัสนี้ยืนยันแล้ว</p>
            <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
              {member.memberId} ได้รับการยืนยันตัวตนเรียบร้อย — 1 รหัส ยืนยันได้เพียงครั้งเดียว
            </p>
            <button onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold"
              style={{ boxShadow: 'var(--shadow-neo-sm)', background: 'var(--color-bg)', color: 'var(--color-primary)' }}>
              ปิด
            </button>
          </div>
        )}

        {/* ERROR */}
        {state === 'error' && (
          <div className="text-center py-4">
            <X size={48} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--color-error)' }} />
            <p className="font-bold mb-1">เกิดข้อผิดพลาด</p>
            <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>กรุณาลองใหม่อีกครั้ง</p>
            <button onClick={() => setState('form')}
              className="w-full py-3 rounded-xl font-semibold"
              style={{ boxShadow: 'var(--shadow-neo-sm)', background: 'var(--color-bg)', color: 'var(--color-primary)' }}>
              ลองอีกครั้ง
            </button>
          </div>
        )}

        {/* FORM */}
        {(state === 'form' || state === 'submitting') && (
          <>
            <div className="rounded-xl p-3 mb-4 flex items-center gap-3"
              style={{ boxShadow: 'var(--shadow-neo-inset)', background: 'var(--color-bg)' }}>
              <Crown size={18} style={{ color: '#D97706' }} className="flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{fullName}</p>
                <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{member.memberId} · {member.source}</p>
              </div>
            </div>

            <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
              ยืนยันว่าคุณคือบุคคลนี้ (เพิ่มช่องทางติดต่อเพื่อให้ทีมงานยืนยันได้เร็วขึ้น — ไม่บังคับ)
            </p>

            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ boxShadow: 'var(--shadow-neo-inset)', background: 'var(--color-bg)' }}>
                <Phone size={15} style={{ color: 'var(--color-text-muted)' }} />
                <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" inputMode="tel"
                  placeholder="เบอร์โทรศัพท์ (ไม่บังคับ)"
                  className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--color-text)' }} />
              </div>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ boxShadow: 'var(--shadow-neo-inset)', background: 'var(--color-bg)' }}>
                <MessageCircle size={15} style={{ color: 'var(--color-text-muted)' }} />
                <input value={lineId} onChange={e => setLineId(e.target.value)}
                  placeholder="Line ID (ไม่บังคับ)"
                  className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--color-text)' }} />
              </div>
            </div>

            <button onClick={handleConfirm} disabled={state === 'submitting'}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#2563EB,#06B6D4)' }}>
              {state === 'submitting'
                ? <><Loader2 size={16} className="animate-spin" /> กำลังยืนยัน...</>
                : <><ShieldCheck size={16} /> ยืนยันว่าเป็นบุคคลนี้</>}
            </button>
            <p className="text-[10px] text-center mt-2" style={{ color: 'var(--color-text-muted)' }}>
              1 รหัส ยืนยันได้เพียง 1 ครั้งเท่านั้น
            </p>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Image card modal ── */
function CardModal({ member, verified, onClose }: { member: VipSheetMember; verified: boolean; onClose: () => void }) {
  const [imgSrc, setImgSrc]       = useState('')
  const [generating, setGenerating] = useState(true)

  useEffect(() => {
    setGenerating(true)
    generateCardImage(member, verified).then(src => { setImgSrc(src); setGenerating(false) })
  }, [member, verified])

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = imgSrc; a.download = `VIP-${member.memberId}.png`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div className="w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex justify-end mb-3">
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <X size={18} className="text-white" />
          </button>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-gray-800 flex items-center justify-center" style={{ aspectRatio: '1080/600' }}>
          {generating
            ? <Loader2 size={36} className="animate-spin text-white/50" />
            // eslint-disable-next-line @next/next/no-img-element
            : <img src={imgSrc} alt={`VIP Card ${member.memberId}`} className="w-full h-full object-cover" />}
        </div>
        <p className="text-center text-white/50 text-xs mt-3 mb-4">
          iOS: กดค้างที่ภาพเพื่อบันทึก &nbsp;|&nbsp; Android/PC: กดปุ่มด้านล่าง
        </p>
        <div className="flex gap-2">
          <button onClick={handleDownload} disabled={generating}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm disabled:opacity-40"
            style={{ background: '#FFFFFF', color: '#1D4ED8' }}>
            <Download size={16} /> บันทึกภาพ
          </button>
          <button onClick={() => window.open(imgSrc, '_blank')} disabled={generating}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm border border-white/30 text-white disabled:opacity-40">
            <ImageDown size={16} /> เปิด
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Highlight ── */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query || !text) return <>{text}</>
  const q = query.trim().toLowerCase()
  const idx = text.toLowerCase().indexOf(q)
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#DBEAFE', color: 'var(--color-primary)', borderRadius: 3, padding: '0 2px' }}>
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}
