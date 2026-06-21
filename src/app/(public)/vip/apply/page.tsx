'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  Crown, CheckCircle2, Loader2, Upload, X, Phone, Mail,
  MessageCircle, Building2, MapPin, BadgeCheck, Sparkles,
} from 'lucide-react'
import { NeoButton } from '@/components/neo/NeoButton'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoSelect } from '@/components/neo/NeoSelect'
import { uploadImage } from '@/lib/cloudinary'
import { submitVipApplication } from '@/lib/firebase/services/vip'

const POSTER_URL = 'https://img2.pic.in.th/unnamed85c0ab4d65372e12.png'
const VIP_PRICE  = 499
const LINE_URL   = 'https://lin.ee/p6890TZG'

const PREFIX_OPTIONS = [
  { value: 'นาย', label: 'นาย' },
  { value: 'นาง', label: 'นาง' },
  { value: 'นางสาว', label: 'นางสาว' },
  { value: 'ดร.', label: 'ดร.' },
  { value: 'ผศ.ดร.', label: 'ผศ.ดร.' },
  { value: 'อื่นๆ', label: 'อื่นๆ' },
]

const BENEFITS = [
  'เข้าถึงคลังความรู้ตลอดชีพ (Lifetime Access)',
  'อัปเดตเทคโนโลยี AI ฟรีตลอดชีพ',
  'อบรมออนไลน์ราคาพิเศษ (ประหยัดสูงสุด 700 บาท/ครั้ง)',
  'ส่วนลด 30% ทุกหลักสูตร',
  'กิจกรรมยกระดับทักษะครั้งใหญ่ 6 ชั่วโมง',
]

interface FormState {
  prefix: string
  firstName: string
  lastName: string
  phone: string
  email: string
  lineId: string
  organization: string
  province: string
  position: string
  note: string
}

const EMPTY: FormState = {
  prefix: 'นาย', firstName: '', lastName: '', phone: '', email: '',
  lineId: '', organization: '', province: '', position: '', note: '',
}

export default function VipApplyPage() {
  const [form, setForm]       = useState<FormState>(EMPTY)
  const [slipUrl, setSlipUrl] = useState<string | null>(null)
  const [slipName, setSlipName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file, 'vip-slips')
      setSlipUrl(url)
      setSlipName(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  const validate = (): string | null => {
    if (!form.firstName.trim()) return 'กรุณากรอกชื่อ'
    if (!form.lastName.trim())  return 'กรุณากรอกนามสกุล'
    if (!/^[0-9\-+\s]{6,20}$/.test(form.phone.trim())) return 'กรุณากรอกเบอร์โทรให้ถูกต้อง'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'อีเมลไม่ถูกต้อง'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (v) { setError(v); return }

    setError('')
    setSubmitting(true)
    try {
      await submitVipApplication({
        prefix: form.prefix,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        lineId: form.lineId.trim(),
        organization: form.organization.trim(),
        province: form.province.trim(),
        position: form.position.trim(),
        note: form.note.trim(),
        slipUrl,
        amount: VIP_PRICE,
        matchedMemberId: null,
      })
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('ส่งใบสมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Success screen ── */
  if (done) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2.5rem 1rem 6rem' }} className="text-center">
        <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-5"
          style={{ boxShadow: 'var(--shadow-neo)', background: 'var(--color-bg)' }}>
          <CheckCircle2 size={40} strokeWidth={1.5} style={{ color: 'var(--color-success)' }} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          ส่งใบสมัครเรียบร้อย!
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          ทีมงานสมาพันธ์ฯ จะตรวจสอบและติดต่อกลับโดยเร็ว<br />
          หากต้องการความรวดเร็ว แอดไลน์เพื่อแจ้งหลักฐานเพิ่มเติม
        </p>
        <div className="flex flex-col gap-3">
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer">
            <NeoButton variant="primary" fullWidth>
              <MessageCircle size={16} /> แอดไลน์ @640ertge
            </NeoButton>
          </a>
          <Link href="/vip">
            <NeoButton variant="secondary" fullWidth>ไปหน้าค้นหา VIP</NeoButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '1.5rem 1rem 6rem' }}>

      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-3"
          style={{ boxShadow: 'var(--shadow-neo-sm)', background: 'var(--color-bg)', color: 'var(--color-primary)' }}>
          <Sparkles size={12} /> สมัคร VIP Member by สมาพันธ์แพลตฟอร์มฯ
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
          ลงทุนครั้งเดียว คุ้มค่าตลอดชีพ
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          อัปสกิล AI &amp; เทคโนโลยี อย่างต่อเนื่อง ไม่มีหยุด
        </p>
      </div>

      {/* Poster */}
      <div className="rounded-2xl overflow-hidden mb-5" style={{ boxShadow: 'var(--shadow-neo-lg)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={POSTER_URL} alt="VIP Member สมาพันธ์แพลตฟอร์มฯ" className="w-full block" />
      </div>

      {/* Benefits + price */}
      <div className="rounded-2xl p-5 mb-5" style={{ boxShadow: 'var(--shadow-neo)', background: 'var(--color-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown size={18} style={{ color: '#D97706' }} />
            <span className="font-bold">สิทธิพิเศษสมาชิก VIP</span>
          </div>
          <div className="text-right">
            <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>เพียง</p>
            <p className="text-2xl font-extrabold leading-none" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
              {VIP_PRICE}<span className="text-sm font-bold"> บาท</span>
            </p>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {BENEFITS.map(b => (
            <li key={b} className="flex items-start gap-2 text-sm">
              <BadgeCheck size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }} />
              <span style={{ color: 'var(--color-text)' }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{ boxShadow: 'var(--shadow-neo-lg)', background: 'var(--color-bg)' }}>

        <p className="font-bold text-base">ข้อมูลผู้สมัคร</p>

        <div className="grid grid-cols-3 gap-3">
          <NeoSelect label="คำนำหน้า" id="prefix" options={PREFIX_OPTIONS} value={form.prefix} onChange={set('prefix')} />
          <NeoInput label="ชื่อ *" id="firstName" className="col-span-2 sm:col-span-1" value={form.firstName} onChange={set('firstName')} placeholder="ชื่อจริง" />
          <NeoInput label="นามสกุล *" id="lastName" className="col-span-3 sm:col-span-1" value={form.lastName} onChange={set('lastName')} placeholder="นามสกุล" />
        </div>

        <NeoInput label="เบอร์โทรศัพท์ *" id="phone" type="tel" inputMode="tel"
          icon={<Phone size={15} />} value={form.phone} onChange={set('phone')} placeholder="08X-XXX-XXXX" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NeoInput label="อีเมล" id="email" type="email" inputMode="email"
            icon={<Mail size={15} />} value={form.email} onChange={set('email')} placeholder="you@email.com" />
          <NeoInput label="Line ID" id="lineId"
            icon={<MessageCircle size={15} />} value={form.lineId} onChange={set('lineId')} placeholder="@yourline" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NeoInput label="โรงเรียน / หน่วยงาน" id="organization"
            icon={<Building2 size={15} />} value={form.organization} onChange={set('organization')} placeholder="ชื่อสถานศึกษา" />
          <NeoInput label="จังหวัด" id="province"
            icon={<MapPin size={15} />} value={form.province} onChange={set('province')} placeholder="จังหวัด" />
        </div>

        <NeoInput label="ตำแหน่ง / วิทยฐานะ" id="position"
          value={form.position} onChange={set('position')} placeholder="เช่น ครูชำนาญการ, ผอ., ศึกษานิเทศก์" />

        {/* Slip upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            หลักฐานการชำระเงิน {VIP_PRICE} บาท (แนบสลิป)
          </label>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />

          {!slipUrl ? (
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center justify-center gap-2 rounded-[var(--radius-sm)] py-4 text-sm font-medium disabled:opacity-60"
              style={{ boxShadow: 'var(--shadow-neo-inset)', background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
              {uploading
                ? <><Loader2 size={16} className="animate-spin" /> กำลังอัปโหลด...</>
                : <><Upload size={16} /> เลือกรูปสลิป (JPG/PNG ไม่เกิน 5MB)</>}
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-[var(--radius-sm)] p-3"
              style={{ boxShadow: 'var(--shadow-neo-inset)', background: 'var(--color-bg)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slipUrl} alt="slip" className="w-12 h-12 rounded-lg object-cover" />
              <span className="flex-1 text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{slipName}</span>
              <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
              <button type="button" onClick={() => { setSlipUrl(null); setSlipName('') }}
                style={{ color: 'var(--color-text-muted)' }}>
                <X size={16} />
              </button>
            </div>
          )}
          <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            ยังไม่ได้ชำระ? แอดไลน์ <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
              className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>@640ertge</a> เพื่อรับข้อมูลบัญชี
          </p>
        </div>

        {error && (
          <p className="text-sm rounded-lg px-3 py-2" style={{ background: '#FEE2E2', color: '#B91C1C' }}>
            {error}
          </p>
        )}

        <NeoButton type="submit" variant="primary" fullWidth size="lg" loading={submitting || uploading}>
          ส่งใบสมัคร VIP
        </NeoButton>

        <p className="text-[11px] text-center" style={{ color: 'var(--color-text-muted)' }}>
          การกดส่งใบสมัคร ถือว่ายอมรับเงื่อนไขการเป็นสมาชิกของสมาพันธ์ฯ
        </p>
      </form>
    </div>
  )
}
