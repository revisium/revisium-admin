import { action, makeObservable, reaction } from 'mobx'
import { StackManager, StackRequest } from 'src/shared/lib/Stack'
import { IViewModel } from 'src/shared/config/types.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonObjectSchema } from 'src/entities/Schema'
import { RouterParams } from 'src/shared/model/RouterParams.ts'
import { ForeignSchemaCache } from './ForeignSchemaCache.ts'
import { RowStackItemFactory } from './RowStackItemFactory.ts'
import { RowListItem, RowCreatingItem, RowUpdatingItem } from './items'
import { RowFetchDataSource, RowFetchResult } from './RowFetchDataSource.ts'
import { TableFetchDataSource, TableFetchResult } from 'src/pages/RevisionPage/model/TableFetchDataSource.ts'
import { RowData, RowStackItemResult, SelectForeignKeyRowPayload, SelectForeignKeyRowResult } from '../config/types.ts'

export type RowStackItem = RowListItem | RowCreatingItem | RowUpdatingItem

export interface RowStackManagerDeps {
  projectContext: ProjectContext
  routerParams: RouterParams
  itemFactory: RowStackItemFactory
  schemaCache: ForeignSchemaCache
  fetchDataSourceFactory: () => RowFetchDataSource
  tableFetchDataSourceFactory: () => TableFetchDataSource
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
    return this.deps.projectContext.revisionId
  }

  public get currentItem(): RowStackItem | undefined {
    return this.stack[this.stack.length - 1]
  }

  public init(): void {
    this.disposeReaction = reaction(
      () => ({
        revisionId: this.deps.projectContext.revisionId,
        tableId: this.deps.routerParams.tableId,
        rowId: this.deps.routerParams.rowId,
      }),
      () => {
        this.cleanup()
        void this.loadAndSetupStack()
      },
      { fireImmediately: true },
    )
  }

  private async loadAndSetupStack(): Promise<void> {
    const revisionId = this.deps.projectContext.revisionId
    const tableId = this.deps.routerParams.tableId
    const rowId = this.deps.routerParams.rowId

    if (!revisionId || !tableId) {
      return
    }

    try {
      const tableData = await this.fetchTable(tableId)

      let rowData: RowData | undefined
      if (rowId) {
        const row = await this.fetchRow(tableId, rowId)
        rowData = { rowId: row.rowId, data: row.data, foreignKeysCount: row.foreignKeysCount }
      }

      this.setupStack(tableData, rowData)
    } catch {
      this.deps.onError?.('Failed to load data')
    }
  }

  public dispose(): void {
    this.disposeReaction?.()
    this.disposeReaction = null
    this.cleanup()
  }

  private cleanup(): void {
    super.dispose()
    this.deps.schemaCache.dispose()
  }

  private setupStack(tableData: TableFetchResult, rowData?: RowData): void {
    const schema = tableData.schema as JsonObjectSchema
    this.deps.schemaCache.init(tableData.id, schema)

    const firstItem = this.deps.itemFactory.createInitialItem(tableData.id, rowData)
    this.initStack(firstItem)
    firstItem.setIsFirstLevel(true)
  }

  private async fetchTable(tableId: string): Promise<TableFetchResult> {
    const fetchDataSource = this.deps.tableFetchDataSourceFactory()
    try {
      const result = await fetchDataSource.fetch({ revisionId: this.revisionId, tableId })
      if (!result) {
        throw new Error(`Table ${tableId} not found`)
      }
      return result
    } finally {
      fetchDataSource.dispose()
    }
  }

  public async requestForeignKeySelection(
    item: RowCreatingItem | RowUpdatingItem,
    foreignTableId: string,
  ): Promise<string | null> {
    try {
      await this.deps.schemaCache.load(this.revisionId, foreignTableId)
    } catch {
      this.deps.onError?.('Failed to load foreign table')
      return null
    }

    return new Promise((resolve) => {
      const savedItem = item
      const payload: SelectForeignKeyRowPayload = { foreignTableId }

      this.pushRequest(
        item,
        payload,
        (result: SelectForeignKeyRowResult) => {
          this.restoreAfterForeignKeySelection(savedItem)
          resolve(result)
        },
        () => {
          this.restoreAfterForeignKeySelection(savedItem)
          resolve(null)
        },
      )
    })
  }

  public async requestForeignKeyCreation(
    item: RowCreatingItem | RowUpdatingItem,
    foreignTableId: string,
  ): Promise<string | null> {
    try {
      await this.deps.schemaCache.load(this.revisionId, foreignTableId)
    } catch {
      this.deps.onError?.('Failed to load foreign table')
      return null
    }

    return new Promise((resolve) => {
      const savedItem = item
      const payload: SelectForeignKeyRowPayload = { foreignTableId }

      this.pushRequest(
        item,
        payload,
        (result: SelectForeignKeyRowResult) => {
          this.restoreAfterForeignKeySelection(savedItem)
          resolve(result)
        },
        () => {
          this.restoreAfterForeignKeySelection(savedItem)
          resolve(null)
        },
      )

      const lastItem = this.stack[this.stack.length - 1] as RowListItem
      lastItem.toCreating()
    })
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
        this.handleStartForeignKeySelection(item as RowCreatingItem | RowUpdatingItem, result.foreignTableId)
        break
      case 'startForeignKeyCreation':
        this.handleStartForeignKeyCreation(item as RowCreatingItem | RowUpdatingItem, result.foreignTableId)
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
    const rowId = item.state.editor.rowId
    const newItem = this.deps.itemFactory.createUpdatingItemWithState(
      item.tableId,
      item.state,
      rowId,
      item.isSelectingForeignKey,
    )
    this.replaceItem(item, newItem, false)
  }

  private handleStartForeignKeySelection(item: RowCreatingItem | RowUpdatingItem, foreignTableId: string): void {
    void this.requestForeignKeySelection(item, foreignTableId)
  }

  private handleStartForeignKeyCreation(item: RowCreatingItem | RowUpdatingItem, foreignTableId: string): void {
    void this.requestForeignKeyCreation(item, foreignTableId)
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
