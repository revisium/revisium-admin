/**
 * Convert ISO string to datetime-local input value (local timezone).
 * Example: "2024-01-15T10:30:00.000Z" -> "2024-01-15T13:30" (for UTC+3)
 */
export function toDateTimeLocalValue(isoString: string | null | undefined): string {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch {
    return ''
  }
}

/**
 * Convert datetime-local input value to ISO string.
 * Example: "2024-01-15T13:30" -> "2024-01-15T10:30:00.000Z" (for UTC+3)
 */
export function fromDateTimeLocalValue(localValue: string): string {
  if (!localValue) return ''
  try {
    const date = new Date(localValue)
    if (Number.isNaN(date.getTime())) return ''
    return date.toISOString()
  } catch {
    return ''
  }
}
