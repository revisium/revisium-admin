import { action, makeObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { container } from 'src/shared/lib/DIContainer.ts'
import { StackManager, StackRequest } from 'src/shared/lib/Stack'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonObjectSchema, schemaRefsMapper } from 'src/entities/Schema'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore.ts'
import { traverseValue } from 'src/entities/Schema/lib/traverseValue.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { createEmptyJsonValueStore } from 'src/entities/Schema/model/value/createEmptyJsonValueStore.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { RowListRefreshService } from 'src/widgets/RowList/model/RowListRefreshService.ts'
import { ForeignKeyTableDataSource } from 'src/widgets/RowStackWidget/model/ForeignKeyTableDataSource.ts'
import { toaster } from 'src/shared/ui'
import {
  RowStackItemBaseDeps,
  RowListItem,
  RowCreatingItem,
  RowCreatingItemDeps,
  RowUpdatingItem,
  RowUpdatingItemDeps,
} from './items'
import { RowFetchDataSource, RowFetchResult } from './RowFetchDataSource.ts'
import { RowStackItemResult, SelectForeignKeyRowPayload, SelectForeignKeyRowResult } from '../config/types.ts'

export type RowStackItem = RowListItem | RowCreatingItem | RowUpdatingItem

export interface RowData {
  rowId: string
  data: JsonValue
  foreignKeysCount: number
}

export interface RowStackManagerDeps {
  projectContext: ProjectContext
  permissionContext: PermissionContext
  mutationDataSource: RowMutationDataSource
  rowListRefreshService: RowListRefreshService
  fetchDataSourceFactory: () => RowFetchDataSource
  foreignKeyTableDataSourceFactory: () => ForeignKeyTableDataSource
  tableId: string
  schema: JsonObjectSchema
  rowData?: RowData
}

export class RowStackManager extends StackManager<
  RowStackItem,
  RowStackItemResult,
  SelectForeignKeyRowPayload,
  SelectForeignKeyRowResult
> {
  private readonly foreignSchemas = new Map<string, JsonObjectSchema>()

  private currentRowId: string | undefined

  constructor(private readonly deps: RowStackManagerDeps) {
    const firstItem = deps.rowData ? RowStackManager.createUpdatingItem(deps) : RowStackManager.createListItem(deps)

    super(firstItem)
    firstItem.setIsFirstLevel(true)
    this.currentRowId = deps.rowData?.rowId

    makeObservable<RowStackManager, 'handleItemResult' | 'resetToInitialState'>(this, {
      handleItemResult: action.bound,
      resetToInitialState: action.bound,
    })
  }

  private static createListItem(deps: RowStackManagerDeps): RowListItem {
    return new RowListItem(
      {
        projectContext: deps.projectContext,
        permissionContext: deps.permissionContext,
        tableId: deps.tableId,
      },
      false,
    )
  }

  private static createUpdatingItem(deps: RowStackManagerDeps): RowUpdatingItem {
    const rowData = deps.rowData!
    const schemaStore = createJsonSchemaStore(deps.schema)
    const store = new RowDataCardStore(
      schemaStore,
      createEmptyJsonValueStore(schemaStore),
      rowData.rowId,
      { data: rowData.data },
      rowData.foreignKeysCount,
    )

    return new RowUpdatingItem(
      {
        projectContext: deps.projectContext,
        permissionContext: deps.permissionContext,
        tableId: deps.tableId,
        mutationDataSource: deps.mutationDataSource,
        rowListRefreshService: deps.rowListRefreshService,
      },
      false,
      store,
      rowData.rowId,
    )
  }

  public get currentItem(): RowStackItem {
    return this.stack[this.stack.length - 1]
  }

  public init(rowId: string | undefined): void {
    if (rowId === this.currentRowId) {
      return
    }
    this.resetToInitialState(rowId)
  }

  private resetToInitialState(rowId: string | undefined): void {
    this.stack.forEach((item) => item.dispose())
    this.stack.splice(0, this.stack.length)
    this.currentRowId = rowId

    const row = this.deps.projectContext.row
    const rowData: RowData | undefined =
      rowId && row
        ? {
            rowId: row.id,
            data: row.data as JsonValue,
            foreignKeysCount: row.foreignKeysCount,
          }
        : undefined

    const firstItem = rowData
      ? RowStackManager.createUpdatingItem({ ...this.deps, rowData })
      : RowStackManager.createListItem(this.deps)

    this.stack.push(firstItem)
    firstItem.setIsFirstLevel(true)
    firstItem.setResolver((result) => this.handleItemResult(firstItem, result))
  }

  protected handleItemResult(item: RowStackItem, result: RowStackItemResult): void {
    switch (result.type) {
      case 'toCreating':
        this.handleToCreating(item as RowListItem)
        break
      case 'toCloning':
        this.handleToCloning(item as RowListItem, result.rowId)
        break
      case 'toUpdating':
        this.handleListToUpdating(item as RowListItem, result.rowId)
        break
      case 'creatingToUpdating':
        this.handleCreatingToUpdating(item as RowCreatingItem)
        break
      case 'toList':
        this.handleToList(item as RowCreatingItem | RowUpdatingItem)
        break
      case 'selectForeignKeyRow':
        this.resolveToParent(item, result.rowId)
        break
      case 'startForeignKeySelection':
        this.handleStartForeignKeySelection(
          item as RowCreatingItem | RowUpdatingItem,
          result.foreignKeyNode,
          result.foreignTableId,
        )
        break
      case 'startForeignKeyCreation':
        this.handleStartForeignKeyCreation(
          item as RowCreatingItem | RowUpdatingItem,
          result.foreignKeyNode,
          result.foreignTableId,
        )
        break
      case 'cancelForeignKeySelection':
        this.cancelFromItem(item)
        break
    }
  }

  protected createItemForRequest(
    request: StackRequest<SelectForeignKeyRowPayload, SelectForeignKeyRowResult>,
  ): RowStackItem {
    const foreignTableId = request.payload.foreignTableId
    const schema = this.foreignSchemas.get(foreignTableId)

    return new RowListItem(
      {
        projectContext: this.deps.projectContext,
        permissionContext: this.deps.permissionContext,
        tableId: foreignTableId,
        schema,
      },
      true,
    )
  }

  private async handleToCreating(item: RowListItem): Promise<void> {
    try {
      if (item.tableId !== this.deps.tableId) {
        await this.fetchForeignTableSchema(item.tableId)
      }
      const store = this.createEmptyStore(item.tableId)
      const newItem = new RowCreatingItem(this.getCreatingDeps(item.tableId), item.isSelectingForeignKey, store)
      this.replaceItem(item, newItem)
    } catch {
      toaster.error({ title: 'Failed to create row' })
    }
  }

  private async handleToCloning(item: RowListItem, rowId: string): Promise<void> {
    try {
      if (item.tableId !== this.deps.tableId) {
        await this.fetchForeignTableSchema(item.tableId)
      }
      const rowData = await this.fetchRow(item.tableId, rowId)
      const store = this.createStoreFromClone(item.tableId, rowData.data)
      const newItem = new RowCreatingItem(this.getCreatingDeps(item.tableId), item.isSelectingForeignKey, store)
      this.replaceItem(item, newItem)
    } catch {
      toaster.error({ title: 'Failed to clone row' })
    }
  }

  private async handleListToUpdating(item: RowListItem, rowId: string): Promise<void> {
    try {
      if (item.tableId !== this.deps.tableId) {
        await this.fetchForeignTableSchema(item.tableId)
      }
      const rowData = await this.fetchRow(item.tableId, rowId)
      const store = this.createStoreForUpdating(item.tableId, rowData)
      const newItem = new RowUpdatingItem(this.getUpdatingDeps(item.tableId), item.isSelectingForeignKey, store, rowId)
      this.replaceItem(item, newItem)
    } catch {
      toaster.error({ title: 'Failed to load row' })
    }
  }

  private handleToList(item: RowCreatingItem | RowUpdatingItem): void {
    const newItem = new RowListItem(this.getBaseDeps(item.tableId), item.isSelectingForeignKey)
    this.replaceItem(item, newItem)
  }

  private handleCreatingToUpdating(item: RowCreatingItem): void {
    const rowId = item.store.name.getPlainValue()
    const newItem = new RowUpdatingItem(
      this.getUpdatingDeps(item.tableId),
      item.isSelectingForeignKey,
      item.store,
      rowId,
    )
    this.replaceItem(item, newItem, false)
  }

  private async handleStartForeignKeySelection(
    item: RowCreatingItem | RowUpdatingItem,
    foreignKeyNode: JsonStringValueStore,
    foreignTableId: string,
  ): Promise<void> {
    try {
      await this.fetchForeignTableSchema(foreignTableId)
    } catch {
      toaster.error({ title: 'Failed to load foreign table' })
      return
    }

    const savedItem = item
    const payload: SelectForeignKeyRowPayload = { foreignKeyNode, foreignTableId }

    this.pushRequest(
      item,
      payload,
      (result: SelectForeignKeyRowResult) => {
        foreignKeyNode.setValue(result)
        this.restoreAfterForeignKeySelection(savedItem)
      },
      () => {
        this.restoreAfterForeignKeySelection(savedItem)
      },
    )
  }

  private async handleStartForeignKeyCreation(
    item: RowCreatingItem | RowUpdatingItem,
    foreignKeyNode: JsonStringValueStore,
    foreignTableId: string,
  ): Promise<void> {
    try {
      await this.fetchForeignTableSchema(foreignTableId)
    } catch {
      toaster.error({ title: 'Failed to load foreign table' })
      return
    }

    const savedItem = item
    const payload: SelectForeignKeyRowPayload = { foreignKeyNode, foreignTableId }

    this.pushRequest(
      item,
      payload,
      (result: SelectForeignKeyRowResult) => {
        foreignKeyNode.setValue(result)
        this.restoreAfterForeignKeySelection(savedItem)
      },
      () => {
        this.restoreAfterForeignKeySelection(savedItem)
      },
    )

    const lastItem = this.stack[this.stack.length - 1] as RowListItem
    lastItem.toCreating()
  }

  private restoreAfterForeignKeySelection(savedItem: RowCreatingItem | RowUpdatingItem): void {
    const index = this.stack.indexOf(savedItem as RowStackItem)
    if (index !== -1) {
      return
    }

    const parentItem = this.stack[this.stack.length - 1]
    if (parentItem) {
      this.replaceItem(parentItem, savedItem as RowStackItem, true)
    }
  }

  private replaceItem(oldItem: RowStackItem, newItem: RowStackItem, dispose = true): void {
    const index = this.stack.indexOf(oldItem)
    if (index !== -1) {
      newItem.setIsFirstLevel(oldItem.isFirstLevel)
      newItem.setResolver((result) => this.handleItemResult(newItem, result))
      this.stack[index] = newItem
      if (dispose) {
        oldItem.dispose()
      }
    }
  }

  private async fetchRow(tableId: string, rowId: string): Promise<RowFetchResult> {
    const fetchDataSource = this.deps.fetchDataSourceFactory()
    try {
      const result = await fetchDataSource.fetch({
        revisionId: this.deps.projectContext.revision.id,
        tableId,
        rowId,
      })
      if (!result) {
        throw new Error(`Not found row ${rowId}`)
      }
      return result
    } finally {
      fetchDataSource.dispose()
    }
  }

  private getSchemaForTable(tableId: string): JsonObjectSchema {
    if (tableId === this.deps.tableId) {
      return this.deps.schema
    }
    const foreignSchema = this.foreignSchemas.get(tableId)
    if (foreignSchema) {
      return foreignSchema
    }
    throw new Error(`Schema for table ${tableId} not available`)
  }

  private async fetchForeignTableSchema(tableId: string): Promise<JsonObjectSchema> {
    const cached = this.foreignSchemas.get(tableId)
    if (cached) {
      return cached
    }

    const dataSource = this.deps.foreignKeyTableDataSourceFactory()
    try {
      const result = await dataSource.loadTableWithRows(this.deps.projectContext.revision.id, tableId, 0)
      if (!result) {
        throw new Error(`Failed to load schema for table ${tableId}`)
      }
      const schema = result.table.schema as JsonObjectSchema
      this.foreignSchemas.set(tableId, schema)
      return schema
    } finally {
      dataSource.dispose()
    }
  }

  private createEmptyStore(tableId: string): RowDataCardStore {
    const schema = this.getSchemaForTable(tableId)
    const rowId = `${tableId.toLowerCase()}-${nanoid(9).toLowerCase()}`
    const schemaStore = createJsonSchemaStore(schema)
    return new RowDataCardStore(schemaStore, createEmptyJsonValueStore(schemaStore), rowId)
  }

  private createStoreFromClone(tableId: string, rowData: JsonValue): RowDataCardStore {
    const schema = this.getSchemaForTable(tableId)
    const rowId = `${tableId.toLowerCase()}-${nanoid(9).toLowerCase()}`
    const schemaStore = createJsonSchemaStore(schema)
    const store = new RowDataCardStore(schemaStore, createEmptyJsonValueStore(schemaStore), rowId, null, 0)
    store.root.updateBaseValue(rowData)

    traverseValue(store.root, (item) => {
      if (item.$ref) {
        const refSchema = schemaRefsMapper[item.$ref]
        if (refSchema) {
          const valueStore = createEmptyJsonValueStore(createJsonSchemaStore(refSchema))
          item.updateBaseValue(valueStore.getPlainValue())
        }
      }
    })

    return store
  }

  private createStoreForUpdating(tableId: string, rowData: RowFetchResult): RowDataCardStore {
    const schema = this.getSchemaForTable(tableId)
    const schemaStore = createJsonSchemaStore(schema)
    return new RowDataCardStore(
      schemaStore,
      createEmptyJsonValueStore(schemaStore),
      rowData.rowId,
      { data: rowData.data },
      rowData.foreignKeysCount,
    )
  }

  private getBaseDeps(tableId: string): RowStackItemBaseDeps {
    const schema = tableId === this.deps.tableId ? this.deps.schema : this.foreignSchemas.get(tableId)

    return {
      projectContext: this.deps.projectContext,
      permissionContext: this.deps.permissionContext,
      tableId,
      schema,
    }
  }

  private getCreatingDeps(tableId: string): RowCreatingItemDeps {
    return {
      ...this.getBaseDeps(tableId),
      mutationDataSource: this.deps.mutationDataSource,
      rowListRefreshService: this.deps.rowListRefreshService,
    }
  }

  private getUpdatingDeps(tableId: string): RowUpdatingItemDeps {
    return {
      ...this.getBaseDeps(tableId),
      mutationDataSource: this.deps.mutationDataSource,
      rowListRefreshService: this.deps.rowListRefreshService,
    }
  }
}

container.register(
  RowStackManager,
  () => {
    const projectContext = container.get(ProjectContext)
    const table = projectContext.table
    if (!table) {
      throw new Error('RowStackManager: table is not available in context')
    }

    const row = projectContext.row
    const rowData: RowData | undefined = row
      ? {
          rowId: row.id,
          data: row.data as JsonValue,
          foreignKeysCount: row.foreignKeysCount,
        }
      : undefined

    const deps: RowStackManagerDeps = {
      projectContext,
      permissionContext: container.get(PermissionContext),
      mutationDataSource: container.get(RowMutationDataSource),
      rowListRefreshService: container.get(RowListRefreshService),
      fetchDataSourceFactory: () => container.get(RowFetchDataSource),
      foreignKeyTableDataSourceFactory: () => container.get(ForeignKeyTableDataSource),
      tableId: table.id,
      schema: table.schema as JsonObjectSchema,
      rowData,
    }
    return new RowStackManager(deps)
  },
  { scope: 'request' },
)
