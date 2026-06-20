'use client'
import { useEffect } from 'react'
import type { ThemeSettings } from '@/types'
import { defaultThemeConfig } from '@/config/site'

interface ThemeProviderProps {
  theme?: Partial<ThemeSettings>
  children: React.ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    const t = { ...defaultThemeConfig, ...theme, colors: { ...defaultThemeConfig.colors, ...theme?.colors } }
    const root = document.documentElement

    root.style.setProperty('--color-primary',   t.colors.primary)
    root.style.setProperty('--color-secondary', t.colors.secondary)
    root.style.setProperty('--color-accent',    t.colors.accent)
    root.style.setProperty('--color-success',   t.colors.success)
    root.style.setProperty('--color-warning',   t.colors.warning)
    root.style.setProperty('--color-bg',        t.colors.bg)
    root.style.setProperty('--color-card',      t.colors.card)
    root.style.setProperty('--color-text',      t.colors.text)
    root.style.setProperty('--font-heading',    `'${t.fontHeading}', sans-serif`)
    root.style.setProperty('--font-body',       `'${t.fontBody}', sans-serif`)
    root.style.setProperty('--radius',          `${t.radius}px`)
  }, [theme])

  return <>{children}</>
}
