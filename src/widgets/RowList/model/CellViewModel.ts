import { makeAutoObservable } from 'mobx'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store'
import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { CellPosition } from '../lib/getClickOffset'
import { InlineEditModel } from './InlineEditModel'

export type FieldType = 'string' | 'number' | 'boolean' | 'foreignKey' | 'file' | 'object' | 'array'
export type CellState = 'display' | 'focused' | 'editing' | 'saving' | 'error' | 'readonly'

export class CellViewModel {
  constructor(
    private readonly _rowId: string,
    private readonly _columnId: string,
    private readonly _store: JsonValueStore,
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

  public get store(): JsonValueStore {
    return this._store
  }

  public get isRevisionReadonly(): boolean {
    return this._isRevisionReadonly
  }

  public get fieldType(): FieldType {
    if (this._store instanceof JsonStringValueStore) {
      if (this._store.foreignKey) {
        return 'foreignKey'
      }
      return 'string'
    }
    if (this._store instanceof JsonNumberValueStore) {
      return 'number'
    }
    if (this._store instanceof JsonBooleanValueStore) {
      return 'boolean'
    }
    if (this._store instanceof JsonObjectValueStore) {
      if (this._store.$ref === SystemSchemaIds.File) {
        return 'file'
      }
      return 'object'
    }
    if (this._store instanceof JsonArrayValueStore) {
      return 'array'
    }
    return 'string'
  }

  public get isReadonly(): boolean {
    if (this._isRevisionReadonly) {
      return true
    }
    if (this._store instanceof JsonStringValueStore && this._store.readOnly) {
      return true
    }
    if (this._store instanceof JsonNumberValueStore && this._store.readOnly) {
      return true
    }
    if (this._store instanceof JsonBooleanValueStore && this._store.readOnly) {
      return true
    }
    if (this.fieldType === 'file' || this.fieldType === 'object' || this.fieldType === 'array') {
      return true
    }
    return false
  }

  public get displayValue(): string {
    if (this._store instanceof JsonStringValueStore) {
      return this._store.value
    }
    if (this._store instanceof JsonNumberValueStore) {
      return String(this._store.value)
    }
    if (this._store instanceof JsonBooleanValueStore) {
      return String(this._store.getPlainValue())
    }
    if (this._store instanceof JsonObjectValueStore) {
      return '{...}'
    }
    if (this._store instanceof JsonArrayValueStore) {
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
    if (this.isReadonly) {
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
    if (this._store instanceof JsonStringValueStore) {
      return this._store.foreignKey
    }
    return undefined
  }

  public get numberDefault(): number {
    if (this._store instanceof JsonNumberValueStore) {
      return this._store.schema.default !== null ? this._store.schema.default : 0
    }
    return 0
  }

  public get stringValue(): string {
    if (this._store instanceof JsonStringValueStore) {
      return this._store.value
    }
    if (this._store instanceof JsonNumberValueStore) {
      return String(this._store.value ?? this.numberDefault)
    }
    return ''
  }

  public get booleanValue(): boolean {
    if (this._store instanceof JsonBooleanValueStore) {
      return this._store.getPlainValue()
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
    if (this.isReadonly) {
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
