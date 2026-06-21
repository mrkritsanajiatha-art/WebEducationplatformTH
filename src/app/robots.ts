import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/my-learning/', '/payment/', '/notifications/'],
      },
    ],
    sitemap: 'https://educationplatformth.web.app/sitemap.xml',
  }
}
