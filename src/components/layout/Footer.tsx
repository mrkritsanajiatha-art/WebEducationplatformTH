import Link from 'next/link'
import Image from 'next/image'
import { defaultSiteConfig } from '@/config/site'
import type { SiteSettings } from '@/types'

interface FooterProps {
  settings?: Partial<SiteSettings>
}

export function Footer({ settings }: FooterProps) {
  const s = { ...defaultSiteConfig, ...settings }
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[var(--color-text)] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={s.logoUrl}
                alt={s.orgNameTh}
                width={44}
                height={44}
                className="rounded-xl object-contain"
                unoptimized
              />
              <div>
                <p className="font-bold text-base leading-tight">{s.orgNameTh}</p>
                <p className="text-xs text-white/60">{s.orgNameEn}</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-4">{s.description}</p>
            <a
              href={s.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#06C755] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#05b34c] transition-colors"
            >
              <span>💬</span>
              <span>{s.lineOaName}</span>
              <span className="text-white/70">({s.lineId})</span>
            </a>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm text-white/90">บริการของเรา</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {['หลักสูตรอบรม', 'ห้องเรียนออนไลน์', 'VIP Member', 'AI Hub', 'ดาวน์โหลด', 'Community'].map((l) => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm text-white/90">ติดต่อเรา</h3>
            <address className="not-italic text-sm text-white/70 leading-relaxed space-y-1">
              <p>{s.address.street}</p>
              <p>{s.address.subdistrict}</p>
              <p>{s.address.district}</p>
              <p>{s.address.province} {s.address.postalCode}</p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {year} {s.orgNameTh}. สงวนลิขสิทธิ์ทุกประการ.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white/80 transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <Link href="/terms"   className="hover:text-white/80 transition-colors">ข้อตกลงการใช้งาน</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
