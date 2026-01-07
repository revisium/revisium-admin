import { action, makeObservable, reaction } from 'mobx'
import { StackManager, StackRequest } from 'src/shared/lib/Stack'
import { IViewModel } from 'src/shared/config/types.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonObjectSchema } from 'src/entities/Schema'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { ForeignSchemaCache } from './ForeignSchemaCache.ts'
import { RowStackItemFactory } from './RowStackItemFactory.ts'
import { RowListItem, RowCreatingItem, RowUpdatingItem } from './items'
import { RowFetchDataSource, RowFetchResult } from './RowFetchDataSource.ts'
import { RowData, RowStackItemResult, SelectForeignKeyRowPayload, SelectForeignKeyRowResult } from '../config/types.ts'

export type RowStackItem = RowListItem | RowCreatingItem | RowUpdatingItem

export interface RowStackManagerDeps {
  projectContext: ProjectContext
  itemFactory: RowStackItemFactory
  schemaCache: ForeignSchemaCache
  fetchDataSourceFactory: () => RowFetchDataSource
  onError?: (message: string) => void
}

export class RowStackManager
  extends StackManager<RowStackItem, RowStackItemResult, SelectForeignKeyRowPayload, SelectForeignKeyRowResult>
  implements IViewModel
{
  private disposeReaction: (() => void) | null = null

  constructor(private readonly deps: RowStackManagerDeps) {
    super()
    makeObservable<RowStackManager, 'handleItemResult'>(this, {
      handleItemResult: action.bound,
    })
  }

  private get revisionId(): string {
    return this.deps.projectContext.revision.id
  }

  public get currentItem(): RowStackItem | undefined {
    return this.stack[this.stack.length - 1]
  }

  public init(): void {
    console.log('[RowStackManager] init() called')
    this.disposeReaction = reaction(
      () => {
        const data = {
          revisionId: this.deps.projectContext.revision?.id,
          tableId: this.deps.projectContext.table?.id,
          rowId: this.deps.projectContext.row?.id,
        }
        console.log('[RowStackManager] reaction tracking:', data)
        return data
      },
      () => {
        console.log('[RowStackManager] reaction effect triggered')
        this.cleanup()
        this.setupStack()
      },
      { fireImmediately: true },
    )
  }

  public dispose(): void {
    this.disposeReaction?.()
    this.disposeReaction = null
    this.cleanup()
  }

  private cleanup(): void {
    console.log('[RowStackManager] cleanup() called, stack length:', this.stack.length)
    super.dispose()
    this.deps.schemaCache.dispose()
  }

  private setupStack(): void {
    const table = this.deps.projectContext.table
    const row = this.deps.projectContext.row
    console.log('[RowStackManager] setupStack() table:', table?.id, 'row:', row?.id)

    if (!table) {
      console.log('[RowStackManager] setupStack() - no table, returning')
      return
    }

    const schema = table.schema as JsonObjectSchema
    this.deps.schemaCache.init(table.id, schema)

    const rowData: RowData | undefined = row
      ? { rowId: row.id, data: row.data as JsonValue, foreignKeysCount: row.foreignKeysCount }
      : undefined

    const firstItem = this.deps.itemFactory.createInitialItem(table.id, rowData)
    this.initStack(firstItem)
    firstItem.setIsFirstLevel(true)
    console.log('[RowStackManager] setupStack() done, item type:', firstItem.type, 'stack length:', this.stack.length)
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
    return this.deps.itemFactory.createListItem(request.payload.foreignTableId, true)
  }

  private async handleToCreating(item: RowListItem): Promise<void> {
    try {
      const schema = await this.deps.schemaCache.load(this.revisionId, item.tableId)
      const newItem = this.deps.itemFactory.createCreatingItem(item.tableId, schema, item.isSelectingForeignKey)
      this.replaceItem(item, newItem)
    } catch {
      this.deps.onError?.('Failed to create row')
    }
  }

  private async handleToCloning(item: RowListItem, rowId: string): Promise<void> {
    try {
      const schema = await this.deps.schemaCache.load(this.revisionId, item.tableId)
      const rowData = await this.fetchRow(item.tableId, rowId)
      const newItem = this.deps.itemFactory.createCreatingItemFromClone(
        item.tableId,
        schema,
        rowData.data,
        item.isSelectingForeignKey,
      )
      this.replaceItem(item, newItem)
    } catch {
      this.deps.onError?.('Failed to clone row')
    }
  }

  private async handleListToUpdating(item: RowListItem, rowId: string): Promise<void> {
    try {
      const schema = await this.deps.schemaCache.load(this.revisionId, item.tableId)
      const rowData = await this.fetchRow(item.tableId, rowId)
      const newItem = this.deps.itemFactory.createUpdatingItem(
        item.tableId,
        schema,
        rowData.rowId,
        rowData.data,
        rowData.foreignKeysCount,
        item.isSelectingForeignKey,
      )
      this.replaceItem(item, newItem)
    } catch {
      this.deps.onError?.('Failed to load row')
    }
  }

  private handleToList(item: RowCreatingItem | RowUpdatingItem): void {
    const newItem = this.deps.itemFactory.createListItem(item.tableId, item.isSelectingForeignKey)
    this.replaceItem(item, newItem)
  }

  private handleCreatingToUpdating(item: RowCreatingItem): void {
    const rowId = item.store.name.getPlainValue()
    const newItem = this.deps.itemFactory.createUpdatingItemWithStore(
      item.tableId,
      item.store,
      rowId,
      item.isSelectingForeignKey,
    )
    this.replaceItem(item, newItem, false)
  }

  private async handleStartForeignKeySelection(
    item: RowCreatingItem | RowUpdatingItem,
    foreignKeyNode: JsonStringValueStore,
    foreignTableId: string,
  ): Promise<void> {
    await this.pushForeignKeyRequest(item, foreignKeyNode, foreignTableId)
  }

  private async handleStartForeignKeyCreation(
    item: RowCreatingItem | RowUpdatingItem,
    foreignKeyNode: JsonStringValueStore,
    foreignTableId: string,
  ): Promise<void> {
    const success = await this.pushForeignKeyRequest(item, foreignKeyNode, foreignTableId)
    if (success) {
      const lastItem = this.stack[this.stack.length - 1] as RowListItem
      lastItem.toCreating()
    }
  }

  private async pushForeignKeyRequest(
    item: RowCreatingItem | RowUpdatingItem,
    foreignKeyNode: JsonStringValueStore,
    foreignTableId: string,
  ): Promise<boolean> {
    try {
      await this.deps.schemaCache.load(this.revisionId, foreignTableId)
    } catch {
      this.deps.onError?.('Failed to load foreign table')
      return false
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

    return true
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
      const result = await fetchDataSource.fetch({ revisionId: this.revisionId, tableId, rowId })
      if (!result) {
        throw new Error(`Row ${rowId} not found`)
      }
      return result
    } finally {
      fetchDataSource.dispose()
    }
  }
}
