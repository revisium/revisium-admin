import { makeAutoObservable } from 'mobx'
import { type ValueNode } from '@revisium/schema-toolkit-ui'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { CellPosition } from '../lib/getClickOffset'
import { InlineEditModel } from './InlineEditModel'

export type FieldType = 'string' | 'number' | 'boolean' | 'foreignKey' | 'file' | 'object' | 'array'
export type CellState = 'display' | 'focused' | 'editing' | 'saving' | 'error' | 'readonly'

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = bytes / Math.pow(k, i)
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export class CellViewModel {
  constructor(
    private readonly _rowId: string,
    private readonly _columnId: string,
    private readonly _node: ValueNode,
    private readonly _inlineEditModel: InlineEditModel,
    private readonly _isRevisionReadonly: boolean,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get rowId(): string {
    return this._rowId
  }

  public get columnId(): string {
    return this._columnId
  }

  public get node(): ValueNode {
    return this._node
  }

  public get isRevisionReadonly(): boolean {
    return this._isRevisionReadonly
  }

  private getSchemaField<K extends string>(key: K): unknown {
    return (this._node.schema as Record<string, unknown>)[key]
  }

  public get fieldType(): FieldType {
    if (this._node.isPrimitive()) {
      if (this.getSchemaField('foreignKey')) {
        return 'foreignKey'
      }
      if (this._node.type === 'string') {
        return 'string'
      }
      if (this._node.type === 'number') {
        return 'number'
      }
      if (this._node.type === 'boolean') {
        return 'boolean'
      }
    }
    if (this._node.isObject()) {
      if (this.getSchemaField('$ref') === SystemSchemaIds.File) {
        return 'file'
      }
      return 'object'
    }
    if (this._node.isArray()) {
      return 'array'
    }
    return 'string'
  }

  public get isReadonly(): boolean {
    if (this._isRevisionReadonly) {
      return true
    }
    if (this._node.isPrimitive() && this._node.isReadOnly) {
      return true
    }
    if (this.fieldType === 'file' || this.fieldType === 'object' || this.fieldType === 'array') {
      return true
    }
    return false
  }

  public get supportsViewMode(): boolean {
    if (!this._isRevisionReadonly) {
      return false
    }
    return this.fieldType === 'string' || this.fieldType === 'number'
  }

  public get isFileSizeField(): boolean {
    return this._columnId.endsWith(':size')
  }

  public get sizeTooltip(): string | undefined {
    if (!this.isFileSizeField) {
      return undefined
    }
    if (this._node.isPrimitive() && this._node.type === 'number') {
      const bytes = this._node.value as number
      if (bytes === null || bytes === undefined) {
        return undefined
      }
      return `${bytes.toLocaleString()} bytes`
    }
    return undefined
  }

  public get rawValue(): number | string | boolean | null {
    if (this._node.isPrimitive()) {
      return this._node.value as number | string | boolean
    }
    return null
  }

  public get displayValue(): string {
    if (this._node.isPrimitive()) {
      const value = this._node.value
      if (this._node.type === 'number') {
        if (value === null || value === undefined) {
          return ''
        }
        if (this.isFileSizeField) {
          return formatFileSize(value as number)
        }
        return String(value)
      }
      if (this._node.type === 'boolean') {
        return String(value)
      }
      return String(value ?? '')
    }
    if (this._node.isObject()) {
      return '{...}'
    }
    if (this._node.isArray()) {
      return '[...]'
    }
    return ''
  }

  public get isFocused(): boolean {
    return this._inlineEditModel.isFocused(this._rowId, this._columnId)
  }

  public get isEditing(): boolean {
    return this._inlineEditModel.isCellEditing(this._rowId, this._columnId)
  }

  public get isSaving(): boolean {
    return this._inlineEditModel.isSaving(this._rowId, this._columnId)
  }

  public get error(): string | undefined {
    return this._inlineEditModel.getError(this._rowId, this._columnId)
  }

  public get cellState(): CellState {
    if (this.isReadonly && !this.supportsViewMode) {
      return 'readonly'
    }
    if (this.error) {
      return 'error'
    }
    if (this.isSaving) {
      return 'saving'
    }
    if (this.isEditing) {
      return 'editing'
    }
    if (this.isFocused) {
      return 'focused'
    }
    return 'display'
  }

  public get foreignKey(): string | undefined {
    if (this._node.isPrimitive()) {
      return this.getSchemaField('foreignKey') as string | undefined
    }
    return undefined
  }

  public get numberDefault(): number {
    if (this._node.isPrimitive() && this._node.type === 'number') {
      return (this.getSchemaField('default') as number) ?? 0
    }
    return 0
  }

  public get stringValue(): string {
    if (this._node.isPrimitive()) {
      if (this._node.type === 'string') {
        return this._node.value as string
      }
      if (this._node.type === 'number') {
        const value = this._node.value as number | null
        return String(value ?? this.numberDefault)
      }
    }
    return ''
  }

  public get booleanValue(): boolean {
    if (this._node.isPrimitive() && this._node.type === 'boolean') {
      return this._node.value as boolean
    }
    return false
  }

  public get clickOffset(): number | undefined {
    return this._inlineEditModel.clickOffset
  }

  public get cellPosition(): CellPosition | undefined {
    return this._inlineEditModel.cellPosition
  }

  public focus(): void {
    this._inlineEditModel.focusCell(this._rowId, this._columnId)
  }

  public enterEditMode(clickOffset?: number, position?: CellPosition): void {
    if (this.isReadonly && !this.supportsViewMode) {
      return
    }
    this._inlineEditModel.focusCell(this._rowId, this._columnId)
    this._inlineEditModel.enterEditMode(clickOffset, position)
  }

  public async save(fieldName: string, value: string | number | boolean): Promise<boolean> {
    this._inlineEditModel.exitEditMode(true)
    return this._inlineEditModel.saveCell(this._rowId, this._columnId, fieldName, value)
  }

  public cancelEdit(): void {
    this._inlineEditModel.exitEditMode(false)
  }

  public commitAndMove(direction: 'down' | 'next' | 'prev'): void {
    switch (direction) {
      case 'down':
        this._inlineEditModel.commitAndMoveDown()
        break
      case 'next':
        this._inlineEditModel.commitAndMoveRight()
        break
      case 'prev':
        this._inlineEditModel.commitAndMoveLeft()
        break
    }
  }
}
