import { makeAutoObservable } from 'mobx'
import { RowListItemFragment } from 'src/__generated__/graphql-request'
import { JsonSchema } from 'src/entities/Schema'
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
import { RowItemViewModel } from './RowItemViewModel'
import { AvailableField, ColumnType } from './types'

const DEFAULT_VISIBLE_COLUMNS = 3

interface CachedRowData {
  versionId: string
  rootValue: JsonValueStore
  cells: Map<string, JsonValueStore>
}

export class ColumnsModel {
  private _visibleColumnIds: string[] = []
  private _visibleColumnIdsSet = new Set<string>()
  private _availableFields: AvailableField[] = []
  private _schemaStore: ReturnType<typeof createJsonSchemaStore> | null = null
  private _rowCache = new Map<string, CachedRowData>()
  private _columnCache = new Map<string, ColumnType>()

  constructor() {
    makeAutoObservable<ColumnsModel, '_rowCache' | '_columnCache' | '_visibleColumnIdsSet'>(
      this,
      { _rowCache: false, _columnCache: false, _visibleColumnIdsSet: false },
      { autoBind: true },
    )
  }

  public get columns(): ColumnType[] {
    return this._visibleColumnIds
      .map((id) => this._availableFields.find((f) => f.nodeId === id))
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
      title: field.name,
      width: getColumnBySchema(field.schemaStore),
      fieldType: field.fieldType,
    }
    this._columnCache.set(field.nodeId, column)
    return column
  }

  public get showHeader(): boolean {
    return this._availableFields.length > 0
  }

  public get availableFieldsToAdd(): AvailableField[] {
    const visibleSet = new Set(this._visibleColumnIds)
    const hidden = this._availableFields.filter((field) => !visibleSet.has(field.nodeId))
    return sortFieldsByPriority(hidden)
  }

  public get hasHiddenColumns(): boolean {
    return this.availableFieldsToAdd.length > 0
  }

  public get canRemoveColumn(): boolean {
    return this._visibleColumnIds.length > 0
  }

  public get visibleColumnIds(): string[] {
    return this._visibleColumnIds
  }

  public get allAvailableFields(): AvailableField[] {
    return this._availableFields
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

    this._availableFields = extractAvailableFields(this._schemaStore)

    if (options?.showAllColumns) {
      this._visibleColumnIds = this._availableFields.map((item) => item.nodeId)
    } else {
      const defaultColumns = selectDefaultColumns(this._schemaStore, DEFAULT_VISIBLE_COLUMNS)
      this._visibleColumnIds = defaultColumns.map((item) => item.nodeId)
    }
    this._visibleColumnIdsSet = new Set(this._visibleColumnIds)
  }

  public addColumn(nodeId: string): void {
    if (!this._visibleColumnIdsSet.has(nodeId)) {
      this._visibleColumnIds.push(nodeId)
      this._visibleColumnIdsSet.add(nodeId)
    }
  }

  public insertColumnBefore(targetColumnId: string, newColumnId: string): void {
    if (this._visibleColumnIdsSet.has(newColumnId)) return
    const targetIndex = this._visibleColumnIds.indexOf(targetColumnId)
    if (targetIndex === -1) return

    this._visibleColumnIds.splice(targetIndex, 0, newColumnId)
    this._visibleColumnIdsSet.add(newColumnId)
  }

  public insertColumnAfter(targetColumnId: string, newColumnId: string): void {
    if (this._visibleColumnIdsSet.has(newColumnId)) return
    const targetIndex = this._visibleColumnIds.indexOf(targetColumnId)
    if (targetIndex === -1) return

    this._visibleColumnIds.splice(targetIndex + 1, 0, newColumnId)
    this._visibleColumnIdsSet.add(newColumnId)
  }

  public removeColumn(nodeId: string): void {
    if (!this.canRemoveColumn) return
    this._visibleColumnIds = this._visibleColumnIds.filter((id) => id !== nodeId)
    this._visibleColumnIdsSet.delete(nodeId)
  }

  public addAll(): void {
    this._visibleColumnIds = this._availableFields.map((f) => f.nodeId)
    this._visibleColumnIdsSet = new Set(this._visibleColumnIds)
  }

  public hideAll(): void {
    this._visibleColumnIds = []
    this._visibleColumnIdsSet.clear()
  }

  public get canHideAll(): boolean {
    return this._visibleColumnIds.length > 0
  }

  public reorderColumns(fromIndex: number, toIndex: number): void {
    const ids = [...this._visibleColumnIds]
    const [removed] = ids.splice(fromIndex, 1)
    ids.splice(toIndex, 0, removed)
    this._visibleColumnIds = ids
  }

  public createRowViewModels(
    rows: RowListItemFragment[],
    options: {
      isEdit: boolean
      permissionContext: PermissionContext
      onDelete: (rowId: string) => Promise<boolean>
    },
  ): RowItemViewModel[] {
    const schemaStore = this._schemaStore
    if (!schemaStore) return []

    const currentRowIds = new Set(rows.map((r) => r.id))
    this.cleanupStaleCache(currentRowIds)

    return rows.map((row) => {
      const cachedData = this.getOrCreateCachedRowData(schemaStore, row)

      return new RowItemViewModel({
        item: row,
        cellsMap: cachedData.cells,
        isEdit: options.isEdit,
        permissionContext: options.permissionContext,
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
    })

    const newCachedData: CachedRowData = { versionId: row.versionId, rootValue, cells }
    this._rowCache.set(row.id, newCachedData)

    return newCachedData
  }
}
