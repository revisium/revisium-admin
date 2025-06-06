import { format, Locale } from 'date-fns'

export function formatDate(
  date: string | number | Date,
  dateFormat: string = 'dd.MM.yyyy, HH:mm',
  locale?: Locale,
): string {
  if (!date) return ''

  const parsedDate = new Date(date)

  if (isNaN(parsedDate.getTime())) {
    console.warn('Invalid date:', date)

    return ''
  }

  const options = { locale }

  return format(parsedDate, dateFormat, options)
}
