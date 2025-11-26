import { makeAutoObservable } from 'mobx'
import { ChangeType, GetRowChangesQuery } from 'src/__generated__/graphql-request'
import {
  getChangeTypeBadgeColor,
  getChangeTypeLabel,
  isAddedRowChange,
  isRemovedRowChange,
  isModifiedRowChange,
} from 'src/entities/Changes'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker'

type RowChangeItem = GetRowChangesQuery['rowChanges']['edges'][number]['node']

export class RowDetailModalModel {
  private _item: RowChangeItem | null = null
  private _isOpen = false

  constructor(private linkMaker: LinkMaker) {
    makeAutoObservable(this)
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get item(): RowChangeItem | null {
    return this._item
  }

  public get rowId(): string {
    if (!this._item) return ''
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

  public get tableId(): string {
    if (!this._item) return ''
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

  public get changeType(): string {
    return this._item?.changeType ?? ''
  }

  public get isRenamed(): boolean {
    return this.changeType === ChangeType.Renamed || this.changeType === ChangeType.RenamedAndModified
  }

  public get displayName(): string {
    if (!this._item) return ''
    if (this.isRenamed && isModifiedRowChange(this._item)) {
      return this._item.row.id
    }
    return this.rowId
  }

  public get oldRowId(): string | null {
    if (!this._item) return null
    if (this.isRenamed && isModifiedRowChange(this._item)) {
      return this._item.fromRow.id
    }
    return null
  }

  public get hasFieldChanges(): boolean {
    return (this._item?.fieldChanges?.length ?? 0) > 0
  }

  public get fieldChanges() {
    return this._item?.fieldChanges ?? []
  }

  public get fieldChangesCount(): number {
    return this.fieldChanges.length
  }

  public get changeTypeBadgeColor(): string {
    return getChangeTypeBadgeColor(this.changeType)
  }

  public get changeTypeLabel(): string {
    return getChangeTypeLabel(this.changeType)
  }

  public get tableLink(): string {
    return `${this.linkMaker.currentBaseLink}/${this.tableId}`
  }

  public get rowLink(): string {
    return `${this.linkMaker.currentBaseLink}/${this.tableId}/${this.displayName}`
  }

  public open(item: RowChangeItem): void {
    this._item = item
    this._isOpen = true
  }

  public close(): void {
    this._isOpen = false
    this._item = null
  }
}
