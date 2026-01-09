import { formatDistanceToNow } from 'date-fns'

export function formatRelativeTime(date: string | number | Date | null | undefined): string {
  if (date == null) return ''

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return formatDistanceToNow(parsedDate, { addSuffix: true })
}
