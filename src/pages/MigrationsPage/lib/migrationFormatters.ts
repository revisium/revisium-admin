import { MigrationData, MigrationDiffItem, MigrationDiffStatus } from 'src/pages/MigrationsPage/config/types.ts'

export function getMigrationSummary(item: MigrationDiffItem): string {
  const { changeType, tableId } = item.migration

  switch (changeType) {
    case 'init':
      return `init: ${tableId} (new table)`
    case 'update':
      return `update: ${tableId}`
    case 'rename':
      return `rename: ${tableId} → ${(item.migration as MigrationData & { nextTableId: string }).nextTableId}`
    case 'remove':
      return `remove: ${tableId}`
    default:
      return `${changeType}: ${tableId}`
  }
}

export function getStatusLabel(status: MigrationDiffStatus): string {
  switch (status) {
    case 'apply':
      return 'Apply'
    case 'skip':
      return 'Skip'
    case 'conflict':
      return 'Conflict'
    case 'blocked':
      return 'Blocked'
  }
}
