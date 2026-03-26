/**
 * Generic CSV export with BOM for Excel FR compatibility
 */
export function exportToCSV(
  rows: Record<string, unknown>[],
  filename: string,
  columns?: { key: string; label: string }[]
) {
  if (rows.length === 0) return

  const cols = columns ?? Object.keys(rows[0]).map((k) => ({ key: k, label: k }))

  const header = cols.map((c) => `"${c.label}"`).join(';')
  const body = rows.map((row) =>
    cols
      .map((c) => {
        const val = row[c.key]
        if (val == null) return ''
        const str = String(val).replace(/"/g, '""')
        return `"${str}"`
      })
      .join(';')
  )

  // BOM + semicolon separator for French Excel
  const csv = '\uFEFF' + [header, ...body].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
