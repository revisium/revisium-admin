import { makeAutoObservable, observable } from 'mobx'
import { RowListItemFragment, TableViewsDataFragment } from 'src/__generated__/graphql-request'
import { JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore'
import { traverseValue } from 'src/entities/Schema/lib/traverseValue'
import { createJsonValueStore } from 'src/entities/Schema/model/value/createJsonValueStore'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { JsonValue } from 'src/entities/Schema/types/json.types'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { extractAvailableFields } from 'src/widgets/RowList/lib/extractAvailableFields'
import { getColumnBySchema } from 'src/widgets/RowList/lib/getColumnBySchema'
import { selectDefaultColumns } from 'src/widgets/RowList/lib/selectDefaultColumns'
import { sortFieldsByPriority } from 'src/widgets/RowList/lib/sortFieldsByPriority'
import { DEFAULT_ID_COLUMN_WIDTH, MIN_COLUMN_WIDTH } from 'src/widgets/RowList/config/constants'
import {
  ADDABLE_SYSTEM_FIELD_IDS,
  getSystemFieldConfigById,
  ROW_LEVEL_SYSTEM_FIELDS,
  SortableField,
} from 'src/widgets/RowList/config'
import { SystemFieldId } from './filterTypes'
import { InlineEditModel } from './InlineEditModel'
import { RowItemViewModel } from './RowItemViewModel'
import { AvailableField, ColumnType } from './types'

export interface SerializedColumnSettings {
  visibleColumnIds: string[]
  columnWidths: Record<string, number>
  idColumnWidth: number
}

const DEFAULT_VISIBLE_COLUMNS = 3

function buildSystemColumns(): AvailableField[] {
  return ADDABLE_SYSTEM_FIELD_IDS.map((id) => {
    const config = getSystemFieldConfigById(id)!
    return {
      nodeId: id,
      name: config.name,
      path: [],
      fieldType: config.fieldType,
      isSystemField: true,
      systemFieldId: id,
      isSystemColumn: true,
    }
  })
}

const SYSTEM_COLUMNS = buildSystemColumns()

interface CachedRowData {
  versionId: string
  rootValue: JsonValueStore
  cells: Map<string, JsonValueStore>
}

export class ColumnsModel {
  private _visibleColumnIds: string[] = []
  private _availableFields: AvailableField[] = []
  private _availableFieldsMap = new Map<string, AvailableField>()
  private _availableSystemFields: AvailableField[] = []
  private _schemaStore: ReturnType<typeof createJsonSchemaStore> | null = null
  private _rowCache = new Map<string, CachedRowData>()
  private _columnCache = new Map<string, ColumnType>()
  private _columnWidths = observable.map<string, number>()
  private _idColumnWidth = DEFAULT_ID_COLUMN_WIDTH
  private _onColumnsChange: (() => void) | null = null

  constructor() {
    makeAutoObservable<ColumnsModel, '_rowCache' | '_columnCache' | '_columnWidths' | '_availableFieldsMap'>(
      this,
      {
        _rowCache: false,
        _columnCache: false,
        _columnWidths: false,
        _availableFieldsMap: false,
      },
      { autoBind: true },
    )
  }

  private get _visibleColumnIdsSet(): Set<string> {
    return new Set(this._visibleColumnIds)
  }

  public get columns(): ColumnType[] {
    return this._visibleColumnIds
      .map((id) => this._availableFieldsMap.get(id))
      .filter((field): field is AvailableField => Boolean(field))
      .map((field) => this.getOrCreateColumn(field))
  }

  private getOrCreateColumn(field: AvailableField): ColumnType {
    const cached = this._columnCache.get(field.nodeId)
    if (cached) {
      return cached
    }

    const column: ColumnType = {
      id: field.nodeId,
      name: field.name,
      title: field.name,
      fieldType: field.fieldType,
      isSystemField: field.isSystemField,
      systemFieldId: field.systemFieldId,
      isSystemColumn: field.isSystemColumn,
      isFileObject: field.isFileObject,
    }
    this._columnCache.set(field.nodeId, column)
    return column
  }

  public get showHeader(): boolean {
    return this._availableFields.length > 0
  }

  public get availableFieldsToAdd(): AvailableField[] {
    const hidden = this._availableFields.filter((field) => {
      if (field.isFileObject && field.children) {
        const hasHiddenSelf = !this._visibleColumnIdsSet.has(field.nodeId)
        const hasHiddenChildren = field.children.some((child) => !this._visibleColumnIdsSet.has(child.nodeId))
        return hasHiddenSelf || hasHiddenChildren
      }
      return !this._visibleColumnIdsSet.has(field.nodeId)
    })
    return sortFieldsByPriority(hidden)
  }

  public get availableSystemFieldsToAdd(): AvailableField[] {
    return this._availableSystemFields.filter((field) => !this._visibleColumnIdsSet.has(field.nodeId))
  }

  public get hasHiddenColumns(): boolean {
    return this.availableFieldsToAdd.length > 0 || this.availableSystemFieldsToAdd.length > 0
  }

  public getAvailableFileChildren(field: AvailableField): AvailableField[] {
    if (!field.children) return []
    return field.children.filter((child) => !this._visibleColumnIdsSet.has(child.nodeId))
  }

  public isFileFieldFullyVisible(field: AvailableField): boolean {
    if (!field.isFileObject) return this._visibleColumnIdsSet.has(field.nodeId)
    const selfVisible = this._visibleColumnIdsSet.has(field.nodeId)
    const allChildrenVisible = field.children?.every((child) => this._visibleColumnIdsSet.has(child.nodeId)) ?? true
    return selfVisible && allChildrenVisible
  }

  public get canRemoveColumn(): boolean {
    return this._visibleColumnIds.length > 0
  }

  public get visibleColumnIds(): string[] {
    return this._visibleColumnIds
  }

  public setOnColumnsChange(callback: () => void): void {
    this._onColumnsChange = callback
  }

  private notifyColumnsChange(): void {
    if (this._onColumnsChange) {
      this._onColumnsChange()
    }
  }

  public get allAvailableFields(): AvailableField[] {
    return this._availableFields
  }

  public get sortableFields(): SortableField[] {
    const idConfig = getSystemFieldConfigById(SystemFieldId.Id)!
    const idField: SortableField = {
      nodeId: SystemFieldId.Id,
      name: idConfig.name,
      path: [],
      fieldType: idConfig.fieldType,
      isSystemField: true,
      systemFieldId: SystemFieldId.Id,
    }

    const dataFields: SortableField[] = []
    for (const f of this._availableFields) {
      if (f.isFileObject && f.children) {
        for (const child of f.children) {
          if (child.fieldType !== null) {
            dataFields.push({
              nodeId: child.nodeId,
              name: child.name,
              path: child.path,
              fieldType: child.fieldType,
              isSystemField: child.isSystemField,
              systemFieldId: child.systemFieldId,
            })
          }
        }
      } else if (f.fieldType !== null) {
        dataFields.push({
          nodeId: f.nodeId,
          name: f.name,
          path: f.path,
          fieldType: f.fieldType,
          isSystemField: f.isSystemField,
          systemFieldId: f.systemFieldId,
        })
      }
    }

    const systemFields: SortableField[] = this._availableSystemFields
      .filter((f) => f.fieldType !== null)
      .map((f) => ({
        nodeId: f.nodeId,
        name: f.name,
        path: f.path,
        fieldType: f.fieldType!,
        isSystemField: f.isSystemField,
        systemFieldId: f.systemFieldId,
      }))

    return [idField, ...dataFields, ...systemFields]
  }

  public isColumnVisible(nodeId: string): boolean {
    return this._visibleColumnIdsSet.has(nodeId)
  }

  public getColumnByNodeId(nodeId: string): ColumnType | undefined {
    const field = this._availableFields.find((f) => f.nodeId === nodeId)
    if (!field) return undefined
    return this.getOrCreateColumn(field)
  }

  public init(schema: JsonSchema, options?: { showAllColumns?: boolean }): void {
    this._schemaStore = createJsonSchemaStore(schema)
    this._rowCache.clear()
    this._columnCache.clear()
    this._columnWidths.clear()
    this._availableFieldsMap.clear()
    this._idColumnWidth = DEFAULT_ID_COLUMN_WIDTH

    const { fields, usedSystemFieldIds } = extractAvailableFields(this._schemaStore)
    this._availableFields = fields

    for (const field of this._availableFields) {
      this._availableFieldsMap.set(field.nodeId, field)
      if (field.children) {
        for (const child of field.children) {
          this._availableFieldsMap.set(child.nodeId, child)
        }
      }
    }

    this._availableSystemFields = SYSTEM_COLUMNS.filter(
      (sf) => !sf.systemFieldId || !usedSystemFieldIds.has(sf.systemFieldId),
    )

    for (const field of this._availableSystemFields) {
      this._availableFieldsMap.set(field.nodeId, field)
    }

    if (options?.showAllColumns) {
      this._visibleColumnIds = this._availableFields.map((item) => item.nodeId)
    } else {
      const defaultColumns = selectDefaultColumns(this._schemaStore, DEFAULT_VISIBLE_COLUMNS)
      this._visibleColumnIds = defaultColumns.map((item) => item.nodeId)
    }
  }

  public addColumn(nodeId: string): void {
    if (!this._visibleColumnIdsSet.has(nodeId)) {
      this._visibleColumnIds.push(nodeId)
      this.notifyColumnsChange()
    }
  }

  public insertColumnBefore(targetColumnId: string, newColumnId: string): void {
    if (this._visibleColumnIdsSet.has(newColumnId)) return
    const targetIndex = this._visibleColumnIds.indexOf(targetColumnId)
    if (targetIndex === -1) return

    this._visibleColumnIds.splice(targetIndex, 0, newColumnId)
    this.notifyColumnsChange()
  }

  public insertColumnAfter(targetColumnId: string, newColumnId: string): void {
    if (this._visibleColumnIdsSet.has(newColumnId)) return
    const targetIndex = this._visibleColumnIds.indexOf(targetColumnId)
    if (targetIndex === -1) return

    this._visibleColumnIds.splice(targetIndex + 1, 0, newColumnId)
    this.notifyColumnsChange()
  }

  public removeColumn(nodeId: string): void {
    if (!this.canRemoveColumn) return
    this._visibleColumnIds = this._visibleColumnIds.filter((id) => id !== nodeId)
    this.notifyColumnsChange()
  }

  public addAll(): void {
    this._visibleColumnIds = this._availableFields.map((f) => f.nodeId)
    this.notifyColumnsChange()
  }

  public hideAll(): void {
    this._visibleColumnIds = []
    this.notifyColumnsChange()
  }

  public get canHideAll(): boolean {
    return this._visibleColumnIds.length > 0
  }

  public reorderColumns(fromIndex: number, toIndex: number): void {
    const ids = [...this._visibleColumnIds]
    const [removed] = ids.splice(fromIndex, 1)
    ids.splice(toIndex, 0, removed)
    this._visibleColumnIds = ids
    this.notifyColumnsChange()
  }

  public getColumnIndex(columnId: string): number {
    return this._visibleColumnIds.indexOf(columnId)
  }

  public canMoveLeft(columnId: string): boolean {
    return this.getColumnIndex(columnId) > 0
  }

  public canMoveRight(columnId: string): boolean {
    const index = this.getColumnIndex(columnId)
    return index >= 0 && index < this._visibleColumnIds.length - 1
  }

  public canMoveToStart(columnId: string): boolean {
    return this.getColumnIndex(columnId) > 1
  }

  public canMoveToEnd(columnId: string): boolean {
    const index = this.getColumnIndex(columnId)
    return index >= 0 && index < this._visibleColumnIds.length - 2
  }

  public moveColumnLeft(columnId: string): void {
    const index = this.getColumnIndex(columnId)
    if (index > 0) {
      this.reorderColumns(index, index - 1)
    }
  }

  public moveColumnRight(columnId: string): void {
    const index = this.getColumnIndex(columnId)
    if (index >= 0 && index < this._visibleColumnIds.length - 1) {
      this.reorderColumns(index, index + 1)
    }
  }

  public moveColumnToStart(columnId: string): void {
    const index = this.getColumnIndex(columnId)
    if (index > 0) {
      this.reorderColumns(index, 0)
    }
  }

  public moveColumnToEnd(columnId: string): void {
    const index = this.getColumnIndex(columnId)
    if (index >= 0 && index < this._visibleColumnIds.length - 1) {
      this.reorderColumns(index, this._visibleColumnIds.length - 1)
    }
  }

  public setColumnWidth(columnId: string, width: number): void {
    const clampedWidth = Math.max(MIN_COLUMN_WIDTH, width)
    this._columnWidths.set(columnId, clampedWidth)
    this.notifyColumnsChange()
  }

  public get idColumnWidth(): number {
    return this._idColumnWidth
  }

  public setIdColumnWidth(width: number): void {
    this._idColumnWidth = Math.max(MIN_COLUMN_WIDTH, width)
    this.notifyColumnsChange()
  }

  public getColumnWidth(columnId: string): number {
    const customWidth = this._columnWidths.get(columnId)
    if (customWidth !== undefined) {
      return customWidth
    }
    const field = this._availableFieldsMap.get(columnId)
    return field?.schemaStore ? getColumnBySchema(field.schemaStore) : 200
  }

  public createRowViewModels(
    rows: RowListItemFragment[],
    options: {
      isEdit: boolean
      permissionContext: PermissionContext
      inlineEditModel: InlineEditModel
      onDelete: (rowId: string) => Promise<boolean>
    },
  ): RowItemViewModel[] {
    const schemaStore = this._schemaStore
    if (!schemaStore) {
      return []
    }

    const currentRowIds = new Set(rows.map((r) => r.id))
    this.cleanupStaleCache(currentRowIds)

    return rows.map((row) => {
      const cachedData = this.getOrCreateCachedRowData(schemaStore, row)

      return new RowItemViewModel({
        item: row,
        cellsMap: cachedData.cells,
        isEdit: options.isEdit,
        permissionContext: options.permissionContext,
        inlineEditModel: options.inlineEditModel,
        onDelete: options.onDelete,
      })
    })
  }

  public getVisibleCells(cellsMap: Map<string, JsonValueStore>): JsonValueStore[] {
    return this._visibleColumnIds
      .map((nodeId) => cellsMap.get(nodeId))
      .filter((cell): cell is JsonValueStore => cell !== undefined)
  }

  private cleanupStaleCache(currentRowIds: Set<string>): void {
    for (const cachedRowId of this._rowCache.keys()) {
      if (!currentRowIds.has(cachedRowId)) {
        this._rowCache.delete(cachedRowId)
      }
    }
  }

  private getOrCreateCachedRowData(
    schemaStore: ReturnType<typeof createJsonSchemaStore>,
    row: RowListItemFragment,
  ): CachedRowData {
    const cached = this._rowCache.get(row.id)

    if (cached && cached.versionId === row.versionId) {
      return cached
    }

    const rootValue = createJsonValueStore(schemaStore, row.id, (row.data ?? {}) as JsonValue)
    const cells = new Map<string, JsonValueStore>()

    traverseValue(rootValue, (node) => {
      cells.set(node.schema.nodeId, node)

      if (node.type === JsonSchemaTypeName.Object && node.$ref === SystemSchemaIds.File) {
        for (const [propName, propValue] of Object.entries(node.value)) {
          const syntheticNodeId = `${node.schema.nodeId}:${propName}`
          cells.set(syntheticNodeId, propValue)
        }
      }
    })

    const newCachedData: CachedRowData = { versionId: row.versionId, rootValue, cells }
    this._rowCache.set(row.id, newCachedData)

    return newCachedData
  }

  public restoreFromView(view: TableViewsDataFragment['views'][0] | undefined): void {
    if (!view || !view.columns) {
      if (this._schemaStore) {
        const defaultColumns = selectDefaultColumns(this._schemaStore, DEFAULT_VISIBLE_COLUMNS)
        this._visibleColumnIds = defaultColumns.map((item) => item.nodeId)
      } else {
        this._visibleColumnIds = this._availableFields.map((f) => f.nodeId)
      }
      this._columnWidths.clear()
      this._idColumnWidth = DEFAULT_ID_COLUMN_WIDTH
      return
    }

    const validColumnIds = view.columns
      .map((col) => this.fieldToColumnId(col.field))
      .filter((id) => this._availableFieldsMap.has(id))

    this._visibleColumnIds = validColumnIds

    this._columnWidths.clear()

    for (const col of view.columns) {
      if (col.width != null) {
        const columnId = this.fieldToColumnId(col.field)
        if (this._availableFieldsMap.has(columnId)) {
          this._columnWidths.set(columnId, Math.max(MIN_COLUMN_WIDTH, col.width))
        }
      }
    }

    // Check for id column width (special field name)
    const idCol = view.columns.find((col) => col.field === 'id')
    if (idCol?.width != null) {
      this._idColumnWidth = Math.max(MIN_COLUMN_WIDTH, idCol.width)
    } else {
      this._idColumnWidth = DEFAULT_ID_COLUMN_WIDTH
    }
  }

  public serializeToViewColumns(): Array<{ field: string; width?: number }> {
    const columns: Array<{ field: string; width?: number }> = []

    const idColumn: { field: string; width?: number } = { field: 'id' }
    if (this._idColumnWidth !== DEFAULT_ID_COLUMN_WIDTH) {
      idColumn.width = this._idColumnWidth
    }
    columns.push(idColumn)

    for (const columnId of this._visibleColumnIds) {
      const field = this._availableFieldsMap.get(columnId)
      if (field) {
        const customWidth = this._columnWidths.get(columnId)
        const column: { field: string; width?: number } = {
          field: this.columnIdToField(columnId),
        }
        if (customWidth !== undefined) {
          column.width = customWidth
        }
        columns.push(column)
      }
    }

    return columns
  }

  private fieldToColumnId(field: string): string {
    if (!field.startsWith('data.')) {
      return field
    }

    const fieldName = field.slice(5) // Remove "data." prefix

    for (const [nodeId, availableField] of this._availableFieldsMap.entries()) {
      if (availableField.name === fieldName) {
        return nodeId
      }
    }

    return field
  }

  private columnIdToField(columnId: string): string {
    const field = this._availableFieldsMap.get(columnId)
    if (!field) {
      return columnId
    }

    if (field.systemFieldId && ROW_LEVEL_SYSTEM_FIELDS.has(field.systemFieldId as SystemFieldId)) {
      return field.systemFieldId
    }

    return `data.${field.name}`
  }
}
