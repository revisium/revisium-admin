export const getFieldChangeTypeColor = (changeType: string): string => {
  switch (changeType) {
    case 'FIELD_ADDED':
      return 'green.500'
    case 'FIELD_REMOVED':
      return 'red.500'
    case 'FIELD_MODIFIED':
      return 'orange.500'
    case 'FIELD_MOVED':
      return 'blue.500'
    case 'SCHEMA_MIGRATION':
      return 'purple.500'
    default:
      return 'gray.500'
  }
}

export const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return 'null'
  }
  if (typeof value === 'string') {
    return `"${value}"`
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}
