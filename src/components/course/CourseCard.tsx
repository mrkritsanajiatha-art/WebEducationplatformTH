import Link from 'next/link'
import { Star, Users, Clock, type LucideIcon } from 'lucide-react'

export interface CourseCardData {
  href: string
  title: string
  instructor?: string
  org?: string
  price: number | 'free'
  rating?: number
  reviews?: number
  learners?: number
  durationHrs?: number
  level?: string
  badge?: string
  coverUrl?: string
  Icon?: LucideIcon
  accent?: [string, string]
}

const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  ฟรี:    { bg: '#DCFCE7', color: '#15803D' },
  ใหม่:   { bg: '#DBEAFE', color: '#1D4ED8' },
  VIP:    { bg: '#FEF3C7', color: '#B45309' },
  ฮิต:    { bg: '#FEE2E2', color: '#B91C1C' },
  แนะนำ:  { bg: '#EDE9FE', color: '#6D28D9' },
}

export function CourseCard({ data }: { data: CourseCardData }) {
  const {
    href, title, instructor, org, price, rating, reviews, learners,
    durationHrs, level, badge, coverUrl, Icon, accent = ['#1E3A8A', '#2563EB'],
  } = data
  const b = badge ? (BADGE_STYLE[badge] ?? { bg: '#EEF2F7', color: '#475569' }) : null

  return (
    <Link href={href} className="group block h-full">
      <article
        className="h-full flex flex-col overflow-hidden rounded-[var(--radius)] bg-[var(--color-card)] transition-all duration-200 group-hover:-translate-y-1"
        style={{ border: 'var(--border-card)', boxShadow: 'var(--shadow-neo-sm)' }}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden flex items-center justify-center"
          style={{ background: coverUrl ? undefined : `linear-gradient(135deg,${accent[0]},${accent[1]})` }}>
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            Icon && <Icon size={40} strokeWidth={1.4} className="text-white/90" />
          )}
          {badge && b && (
            <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{ background: b.bg, color: b.color }}>
              {badge}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-3.5">
          {org && (
            <p className="text-[11px] font-semibold mb-1 truncate" style={{ color: 'var(--color-text-muted)' }}>{org}</p>
          )}
          <h3 className="font-bold text-[15px] leading-snug line-clamp-2 mb-1.5"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h3>
          {instructor && (
            <p className="text-xs mb-2 truncate" style={{ color: 'var(--color-text-muted)' }}>{instructor}</p>
          )}

          {/* Rating */}
          {rating != null && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-[13px] font-bold" style={{ color: '#B45309' }}>{rating.toFixed(1)}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={12}
                    className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
                ))}
              </div>
              {reviews != null && (
                <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>({reviews.toLocaleString()})</span>
              )}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] mb-3" style={{ color: 'var(--color-text-muted)' }}>
            {learners != null && <span className="flex items-center gap-1"><Users size={12} />{learners.toLocaleString()}</span>}
            {durationHrs != null && <span className="flex items-center gap-1"><Clock size={12} />{durationHrs} ชม.</span>}
            {level && <span>{level}</span>}
          </div>

          {/* Price */}
          <div className="mt-auto pt-2.5 flex items-center justify-between" style={{ borderTop: 'var(--border-card)' }}>
            <span className="font-extrabold text-base"
              style={{ color: price === 'free' || price === 0 ? '#15803D' : 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
              {price === 'free' || price === 0 ? 'ฟรี' : `฿${Number(price).toLocaleString('th-TH')}`}
            </span>
            <span className="text-xs font-semibold transition-colors group-hover:underline" style={{ color: 'var(--color-primary)' }}>
              ดูคอร์ส →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
