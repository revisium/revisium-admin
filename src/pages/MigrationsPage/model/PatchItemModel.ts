import { makeAutoObservable } from 'mobx'
import { JsonValue } from 'src/entities/Schema/types/json.types'
import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import { convertSchemaPathToJsonPath } from 'src/pages/MigrationsPage/lib/convertSchemaPathToJsonPath.ts'

export interface JsonPatchOperation {
  op: string
  path: string
  value?: JsonValue
  from?: string
}

export interface PatchData {
  migrationId: string
  tableId: string
  patch: JsonPatchOperation
  timestamp?: string
  parentMigration: MigrationData
}

export class PatchItemModel {
  public isPopoverOpen = false

  constructor(public readonly data: PatchData) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get id(): string {
    return `${this.data.migrationId}-${this.data.patch.path}`
  }

  public get tableId(): string {
    return this.data.tableId
  }

  public get op(): string {
    return this.data.patch.op
  }

  public get displayPath(): string {
    return convertSchemaPathToJsonPath(this.data.patch.path)
  }

  public get displayFrom(): string | undefined {
    if (this.data.patch.from) {
      return convertSchemaPathToJsonPath(this.data.patch.from)
    }
  }

  public setPopoverOpen(value: boolean): void {
    this.isPopoverOpen = value
  }

  public get typeFromSchema(): string | undefined {
    if (this.op === 'move' || this.op === 'remove') {
      return ''
    }

    const value = this.data.patch.value
    if (value && typeof value === 'object' && 'type' in value) {
      return value.type as string
    }

    return ''
  }

  public get fullPatchData() {
    return this.data.parentMigration as unknown as JsonValue
  }
}
