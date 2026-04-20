const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const
const BYTE_BASE = 1024n

export function parseByteString(value: string): bigint {
  return BigInt(value)
}

export function formatExactBytes(value: string): string {
  return `${parseByteString(value).toLocaleString('en-US')} bytes`
}

export function formatHumanReadableBytes(value: string): string {
  const bytes = parseByteString(value)

  if (bytes === 0n) {
    return '0 B'
  }

  const absoluteBytes = bytes < 0n ? -bytes : bytes
  let unitIndex = 0
  let unitValue = 1n

  while (absoluteBytes >= unitValue * BYTE_BASE && unitIndex < BYTE_UNITS.length - 1) {
    unitValue *= BYTE_BASE
    unitIndex += 1
  }

  if (unitIndex === 0) {
    return `${bytes.toLocaleString('en-US')} ${BYTE_UNITS[unitIndex]}`
  }

  const scaled = (absoluteBytes * 10n) / unitValue
  const whole = scaled / 10n
  const fraction = scaled % 10n
  const sign = bytes < 0n ? '-' : ''

  return `${sign}${whole.toLocaleString('en-US')}.${fraction.toString()} ${BYTE_UNITS[unitIndex]}`
}

export function formatByteValue(value: string): string {
  return `${formatHumanReadableBytes(value)} (${formatExactBytes(value)})`
}
