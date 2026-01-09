import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import { JsonPatchOperation, PatchData } from '../model/MigrationItemViewModel.ts'

export function parsePatches(migrations: MigrationData[]): PatchData[] {
  const patches: PatchData[] = []

  for (const migration of migrations) {
    if (migration.changeType === 'init') {
      patches.push({
        migrationId: migration.id,
        tableId: migration.tableId,
        patch: {
          op: 'add',
          path: '/',
          value: migration.schema,
        },
        timestamp: migration.id,
        parentMigration: migration,
      })
    }

    if (migration.changeType === 'update' && migration.patches) {
      const patchArray = Array.isArray(migration.patches) ? migration.patches : [migration.patches]

      for (const patch of patchArray) {
        if (patch && typeof patch === 'object' && 'op' in patch && 'path' in patch) {
          patches.push({
            migrationId: migration.id,
            tableId: migration.tableId,
            patch: patch as unknown as JsonPatchOperation,
            timestamp: migration.id,
            parentMigration: migration,
          })
        }
      }
    }
  }

  return patches
}
