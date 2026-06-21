import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft:     { label: 'ร่าง',      className: 'bg-gray-100 text-gray-600' },
  published: { label: 'เผยแพร่',   className: 'bg-green-100 text-green-700' },
  scheduled: { label: 'กำหนดเวลา', className: 'bg-blue-100 text-blue-700' },
  archived:  { label: 'เก็บถาวร',  className: 'bg-amber-100 text-amber-700' },
}

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full', cfg.className)}>
      {cfg.label}
    </span>
  )
}
