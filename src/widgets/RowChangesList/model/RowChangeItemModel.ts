import { makeAutoObservable } from 'mobx'
import { GetRowChangesQuery } from 'src/__generated__/graphql-request'
import { getChangeTypeBadgeColor, getChangeTypeLabel } from 'src/entities/Changes'

type RowChangeItem = GetRowChangesQuery['rowChanges']['edges'][number]['node']

export class RowChangeItemModel {
  constructor(private _item: RowChangeItem) {
    makeAutoObservable(this)
  }

  public get item(): RowChangeItem {
    return this._item
  }

  public get tableId(): string {
    return this._item.tableId
  }

  public get rowId(): string {
    return this._item.rowId
  }

  public get changeType(): string {
    return this._item.changeType
  }

  public get isRenamed(): boolean {
    return this._item.changeType === 'RENAMED' || this._item.changeType === 'RENAMED_AND_MODIFIED'
  }

  public get displayName(): string {
    return this.isRenamed && this._item.newRowId ? this._item.newRowId : this._item.rowId
  }

  public get oldRowId(): string | null | undefined {
    return this._item.oldRowId
  }

  public get fieldChangesCount(): number {
    return this._item.fieldChanges?.length ?? 0
  }

  public get hasFieldChanges(): boolean {
    return this.fieldChangesCount > 0
  }

  public get changeTypeBadgeColor(): string {
    return getChangeTypeBadgeColor(this._item.changeType)
  }

  public get changeTypeLabel(): string {
    return getChangeTypeLabel(this._item.changeType)
  }

  public get fullDisplayPath(): string {
    return `${this.tableId} / ${this.displayName}`
  }
}
