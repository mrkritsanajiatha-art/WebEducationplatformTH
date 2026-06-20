import { Header } from './Header'
import { Footer } from './Footer'
import { BottomNav } from './BottomNav'
import type { SiteSettings } from '@/types'

interface PublicPageLayoutProps {
  children: React.ReactNode
  settings?: Partial<SiteSettings>
}

export function PublicPageLayout({ children, settings }: PublicPageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header settings={settings} />
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer settings={settings} />
      <BottomNav />
    </div>
  )
}
