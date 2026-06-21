import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  logoUrl?: string
  orgName?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showName?: boolean
  noLink?: boolean
}

const logoSize = { sm: 32, md: 44, lg: 56 }
const textSize = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' }

export function Logo({
  logoUrl = 'https://img1.pic.in.th/images/154444111930db4ab18869e27.png',
  orgName = 'สมาพันธ์แพลตฟอร์มการศึกษาฯ',
  size = 'md',
  className,
  showName = true,
  noLink = false,
}: LogoProps) {
  const px = logoSize[size]
  const inner = (
    <>
      <Image
        src={logoUrl}
        alt={orgName}
        width={px}
        height={px}
        className="rounded-xl object-contain flex-shrink-0"
        priority
        unoptimized
      />
      {showName && (
        <span className={cn('font-bold leading-tight text-[var(--color-text)]', textSize[size])}>
          {orgName}
        </span>
      )}
    </>
  )
  if (noLink) {
    return (
      <span className={cn('flex items-center gap-3', className)}>
        {inner}
      </span>
    )
  }
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-3 hover:opacity-90 transition-opacity', className)}
    >
      {inner}
    </Link>
  )
}
