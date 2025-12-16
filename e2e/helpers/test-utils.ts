let testCounter = 0

export function generateUniqueId(prefix: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  testCounter++
  return `${prefix}-${timestamp}-${random}-${testCounter}`
}

export function generateProjectName(): string {
  return generateUniqueId('test-project')
}

export function generateTableName(): string {
  return generateUniqueId('test-table')
}

export function generateRowId(): string {
  return generateUniqueId('row')
}
