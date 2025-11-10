import { JsonValue } from 'src/entities/Schema/types/json.types.ts'

export type MigrationChangeType = 'init' | 'update' | 'rename' | 'remove'

export interface BaseMigration {
  id: string
  changeType: MigrationChangeType
  tableId: string
}

export interface InitMigration extends BaseMigration {
  changeType: 'init'
  hash: string
  schema: JsonValue
}

export interface UpdateMigration extends BaseMigration {
  changeType: 'update'
  hash: string
  patches: JsonValue[]
}

export interface RenameMigration extends BaseMigration {
  changeType: 'rename'
  nextTableId: string
}

export interface RemoveMigration extends BaseMigration {
  changeType: 'remove'
}

export type MigrationData = InitMigration | UpdateMigration | RenameMigration | RemoveMigration
