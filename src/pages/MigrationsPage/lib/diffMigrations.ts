import { MigrationData, MigrationDiffItem } from 'src/pages/MigrationsPage/config/types.ts'

export function diffMigrations(
  sourceMigrations: MigrationData[],
  existingMigrations: MigrationData[],
): MigrationDiffItem[] {
  const existingIds = new Set(existingMigrations.map((m) => m.id))
  const lastExistingId = existingMigrations[existingMigrations.length - 1]?.id ?? ''

  let hasConflict = false

  return sourceMigrations.map((migration): MigrationDiffItem => {
    if (existingIds.has(migration.id)) {
      return { status: 'skip', migration, reason: 'Already applied' }
    }

    if (hasConflict) {
      return { status: 'blocked', migration, reason: 'Blocked by previous conflict' }
    }

    if (lastExistingId && migration.id <= lastExistingId) {
      hasConflict = true
      return {
        status: 'conflict',
        migration,
        reason: `Migration ID must be after ${lastExistingId}`,
      }
    }

    return { status: 'apply', migration }
  })
}

export function getMigrationsToApply(diffItems: MigrationDiffItem[]): MigrationData[] {
  return diffItems.filter((item) => item.status === 'apply').map((item) => item.migration)
}

export function hasConflicts(diffItems: MigrationDiffItem[]): boolean {
  return diffItems.some((item) => item.status === 'conflict')
}

export function getDiffSummary(diffItems: MigrationDiffItem[]): {
  toApply: number
  toSkip: number
  conflicts: number
  blocked: number
} {
  return {
    toApply: diffItems.filter((item) => item.status === 'apply').length,
    toSkip: diffItems.filter((item) => item.status === 'skip').length,
    conflicts: diffItems.filter((item) => item.status === 'conflict').length,
    blocked: diffItems.filter((item) => item.status === 'blocked').length,
  }
}
