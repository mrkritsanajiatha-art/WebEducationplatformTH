import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { defaultSiteConfig } from '@/config/site'
import type { SiteSettings } from '@/types'

interface FooterProps {
  settings?: Partial<SiteSettings>
}

const QUICK_LINKS = [
  { label: 'หลักสูตร', href: '/courses' },
  { label: 'VIP Member', href: '/vip' },
  { label: 'AI Hub', href: '/ai-hub' },
  { label: 'ดาวน์โหลด', href: '/downloads' },
  { label: 'ข่าวสาร', href: '/news' },
  { label: 'ติดต่อเรา', href: '/contact' },
]

export function Footer({ settings }: FooterProps) {
  const s = { ...defaultSiteConfig, ...settings }
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 px-4 lg:px-6 pb-6">
      {/* One elegant wide banner — brand · CTA · links · copyright */}
      <div
        className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative text-white"
        style={{ background: 'linear-gradient(120deg,#0F2C6B 0%,#1A56DB 48%,#0EA5E9 100%)' }}
      >
        {/* decorative shapes */}
        <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full opacity-10" style={{ background: '#FFF' }} />
        <div className="absolute -bottom-20 right-40 w-52 h-52 rounded-full opacity-10" style={{ background: '#0EA5E9' }} />
        <div className="absolute top-6 right-6 w-12 h-12 rounded-full opacity-15" style={{ background: '#FFF' }} />

        <div className="relative z-10 px-6 sm:px-10 py-8 lg:py-9">
          {/* Top: brand + CTA */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <Image src={s.logoUrl} alt={s.orgNameTh} width={36} height={36} className="rounded-lg object-contain" unoptimized />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base sm:text-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  {s.orgNameTh}
                </p>
                <p className="text-white/65 text-xs truncate">{s.orgNameEn}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link href="/register">
                <span className="inline-flex px-5 py-2.5 rounded-xl font-bold text-sm bg-white" style={{ color: '#1A56DB' }}>
                  สมัครสมาชิกฟรี
                </span>
              </Link>
              <Link href="/vip/apply">
                <span className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/40 text-white">
                  สมัคร VIP 499฿
                </span>
              </Link>
              <a href={s.lineUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm text-white"
                style={{ background: '#06C755' }}>
                <MessageCircle size={15} /> {s.lineId}
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/15 my-6" />

          {/* Bottom: quick links + copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm text-white/80">
              {QUICK_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
              ))}
            </nav>
            <p className="text-white/55 text-xs whitespace-nowrap">© {year} สงวนลิขสิทธิ์</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
