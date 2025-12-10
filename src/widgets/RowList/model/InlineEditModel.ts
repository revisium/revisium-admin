import { makeAutoObservable } from 'mobx'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { CellPosition } from '../lib/getClickOffset'
import { CellSaveService } from './CellSaveService'

export interface CellRef {
  rowId: string
  field: string
}

export type NavigationDirection = 'up' | 'down' | 'left' | 'right'

export interface InlineEditContext {
  revisionId: string
  tableId: string
  getVisibleFields: () => string[]
  getVisibleRowIds: () => string[]
  getCellStore: (rowId: string, field: string) => JsonValueStore | undefined
  isCellReadonly: (rowId: string, field: string) => boolean
  onCellUpdated?: (rowId: string, field: string, value: string | number | boolean) => void
}

export class InlineEditModel {
  private _focusedCell: CellRef | null = null
  private _editingCell: CellRef | null = null
  private _clickOffset: number | undefined = undefined
  private _cellPosition: CellPosition | undefined = undefined
  private _context: InlineEditContext | null = null

  private readonly _saveService = new CellSaveService()

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public init(context: InlineEditContext): void {
    this._context = context
  }

  public dispose(): void {
    this._focusedCell = null
    this._editingCell = null
    this._saveService.dispose()
    this._context = null
  }

  public get focusedCell(): CellRef | null {
    return this._focusedCell
  }

  public get editingCell(): CellRef | null {
    return this._editingCell
  }

  public get isEditing(): boolean {
    return this._editingCell !== null
  }

  public get clickOffset(): number | undefined {
    return this._clickOffset
  }

  public get cellPosition(): CellPosition | undefined {
    return this._cellPosition
  }

  public get hasFocus(): boolean {
    return this._focusedCell !== null
  }

  public get canChangeFocus(): boolean {
    return this._editingCell === null
  }

  public isFocused(rowId: string, field: string): boolean {
    return this._focusedCell?.rowId === rowId && this._focusedCell?.field === field
  }

  public isCellEditing(rowId: string, field: string): boolean {
    return this._editingCell?.rowId === rowId && this._editingCell?.field === field
  }

  public isRowEditing(rowId: string): boolean {
    return this._editingCell?.rowId === rowId
  }

  public isSaving(rowId: string, field: string): boolean {
    return this._saveService.isSaving(rowId, field)
  }

  public getError(rowId: string, field: string): string | undefined {
    return this._saveService.getError(rowId, field)
  }

  public hasError(rowId: string, field: string): boolean {
    return this._saveService.hasError(rowId, field)
  }

  public clearError(rowId: string, field: string): void {
    this._saveService.clearError(rowId, field)
  }

  public focusCell(rowId: string, field: string): void {
    if (!this.canChangeFocus) {
      return
    }
    this._focusedCell = { rowId, field }
  }

  public clearFocus(): void {
    if (!this.canChangeFocus) {
      return
    }
    this._focusedCell = null
  }

  public moveFocus(direction: NavigationDirection): void {
    if (!this._focusedCell || !this._context || !this.canChangeFocus) {
      return
    }

    const { newRowIndex, newFieldIndex } = this.calculateNewPosition(direction)
    if (newRowIndex === -1 || newFieldIndex === -1) {
      return
    }

    const fields = this._context.getVisibleFields()
    const rowIds = this._context.getVisibleRowIds()

    this._focusedCell = {
      rowId: rowIds[newRowIndex],
      field: fields[newFieldIndex],
    }
  }

  public moveFocusToNext(): void {
    if (!this._focusedCell || !this._context) {
      return
    }

    const fields = this._context.getVisibleFields()
    const rowIds = this._context.getVisibleRowIds()

    const currentFieldIndex = fields.indexOf(this._focusedCell.field)
    const currentRowIndex = rowIds.indexOf(this._focusedCell.rowId)

    if (currentFieldIndex === -1 || currentRowIndex === -1) {
      return
    }

    let newFieldIndex = currentFieldIndex + 1
    let newRowIndex = currentRowIndex

    if (newFieldIndex >= fields.length) {
      newFieldIndex = 0
      newRowIndex = currentRowIndex + 1
    }

    if (newRowIndex >= rowIds.length) {
      newRowIndex = rowIds.length - 1
      newFieldIndex = fields.length - 1
    }

    this._focusedCell = {
      rowId: rowIds[newRowIndex],
      field: fields[newFieldIndex],
    }
  }

  public moveFocusToPrev(): void {
    if (!this._focusedCell || !this._context) {
      return
    }

    const fields = this._context.getVisibleFields()
    const rowIds = this._context.getVisibleRowIds()

    const currentFieldIndex = fields.indexOf(this._focusedCell.field)
    const currentRowIndex = rowIds.indexOf(this._focusedCell.rowId)

    if (currentFieldIndex === -1 || currentRowIndex === -1) {
      return
    }

    let newFieldIndex = currentFieldIndex - 1
    let newRowIndex = currentRowIndex

    if (newFieldIndex < 0) {
      newFieldIndex = fields.length - 1
      newRowIndex = currentRowIndex - 1
    }

    if (newRowIndex < 0) {
      newRowIndex = 0
      newFieldIndex = 0
    }

    this._focusedCell = {
      rowId: rowIds[newRowIndex],
      field: fields[newFieldIndex],
    }
  }

  public enterEditMode(clickOffset?: number, cellPosition?: CellPosition): void {
    if (!this._focusedCell || !this._context) {
      return
    }

    if (this._context.isCellReadonly(this._focusedCell.rowId, this._focusedCell.field)) {
      return
    }

    this._editingCell = { ...this._focusedCell }
    this._clickOffset = clickOffset
    this._cellPosition = cellPosition
  }

  public exitEditMode(save: boolean = true): void {
    if (!save && this._focusedCell) {
      this._saveService.clearError(this._focusedCell.rowId, this._focusedCell.field)
    }
    this._editingCell = null
    this._clickOffset = undefined
    this._cellPosition = undefined
  }

  public commitAndMoveDown(): void {
    this.exitEditMode(true)
    this.moveFocus('down')
  }

  public commitAndMoveRight(): void {
    this.exitEditMode(true)
    this.moveFocusToNext()
  }

  public commitAndMoveLeft(): void {
    this.exitEditMode(true)
    this.moveFocusToPrev()
  }

  public cancelEdit(): void {
    this.exitEditMode(false)
  }

  public async saveCell(
    rowId: string,
    columnId: string,
    fieldName: string,
    value: string | number | boolean,
  ): Promise<boolean> {
    if (!this._context) {
      return false
    }

    const store = this._context.getCellStore(rowId, columnId)
    const context = this._context

    return this._saveService.save(
      { revisionId: context.revisionId, tableId: context.tableId },
      rowId,
      columnId,
      fieldName,
      value,
      store,
      () => context.onCellUpdated?.(rowId, columnId, value),
    )
  }

  private calculateNewPosition(direction: NavigationDirection): { newRowIndex: number; newFieldIndex: number } {
    if (!this._focusedCell || !this._context) {
      return { newRowIndex: -1, newFieldIndex: -1 }
    }

    const fields = this._context.getVisibleFields()
    const rowIds = this._context.getVisibleRowIds()

    const currentFieldIndex = fields.indexOf(this._focusedCell.field)
    const currentRowIndex = rowIds.indexOf(this._focusedCell.rowId)

    if (currentFieldIndex === -1 || currentRowIndex === -1) {
      return { newRowIndex: -1, newFieldIndex: -1 }
    }

    let newFieldIndex = currentFieldIndex
    let newRowIndex = currentRowIndex

    switch (direction) {
      case 'left':
        newFieldIndex = Math.max(0, currentFieldIndex - 1)
        break
      case 'right':
        newFieldIndex = Math.min(fields.length - 1, currentFieldIndex + 1)
        break
      case 'up':
        newRowIndex = Math.max(0, currentRowIndex - 1)
        break
      case 'down':
        newRowIndex = Math.min(rowIds.length - 1, currentRowIndex + 1)
        break
    }

    return { newRowIndex, newFieldIndex }
  }
}
