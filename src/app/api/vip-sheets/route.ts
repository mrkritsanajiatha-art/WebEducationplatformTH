import { NextResponse } from 'next/server'

const SHEETS = [
  { id: '1irO6f0Ej8GezI4ks3fRvBb04Q2cpJQj83GCSRZRHK4Q', name: 'Sheet1', label: 'ฐาน 1', prefix: 'B1' },
  { id: '1ZeRewvbnbi6Wrn8wRJM21W7c21BLtP7cNWOoa6TnI1s', name: 'Sheet1', label: 'ฐาน 2', prefix: 'B2' },
]

export interface VipSheetMember {
  memberId: string
  prefix: string
  firstName: string
  lastName: string
  source: string
}

/* Simple CSV parser that handles quoted fields */
function parseCsv(csv: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuote = false

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i]
    if (ch === '"') {
      if (inQuote && csv[i + 1] === '"') { cell += '"'; i++ }
      else inQuote = !inQuote
    } else if (ch === ',' && !inQuote) {
      row.push(cell.trim())
      cell = ''
    } else if ((ch === '\n' || ch === '\r') && !inQuote) {
      if (ch === '\r' && csv[i + 1] === '\n') i++
      row.push(cell.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += ch
    }
  }
  if (cell || row.length) { row.push(cell.trim()); if (row.some(Boolean)) rows.push(row) }
  return rows
}

function parseSheet(csv: string, label: string, idPrefix: string): VipSheetMember[] {
  const rows = parseCsv(csv)
  if (rows.length < 2) return []

  const headers = rows[0].map(h => h.toLowerCase())

  const find = (...keywords: string[]) =>
    headers.findIndex(h => keywords.some(k => h.includes(k)))

  /* Try to find an existing ID column first */
  const idIdx = find('รหัส', 'member_id', 'memberid', 'id', 'เลขที่', 'no.')
  const pIdx  = find('คำนำหน้า', 'prefix', 'title', 'นำหน้า')
  const fIdx  = find('ชื่อ', 'firstname', 'first_name', 'name')
  const lIdx  = find('นามสกุล', 'lastname', 'last_name', 'surname')

  const pi = pIdx >= 0 ? pIdx : 0
  const fi = fIdx >= 0 ? fIdx : 1
  const li = lIdx >= 0 ? lIdx : 2

  return rows.slice(1)
    .filter(r => r.length > 1)
    .map((r, i) => {
      /* Use existing ID from sheet, or generate sequential one */
      const rawId = idIdx >= 0 ? (r[idIdx] ?? '').trim() : ''
      const memberId = rawId
        ? `VIP-${rawId}`
        : `VIP-${idPrefix}-${String(i + 1).padStart(4, '0')}`

      return {
        memberId,
        prefix:    (r[pi] ?? '').trim(),
        firstName: (r[fi] ?? '').trim(),
        lastName:  (r[li] ?? '').trim(),
        source:    label,
      }
    })
    .filter(m => m.firstName || m.lastName)
}

export async function GET() {
  const members: VipSheetMember[] = []
  const errors: string[] = []

  await Promise.all(SHEETS.map(async (sheet) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheet.id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet.name)}`
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      })
      if (!res.ok) { errors.push(`${sheet.label}: HTTP ${res.status}`); return }
      const csv = await res.text()
      members.push(...parseSheet(csv, sheet.label, sheet.prefix))
    } catch (e) {
      errors.push(`${sheet.label}: ${e instanceof Error ? e.message : 'error'}`)
    }
  }))

  return NextResponse.json({ members, total: members.length, errors })
}
