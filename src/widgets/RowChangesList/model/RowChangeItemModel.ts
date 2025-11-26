import { makeAutoObservable } from 'mobx'
import { ChangeType, GetRowChangesQuery } from 'src/__generated__/graphql-request'
import {
  getChangeTypeBadgeColor,
  getChangeTypeLabel,
  isAddedRowChange,
  isRemovedRowChange,
  isModifiedRowChange,
} from 'src/entities/Changes'

export type RowChangeItem = GetRowChangesQuery['rowChanges']['edges'][number]['node']

export class RowChangeItemModel {
  constructor(private _item: RowChangeItem) {
    makeAutoObservable(this)
  }

  public get item(): RowChangeItem {
    return this._item
  }

  public get tableId(): string {
    if (isAddedRowChange(this._item)) {
      return this._item.table.id
    }
    if (isRemovedRowChange(this._item)) {
      return this._item.fromTable.id
    }
    if (isModifiedRowChange(this._item)) {
      return this._item.table.id
    }
    return ''
  }

  public get rowId(): string {
    if (isAddedRowChange(this._item)) {
      return this._item.row.id
    }
    if (isRemovedRowChange(this._item)) {
      return this._item.fromRow.id
    }
    if (isModifiedRowChange(this._item)) {
      return this._item.row.id
    }
    return ''
  }

  public get changeType(): string {
    return this._item.changeType
  }

  public get isRenamed(): boolean {
    return this._item.changeType === ChangeType.Renamed || this._item.changeType === ChangeType.RenamedAndModified
  }

  public get displayName(): string {
    if (this.isRenamed && isModifiedRowChange(this._item)) {
      return this._item.row.id
    }
    return this.rowId
  }

  public get oldRowId(): string | null {
    if (this.isRenamed && isModifiedRowChange(this._item)) {
      return this._item.fromRow.id
    }
    return null
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
