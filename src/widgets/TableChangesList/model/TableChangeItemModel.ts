import { makeAutoObservable } from 'mobx'
import { GetTableChangesQuery } from 'src/__generated__/graphql-request'
import { getChangeTypeBadgeColor, getChangeTypeLabel } from 'src/entities/Changes'

type TableChangeItem = GetTableChangesQuery['tableChanges']['edges'][number]['node']

export class TableChangeItemModel {
  constructor(private _item: TableChangeItem) {
    makeAutoObservable(this)
  }

  public get item(): TableChangeItem {
    return this._item
  }

  public get tableId(): string {
    return this._item.tableId
  }

  public get changeType(): string {
    return this._item.changeType
  }

  public get isRenamed(): boolean {
    return this._item.changeType === 'RENAMED' || this._item.changeType === 'RENAMED_AND_MODIFIED'
  }

  public get displayName(): string {
    return this.isRenamed && this._item.newTableId ? this._item.newTableId : this._item.tableId
  }

  public get oldTableId(): string | null | undefined {
    return this._item.oldTableId
  }

  public get newTableId(): string | null | undefined {
    return this._item.newTableId
  }

  public get changeTypeBadgeColor(): string {
    return getChangeTypeBadgeColor(this._item.changeType)
  }

  public get changeTypeLabel(): string {
    return getChangeTypeLabel(this._item.changeType)
  }

  public get hasSchemaChanges(): boolean {
    return this._item.schemaMigrations.length > 0
  }

  public get schemaMigrationsCount(): number {
    return this._item.schemaMigrations.length
  }

  public get schemaMigrations() {
    return this._item.schemaMigrations
  }

  public get hasRowChanges(): boolean {
    return this._item.rowChangesCount > 0
  }

  public get rowChangesCount(): number {
    return this._item.rowChangesCount
  }

  public get addedRowsCount(): number {
    return this._item.addedRowsCount
  }

  public get modifiedRowsCount(): number {
    return this._item.modifiedRowsCount
  }

  public get removedRowsCount(): number {
    return this._item.removedRowsCount
  }

  public get renamedRowsCount(): number {
    return this._item.renamedRowsCount
  }

  public get rowChangesSummary(): string {
    const parts: string[] = []
    if (this.addedRowsCount > 0) parts.push(`+${this.addedRowsCount}`)
    if (this.modifiedRowsCount > 0) parts.push(`~${this.modifiedRowsCount}`)
    if (this.removedRowsCount > 0) parts.push(`-${this.removedRowsCount}`)
    if (this.renamedRowsCount > 0) parts.push(`↔${this.renamedRowsCount}`)
    return parts.join(' ')
  }
}
