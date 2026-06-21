import type { PageBlock } from '@/types'

type BlockProps = Record<string, unknown>

function HeroBlock({ props }: { props: BlockProps }) {
  const p = props as { heading?: string; subheading?: string; buttonText?: string; buttonHref?: string; bgImageUrl?: string; overlay?: boolean }
  return (
    <section
      className="relative min-h-[480px] flex items-center justify-center text-center px-4"
      style={p.bgImageUrl ? { backgroundImage: `url(${p.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'var(--gradient-primary)' }}
    >
      {(p.overlay || p.bgImageUrl) && <div className="absolute inset-0 bg-black/40" />}
      <div className="relative z-10 max-w-3xl mx-auto text-white">
        {p.heading && <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{p.heading}</h1>}
        {p.subheading && <p className="text-xl text-white/90 mb-8">{p.subheading}</p>}
        {p.buttonText && p.buttonHref && (
          <a href={p.buttonHref} className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-[var(--color-primary)] font-bold hover:bg-white/90 transition-colors shadow-lg">
            {p.buttonText}
          </a>
        )}
      </div>
    </section>
  )
}

function SectionBlock({ props }: { props: BlockProps }) {
  const p = props as { title?: string; content?: string; imageUrl?: string; imagePosition?: 'left' | 'right' | 'none'; bgColor?: string }
  const hasImage = p.imageUrl && p.imagePosition !== 'none'
  return (
    <section className="py-16 px-4" style={{ backgroundColor: p.bgColor || 'transparent' }}>
      <div className={`max-w-5xl mx-auto ${hasImage ? 'grid md:grid-cols-2 gap-12 items-center' : 'max-w-3xl'}`}>
        {hasImage && p.imagePosition === 'left' && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl!} alt={p.title || ''} className="w-full rounded-2xl shadow-lg object-cover" />
        )}
        <div>
          {p.title && <h2 className="text-3xl font-bold mb-4">{p.title}</h2>}
          {p.content && <div className="text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">{p.content}</div>}
        </div>
        {hasImage && p.imagePosition !== 'left' && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl!} alt={p.title || ''} className="w-full rounded-2xl shadow-lg object-cover" />
        )}
      </div>
    </section>
  )
}

type CardItem = { title?: string; description?: string; icon?: string; imageUrl?: string; href?: string; badgeText?: string }

function CardsBlock({ props }: { props: BlockProps }) {
  const p = props as { title?: string; columns?: number; items?: CardItem[] }
  const cols = p.columns ?? 3
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {p.title && <h2 className="text-3xl font-bold text-center mb-10">{p.title}</h2>}
        <div className={`grid gap-6 ${gridClass}`}>
          {(p.items ?? []).map((item, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.title || ''} className="w-full h-36 object-cover rounded-xl mb-4" />
              )}
              {item.icon && <div className="text-3xl mb-3">{item.icon}</div>}
              {item.badgeText && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium mb-2 inline-block">{item.badgeText}</span>}
              {item.title && <h3 className="font-bold text-lg mb-2">{item.title}</h3>}
              {item.description && <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{item.description}</p>}
              {item.href && <a href={item.href} className="text-sm text-[var(--color-primary)] font-medium mt-3 inline-block hover:underline">อ่านเพิ่มเติม →</a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBlock({ props }: { props: BlockProps }) {
  const p = props as { heading?: string; subheading?: string; buttonText?: string; buttonHref?: string; secondaryButtonText?: string; secondaryButtonHref?: string; bgColor?: string }
  return (
    <section className="py-16 px-4" style={{ background: p.bgColor || 'var(--gradient-primary)' }}>
      <div className="max-w-3xl mx-auto text-center text-white">
        {p.heading && <h2 className="text-3xl font-bold mb-4">{p.heading}</h2>}
        {p.subheading && <p className="text-xl text-white/90 mb-8">{p.subheading}</p>}
        <div className="flex gap-4 justify-center flex-wrap">
          {p.buttonText && p.buttonHref && (
            <a href={p.buttonHref} className="px-8 py-3 rounded-2xl bg-white text-[var(--color-primary)] font-bold hover:bg-white/90 transition-colors shadow-lg">
              {p.buttonText}
            </a>
          )}
          {p.secondaryButtonText && p.secondaryButtonHref && (
            <a href={p.secondaryButtonHref} className="px-8 py-3 rounded-2xl border-2 border-white text-white font-bold hover:bg-white/10 transition-colors">
              {p.secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function HtmlBlock({ props }: { props: BlockProps }) {
  const p = props as { content?: string }
  return <div className="py-8 px-4 max-w-5xl mx-auto" dangerouslySetInnerHTML={{ __html: p.content ?? '' }} />
}

type GalleryItem = { url?: string; alt?: string; caption?: string }

function GalleryBlock({ props }: { props: BlockProps }) {
  const p = props as { title?: string; columns?: number; items?: GalleryItem[] }
  const cols = p.columns ?? 3
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {p.title && <h2 className="text-3xl font-bold text-center mb-10">{p.title}</h2>}
        <div className={`grid gap-4 ${gridClass}`}>
          {(p.items ?? []).map((item, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url || ''} alt={item.alt || ''} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type StatItem = { value?: string; label?: string; icon?: string; color?: string }

function StatsBlock({ props }: { props: BlockProps }) {
  const p = props as { title?: string; bgColor?: string; items?: StatItem[] }
  return (
    <section className="py-16 px-4" style={{ backgroundColor: p.bgColor || 'var(--color-card)' }}>
      <div className="max-w-5xl mx-auto">
        {p.title && <h2 className="text-3xl font-bold text-center mb-10">{p.title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(p.items ?? []).map((item, i) => (
            <div key={i} className="text-center">
              {item.icon && <div className="text-4xl mb-2">{item.icon}</div>}
              <div className="text-4xl font-extrabold" style={{ color: item.color || 'var(--color-primary)' }}>{item.value}</div>
              <div className="text-sm text-[var(--color-text-muted)] mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type FaqItem = { question?: string; answer?: string }

function FaqBlock({ props }: { props: BlockProps }) {
  const p = props as { title?: string; items?: FaqItem[] }
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {p.title && <h2 className="text-3xl font-bold text-center mb-10">{p.title}</h2>}
        <div className="space-y-3">
          {(p.items ?? []).map((item, i) => (
            <details key={i} className="glass rounded-2xl border border-[var(--color-border)] overflow-hidden group">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium list-none">
                {item.question}
                <span className="ml-4 flex-shrink-0 text-[var(--color-primary)] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-4 text-[var(--color-text-muted)] leading-relaxed text-sm">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

type PartnerItem = { name?: string; logoUrl?: string; href?: string; description?: string }

function PartnersBlock({ props }: { props: BlockProps }) {
  const p = props as { title?: string; items?: PartnerItem[] }
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {p.title && <h2 className="text-3xl font-bold text-center mb-10">{p.title}</h2>}
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {(p.items ?? []).map((item, i) => (
            <a key={i} href={item.href ?? '#'} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 glass rounded-2xl border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all min-w-[120px]">
              {item.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.logoUrl} alt={item.name || ''} className="h-12 object-contain" />
              ) : (
                <div className="h-12 flex items-center justify-center text-sm font-bold text-[var(--color-primary)]">{item.name}</div>
              )}
              {item.description && <p className="text-xs text-[var(--color-text-muted)] text-center">{item.description}</p>}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

const BLOCK_MAP: Record<string, React.FC<{ props: BlockProps }>> = {
  hero: HeroBlock,
  section: SectionBlock,
  cards: CardsBlock,
  cta: CtaBlock,
  html: HtmlBlock,
  gallery: GalleryBlock,
  stats: StatsBlock,
  faq: FaqBlock,
  partners: PartnersBlock,
}

export function BlockRenderer({ block }: { block: PageBlock }) {
  const Block = BLOCK_MAP[block.type]
  if (!Block) return <div className="py-4 text-center text-sm text-[var(--color-text-muted)]">Unknown block: {block.type}</div>
  return <Block props={block.props} />
}
