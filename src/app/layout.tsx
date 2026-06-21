import type { Metadata, Viewport } from 'next'
import { Kanit, Sarabun } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { defaultSiteConfig } from '@/config/site'

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
  display: 'swap',
})

const sarabun = Sarabun({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${defaultSiteConfig.orgNameTh}`,
    default: defaultSiteConfig.orgNameTh,
  },
  description: defaultSiteConfig.description,
  keywords: ['การศึกษา', 'ครู', 'วPA', 'AI', 'หลักสูตร', 'สมาพันธ์'],
  authors: [{ name: defaultSiteConfig.orgNameTh }],
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: defaultSiteConfig.orgNameTh,
    title: defaultSiteConfig.orgNameTh,
    description: defaultSiteConfig.description,
    images: [{ url: defaultSiteConfig.ogImageUrl, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  manifest: '/manifest.webmanifest',
  icons: {
    icon:     defaultSiteConfig.faviconUrl,
    apple:    defaultSiteConfig.faviconUrl,
    shortcut: defaultSiteConfig.faviconUrl,
  },
}

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${kanit.variable} ${sarabun.variable}`} style={{ fontFamily: 'var(--font-sarabun), sans-serif' }}>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
