import { makeAutoObservable } from 'mobx'
import { GetRowChangesQuery } from 'src/__generated__/graphql-request'
import { getChangeTypeBadgeColor, getChangeTypeLabel } from 'src/entities/Changes'
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
    return this._item?.rowId ?? ''
  }

  public get tableId(): string {
    return this._item?.tableId ?? ''
  }

  public get changeType(): string {
    return this._item?.changeType ?? ''
  }

  public get isRenamed(): boolean {
    return this.changeType === 'RENAMED' || this.changeType === 'RENAMED_AND_MODIFIED'
  }

  public get displayName(): string {
    if (this.isRenamed && this._item?.newRowId) {
      return this._item.newRowId
    }
    return this.rowId
  }

  public get oldRowId(): string | null {
    return this._item?.oldRowId ?? null
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
