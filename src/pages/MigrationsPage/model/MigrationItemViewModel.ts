import { IconType } from 'react-icons'
import { makeAutoObservable } from 'mobx'
import { JsonValue } from 'src/entities/Schema/types/json.types'
import { container } from 'src/shared/lib'
import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import {
  getMigrationDescription,
  MessageSegment,
  MigrationDescription,
} from 'src/pages/MigrationsPage/lib/getMigrationDescription.ts'
import { formatRelativeTime } from 'src/shared/lib/helpers/formatRelativeTime.ts'

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

export type MigrationItemViewModelFactoryFn = (data: PatchData) => MigrationItemViewModel

export class MigrationItemViewModelFactory {
  constructor(public readonly create: MigrationItemViewModelFactoryFn) {}
}

export class MigrationItemViewModel {
  private _isPopoverOpen = false

  constructor(public readonly data: PatchData) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get id(): string {
    return `${this.data.migrationId}-${this.data.patch.path}`
  }

  public get isPopoverOpen(): boolean {
    return this._isPopoverOpen
  }

  public setPopoverOpen(value: boolean): void {
    this._isPopoverOpen = value
  }

  public get fullPatchData(): JsonValue {
    return this.data.parentMigration as unknown as JsonValue
  }

  public get relativeTime(): string {
    return formatRelativeTime(this.data.migrationId)
  }

  public get description(): MigrationDescription {
    return getMigrationDescription(this.data)
  }

  public get descriptionSegments(): MessageSegment[] {
    return this.description.segments
  }

  public get descriptionIcon(): IconType {
    return this.description.icon
  }
}

container.register(
  MigrationItemViewModelFactory,
  () => new MigrationItemViewModelFactory((data) => new MigrationItemViewModel(data)),
  { scope: 'request' },
)
