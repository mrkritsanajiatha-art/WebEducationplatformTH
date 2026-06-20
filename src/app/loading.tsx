export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full [box-shadow:var(--shadow-neo)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-3 border-[var(--color-primary)] border-t-transparent animate-spin" />
        </div>
        <p className="text-[var(--color-text-muted)] text-sm">กำลังโหลด…</p>
      </div>
    </div>
  )
}
