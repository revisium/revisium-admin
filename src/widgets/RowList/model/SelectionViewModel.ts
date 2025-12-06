import { makeAutoObservable, observable } from 'mobx'

export class SelectionViewModel {
  private readonly _selectedRowIds = observable.map<string, boolean>()
  private _isSelectionMode = false
  private _isConfirmDeleteOpen = false
  private _pendingDeleteRowId: string | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isConfirmDeleteOpen(): boolean {
    return this._isConfirmDeleteOpen
  }

  public get deleteCount(): number {
    return this._pendingDeleteRowId ? 1 : this._selectedRowIds.size
  }

  public get rowIdsToDelete(): string[] {
    return this._pendingDeleteRowId ? [this._pendingDeleteRowId] : Array.from(this._selectedRowIds.keys())
  }

  public requestSingleDelete(rowId: string): void {
    this._pendingDeleteRowId = rowId
    this._isConfirmDeleteOpen = true
  }

  public openDeleteConfirmation(): void {
    this._isConfirmDeleteOpen = true
  }

  public closeDeleteConfirmation(): void {
    this._isConfirmDeleteOpen = false
    this._pendingDeleteRowId = null
  }

  public get isSelectionMode(): boolean {
    return this._isSelectionMode
  }

  public get selectedRowIds(): string[] {
    return Array.from(this._selectedRowIds.keys())
  }

  public get selectedCount(): number {
    return this._selectedRowIds.size
  }

  public get hasSelection(): boolean {
    return this._selectedRowIds.size > 0
  }

  public enterSelectionMode(rowId?: string): void {
    this._isSelectionMode = true
    if (rowId) {
      this._selectedRowIds.set(rowId, true)
    }
  }

  public exitSelectionMode(): void {
    this._isSelectionMode = false
    this._selectedRowIds.clear()
  }

  public isSelected(rowId: string): boolean {
    return this._selectedRowIds.get(rowId) === true
  }

  public toggle(rowId: string): void {
    if (this._selectedRowIds.has(rowId)) {
      this._selectedRowIds.delete(rowId)
    } else {
      this._selectedRowIds.set(rowId, true)
    }
  }

  public select(rowId: string): void {
    this._selectedRowIds.set(rowId, true)
  }

  public deselect(rowId: string): void {
    this._selectedRowIds.delete(rowId)
  }

  public selectAll(rowIds: string[]): void {
    for (const rowId of rowIds) {
      this._selectedRowIds.set(rowId, true)
    }
  }

  public deselectAll(): void {
    this._selectedRowIds.clear()
  }

  public toggleAll(rowIds: string[]): void {
    const allSelected = rowIds.every((id) => this._selectedRowIds.has(id))
    if (allSelected) {
      this.deselectAll()
    } else {
      this.selectAll(rowIds)
    }
  }

  public isAllSelected(rowIds: string[]): boolean {
    if (rowIds.length === 0) return false
    return rowIds.every((id) => this._selectedRowIds.has(id))
  }

  public isSomeSelected(rowIds: string[]): boolean {
    if (rowIds.length === 0) return false
    const selectedCount = rowIds.filter((id) => this._selectedRowIds.has(id)).length
    return selectedCount > 0 && selectedCount < rowIds.length
  }

  public removeDeletedRows(deletedRowIds: string[]): void {
    for (const rowId of deletedRowIds) {
      this._selectedRowIds.delete(rowId)
    }
  }
}
