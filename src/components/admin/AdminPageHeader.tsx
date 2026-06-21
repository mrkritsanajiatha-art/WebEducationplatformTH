import Link from 'next/link'
import { NeoButton } from '@/components/neo/NeoButton'

interface AdminPageHeaderProps {
  title: string
  createHref?: string
  createLabel?: string
  backHref?: string
  backLabel?: string
}

export function AdminPageHeader({ title, createHref, createLabel = 'สร้างใหม่', backHref, backLabel = 'กลับ' }: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link href={backHref}>
            <NeoButton variant="ghost" size="sm">← {backLabel}</NeoButton>
          </Link>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      {createHref && (
        <Link href={createHref}>
          <NeoButton variant="primary" size="sm">+ {createLabel}</NeoButton>
        </Link>
      )}
    </div>
  )
}
