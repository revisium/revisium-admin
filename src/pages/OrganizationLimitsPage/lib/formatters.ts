export const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US')
}

export const formatStorage = (bytes: number): string => {
  if (bytes >= 1_073_741_824) {
    return `${(bytes / 1_073_741_824).toFixed(1)} GB`
  }
  if (bytes >= 1_048_576) {
    return `${(bytes / 1_048_576).toFixed(1)} MB`
  }
  return `${(bytes / 1024).toFixed(1)} KB`
}

export const formatLimitNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'Unlimited'
  return value.toLocaleString('en-US')
}

export const formatLimitStorage = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined) return 'Unlimited'
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(0)} GB`
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(0)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}
