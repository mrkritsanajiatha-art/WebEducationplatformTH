import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Bot, GraduationCap, BookOpen, Crown, Users, Download,
  Newspaper, Ticket, FileText, BarChart2, ChevronRight,
  Sparkles,
} from 'lucide-react'
import { PublicPageLayout } from '@/components/layout/PublicPageLayout'
import { CourseCard, type CourseCardData } from '@/components/course/CourseCard'
import { defaultSiteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'หน้าแรก',
  description: defaultSiteConfig.description,
}

/* ─── Sidebar nav data ─── */
const SIDEBAR_TOP = [
  { label: 'แนะนำสำหรับคุณ', Icon: Sparkles, href: '/' },
  { label: 'สมัคร VIP member', Icon: Crown, href: '/vip/apply' },
  { label: 'คอร์สทั้งหมด',   Icon: GraduationCap, href: '/courses' },
]

const SIDEBAR_CATS = [
  { label: 'AI & เทคโนโลยี',       Icon: Bot,          href: '/courses?cat=ai' },
  { label: 'พัฒนา PA & วิจัย',     Icon: BarChart2,    href: '/courses?cat=pa' },
  { label: 'นวัตกรรมการสอน',      Icon: BookOpen,     href: '/courses?cat=innovation' },
  { label: 'VIP & พรีเมียม',       Icon: Crown,        href: '/vip' },
  { label: 'Community',            Icon: Users,        href: '/community' },
  { label: 'ดาวน์โหลดฟรี',         Icon: Download,     href: '/downloads' },
  { label: 'ข่าวสาร',               Icon: Newspaper,    href: '/news' },
  { label: 'กิจกรรม & สัมมนา',     Icon: Ticket,       href: '/events' },
]

/* ─── Category cards (main grid) ─── */
const CAT_CARDS = [
  {
    title: 'AI & เทคโนโลยี',
    desc: 'เรียนรู้ AI ยุคใหม่ Gemini · ChatGPT · NotebookLM สำหรับครู',
    count: '40+ หลักสูตร',
    Icon: Bot,
    bg: 'linear-gradient(135deg,#1E3A5F,#2563EB)',
    href: '/courses?cat=ai',
  },
  {
    title: 'พัฒนา PA & วิจัย',
    desc: 'วิจัยในชั้นเรียน แผนการสอน ประเมินผล PA ม.7 ครบวงจร',
    count: '25+ หลักสูตร',
    Icon: BarChart2,
    bg: 'linear-gradient(135deg,#0C4A2E,#059669)',
    href: '/courses?cat=pa',
  },
  {
    title: 'นวัตกรรมการสอน',
    desc: 'เทคนิคใหม่ สื่อการสอน Active Learning ห้องเรียนยุคใหม่',
    count: '30+ หลักสูตร',
    Icon: BookOpen,
    bg: 'linear-gradient(135deg,#312E81,#7C3AED)',
    href: '/courses?cat=innovation',
  },
  {
    title: 'VIP พรีเมียม',
    desc: 'คอร์ส Exclusive เอกสาร Prompt สิทธิพิเศษเฉพาะสมาชิก VIP',
    count: '1,200+ VIP',
    Icon: Crown,
    bg: 'linear-gradient(135deg,#78350F,#D97706)',
    href: '/vip',
  },
]

/* ─── Featured courses ─── */
const COURSES: CourseCardData[] = [
  { href: '/courses', title: 'พัฒนา PA ด้วย AI ยุคใหม่ สำหรับครูไทย', instructor: 'อ.ดร.สมหวัง วิทยา', org: 'สมาพันธ์แพลตฟอร์มฯ', price: 'free', rating: 4.9, reviews: 688, learners: 3820, durationHrs: 6, badge: 'ฮิต', Icon: Bot, accent: ['#1E3A8A', '#2563EB'] },
  { href: '/courses', title: 'Prompt Engineering สำหรับครูไทย', instructor: 'อ.รัตนา เทคโน', org: 'สมาพันธ์แพลตฟอร์มฯ', price: 490, rating: 4.7, reviews: 176, learners: 980, durationHrs: 7, badge: 'ใหม่', Icon: FileText, accent: ['#312E81', '#7C3AED'] },
  { href: '/courses', title: 'วิจัยในชั้นเรียน 5 บท ทำได้จริง', instructor: 'ผศ.ดร.วิรัช ปัญญา', org: 'สมาพันธ์แพลตฟอร์มฯ', price: 290, rating: 4.8, reviews: 302, learners: 1680, durationHrs: 5, badge: 'แนะนำ', Icon: BarChart2, accent: ['#0C4A2E', '#059669'] },
  { href: '/courses', title: 'นวัตกรรมห้องเรียน 2567 Active Learning', instructor: 'อ.ชลิดา ออกแบบ', org: 'สมาพันธ์แพลตฟอร์มฯ', price: 390, rating: 4.6, reviews: 210, learners: 2100, durationHrs: 5, badge: 'ฮิต', Icon: BookOpen, accent: ['#78350F', '#D97706'] },
]

const STATS = [
  { value: '5,000+', label: 'สมาชิก' },
  { value: '1,200+', label: 'VIP Member' },
  { value: '48',     label: 'หลักสูตร' },
  { value: '3,800+', label: 'ผู้เรียน' },
]

/* ─── Page ─── */
export default function HomePage() {
  return (
    <PublicPageLayout>
      <div className="flex min-h-[calc(100vh-64px)]">

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className="hidden lg:flex flex-col w-56 xl:w-60 flex-shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
          <div className="p-3 flex flex-col gap-0.5">

            {SIDEBAR_TOP.map(item => (
              <Link key={item.label} href={item.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/60"
                  style={{ color: 'var(--color-primary)' }}>
                  <item.Icon size={16} strokeWidth={1.8} />
                  {item.label}
                </div>
              </Link>
            ))}

            <div className="mt-4 mb-2 px-3">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                หมวดหมู่ยอดฮิต
              </p>
            </div>

            {SIDEBAR_CATS.map(item => (
              <Link key={item.label} href={item.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/60"
                  style={{ color: 'var(--color-text)' }}>
                  <item.Icon size={15} strokeWidth={1.5} style={{ color: 'var(--color-text-muted)' }} />
                  {item.label}
                </div>
              </Link>
            ))}

            {/* VIP promo box */}
            <div className="mt-4 mx-1 rounded-xl p-3 text-white"
              style={{ background: 'linear-gradient(135deg,#2563EB,#06B6D4)' }}>
              <p className="text-xs font-bold mb-0.5">สมาพันธ์ VIP Plus</p>
              <p className="text-[10px] opacity-80 leading-snug mb-2">ตลอดชีพ 499 บาท · คอร์สไม่จำกัด</p>
              <Link href="/vip/apply">
                <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg">สมัคร VIP →</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <main className="flex-1 min-w-0 overflow-hidden">

          {/* ── Banner ── */}
          <section className="p-3 sm:p-4 lg:p-5">
            <div className="relative rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#1E3A8A 0%,#2563EB 45%,#0EA5E9 100%)', minHeight: 200 }}>

              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10" style={{ background: '#FFFFFF' }} />
              <div className="absolute -bottom-8 right-32 w-32 h-32 rounded-full opacity-10" style={{ background: '#06B6D4' }} />
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-15" style={{ background: '#FFFFFF' }} />

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 p-6 sm:p-8 lg:p-10">

                {/* Left text */}
                <div className="flex-1 text-white">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold mb-4">
                    <Sparkles size={12} />
                    แพลตฟอร์มพัฒนาครูอันดับ 1
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}>
                    พัฒนาวิชาชีพครู<br />
                    <span style={{ color: '#7DD3FC' }}>สู่ยุค AI & นวัตกรรม</span>
                  </h1>
                  <p className="text-white/80 text-sm lg:text-base mb-5 max-w-sm leading-relaxed">
                    สมาพันธ์แพลตฟอร์มการศึกษาและอาชีพแห่งประเทศไทย
                    พร้อมหลักสูตร PA · AI · วิจัย ครบในที่เดียว
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/courses">
                      <button className="px-6 py-2.5 rounded-xl font-bold text-sm"
                        style={{ background: '#FFFFFF', color: '#1D4ED8' }}>
                        เริ่มเรียนฟรี →
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="px-6 py-2.5 rounded-xl font-bold text-sm border border-white/40 text-white">
                        สมัครสมาชิก
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right: stats */}
                <div className="hidden sm:grid grid-cols-2 gap-3 flex-shrink-0">
                  {STATS.map(s => (
                    <div key={s.label} className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                      <p className="text-xl font-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                      <p className="text-[11px] text-white/70">{s.label}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* ── Stats (mobile only) ── */}
          <section className="sm:hidden px-3 pb-4">
            <div className="grid grid-cols-2 gap-2">
              {STATS.map(s => (
                <div key={s.label} className="rounded-xl p-3 text-center"
                  style={{ boxShadow: 'var(--shadow-neo-sm)', background: 'var(--color-bg)' }}>
                  <p className="text-lg font-extrabold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Category cards grid ── */}
          <section className="px-3 sm:px-4 lg:px-5 pb-5">
            <SectionHead title="หมวดหมู่ยอดนิยม" href="/courses" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {CAT_CARDS.map(c => (
                <Link href={c.href} key={c.title}>
                  <div className="rounded-2xl p-4 sm:p-5 flex flex-col gap-3 h-full active:scale-[0.97] transition-transform"
                    style={{ background: c.bg, minHeight: 160 }}>
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <c.Icon size={18} strokeWidth={1.5} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm leading-snug mb-1">{c.title}</p>
                      <p className="text-white/70 text-[11px] leading-relaxed hidden sm:block">{c.desc}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-[11px] font-semibold">{c.count}</span>
                      <ChevronRight size={14} className="text-white/60" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Featured Courses ── */}
          <section className="px-3 sm:px-4 lg:px-5 pb-5">
            <SectionHead title="หลักสูตรแนะนำ" sub="เริ่มเรียนได้เลยวันนี้" href="/courses" />

            {/* Mobile: scroll */}
            <div className="flex lg:hidden scroll-row">
              {COURSES.map(c => (
                <div key={c.title} className="w-52"><CourseCard data={c} /></div>
              ))}
            </div>
            {/* Desktop: grid */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {COURSES.map(c => <CourseCard key={c.title} data={c} />)}
            </div>
          </section>

          {/* ── AI Hub highlight ── */}
          <section className="px-3 sm:px-4 lg:px-5 pb-5">
            <Link href="/ai-hub">
              <div className="rounded-2xl p-5 flex items-center gap-4 active:scale-[0.98] transition-transform"
                style={{ background: 'linear-gradient(135deg,#EFF6FF,#E0F2FE)', boxShadow: 'var(--shadow-neo)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: 'var(--shadow-neo-inset)', background: 'var(--color-bg)' }}>
                  <Bot size={24} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-primary)' }}>เปิดให้ใช้งานแล้ว</p>
                  <p className="font-bold" style={{ fontFamily: 'var(--font-heading)' }}>AI Hub สำหรับครู</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Gemini · ChatGPT · NotebookLM · Canva AI</p>
                </div>
                <ChevronRight size={18} strokeWidth={1.5} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            </Link>
          </section>

          {/* ── CTA ── */}
          <section className="px-3 sm:px-4 lg:px-5 pb-10">
            <div className="rounded-2xl p-6 sm:p-8 text-center"
              style={{ background: 'linear-gradient(135deg,#1E40AF,#0EA5E9)', boxShadow: 'var(--shadow-neo-lg)' }}>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">เริ่มต้นวันนี้</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                สมัครสมาชิกฟรี
              </h2>
              <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
                เข้าถึงหลักสูตร · AI Hub · Community และอีกมากมาย — ไม่มีค่าใช้จ่าย
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register">
                  <button className="px-8 py-3 rounded-xl font-bold text-base"
                    style={{ background: '#FFFFFF', color: '#1D4ED8' }}>
                    สมัครสมาชิกฟรี →
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-8 py-3 rounded-xl font-semibold text-white border border-white/30">
                    เข้าสู่ระบบ
                  </button>
                </Link>
              </div>
            </div>
          </section>

        </main>
      </div>
    </PublicPageLayout>
  )
}

/* ─── Section header ─── */
function SectionHead({ title, sub, href }: { title: string; sub?: string; href: string }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>}
      </div>
      <Link href={href} className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
        ดูทั้งหมด <ChevronRight size={13} strokeWidth={2} />
      </Link>
    </div>
  )
}

