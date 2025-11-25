import { makeAutoObservable } from 'mobx'
import { GetTableChangesQuery } from 'src/__generated__/graphql-request'
import { getChangeTypeBadgeColor, getChangeTypeLabel } from 'src/entities/Changes'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker'

type TableChangeItem = GetTableChangesQuery['tableChanges']['edges'][number]['node']

export class TableDetailModalModel {
  private _item: TableChangeItem | null = null
  private _isOpen = false

  constructor(private linkMaker: LinkMaker) {
    makeAutoObservable(this)
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get item(): TableChangeItem | null {
    return this._item
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
    if (this.isRenamed && this._item?.newTableId) {
      return this._item.newTableId
    }
    return this.tableId
  }

  public get oldTableId(): string | null {
    return this._item?.oldTableId ?? null
  }

  public get hasSchemaChanges(): boolean {
    return (this._item?.schemaMigrations?.length ?? 0) > 0
  }

  public get schemaMigrations() {
    return this._item?.schemaMigrations ?? []
  }

  public get schemaMigrationsCount(): number {
    return this.schemaMigrations.length
  }

  public get hasRowChanges(): boolean {
    return (this._item?.rowChangesCount ?? 0) > 0
  }

  public get rowChangesCount(): number {
    return this._item?.rowChangesCount ?? 0
  }

  public get addedRowsCount(): number {
    return this._item?.addedRowsCount ?? 0
  }

  public get modifiedRowsCount(): number {
    return this._item?.modifiedRowsCount ?? 0
  }

  public get removedRowsCount(): number {
    return this._item?.removedRowsCount ?? 0
  }

  public get renamedRowsCount(): number {
    return this._item?.renamedRowsCount ?? 0
  }

  public get changeTypeBadgeColor(): string {
    return getChangeTypeBadgeColor(this.changeType)
  }

  public get changeTypeLabel(): string {
    return getChangeTypeLabel(this.changeType)
  }

  public get tableLink(): string {
    return `${this.linkMaker.currentBaseLink}/${this.displayName}`
  }

  public get rowChangesLink(): string {
    return `rows?table=${encodeURIComponent(this.tableId)}`
  }

  public open(item: TableChangeItem): void {
    this._item = item
    this._isOpen = true
  }

  public close(): void {
    this._isOpen = false
    this._item = null
  }
}
