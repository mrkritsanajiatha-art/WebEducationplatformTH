import type { MetadataRoute } from 'next'
import { defaultSiteConfig } from '@/config/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: defaultSiteConfig.orgNameTh,
    short_name: 'สมาพันธ์แพลตฟอร์มฯ',
    description: defaultSiteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#EEF2F7',
    theme_color: '#2563EB',
    orientation: 'portrait-primary',
    categories: ['education', 'productivity'],
    lang: 'th',
    icons: [
      { src: '/icons/icon-192.png',     sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png',     sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable.png',sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    screenshots: [],
  }
}
