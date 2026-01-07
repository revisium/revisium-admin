import { action, makeObservable } from 'mobx'
import { container } from 'src/shared/lib/DIContainer.ts'
import { StackManager, StackRequest } from 'src/shared/lib/Stack'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor/model/StringForeignKeyNodeStore.ts'
import { RootNodeStore } from 'src/widgets/SchemaEditor/model/RootNodeStore.ts'
import { createSchemaNode } from 'src/widgets/SchemaEditor/lib/createSchemaNode.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonSchema } from 'src/entities/Schema'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'
import { TableFetchDataSource, TableFetchResult } from 'src/pages/RevisionPage/model/TableFetchDataSource.ts'
import { toaster } from 'src/shared/ui'
import {
  TableStackItem,
  TableListItem,
  TableCreatingItem,
  TableUpdatingItem,
  TableStackItemBaseDeps,
  TableCreatingItemDeps,
  TableUpdatingItemDeps,
} from './items'
import { TableStackItemResult, SelectForeignKeyPayload, SelectForeignKeyResult } from '../config/types.ts'

export interface TableStackManagerDeps {
  projectContext: ProjectContext
  permissionContext: PermissionContext
  mutationDataSource: TableMutationDataSource
  tableListRefreshService: TableListRefreshService
  fetchDataSourceFactory: () => TableFetchDataSource
}

export class TableStackManager extends StackManager<
  TableStackItem,
  TableStackItemResult,
  SelectForeignKeyPayload,
  SelectForeignKeyResult
> {
  constructor(private readonly deps: TableStackManagerDeps) {
    const firstItem = new TableListItem(deps, false)
    super(firstItem)

    makeObservable<TableStackManager, 'handleItemResult'>(this, {
      handleItemResult: action.bound,
    })
  }

  public init(): void {}

  protected handleItemResult(item: TableStackItem, result: TableStackItemResult): void {
    switch (result.type) {
      case 'toCreating':
        this.handleToCreating(item as TableListItem)
        break
      case 'toCloning':
        this.handleToCloning(item as TableListItem, result.tableId)
        break
      case 'toUpdating':
        this.handleListToUpdating(item as TableListItem, result.tableId)
        break
      case 'creatingToUpdating':
        this.handleCreatingToUpdating(item as TableCreatingItem)
        break
      case 'toList':
        this.handleToList(item as TableCreatingItem | TableUpdatingItem)
        break
      case 'selectTable':
        this.resolveToParent(item, result.tableId)
        break
      case 'startForeignKeySelection':
        this.handleStartForeignKeySelection(item as TableCreatingItem | TableUpdatingItem, result.foreignKeyNode)
        break
      case 'cancelForeignKeySelection':
        this.cancelFromItem(item)
        break
    }
  }

  protected createItemForRequest(
    _request: StackRequest<SelectForeignKeyPayload, SelectForeignKeyResult>,
  ): TableStackItem {
    return new TableListItem(this.getBaseDeps(), true)
  }

  private handleToCreating(item: TableListItem): void {
    const newItem = new TableCreatingItem(this.getCreatingDeps(), item.isSelectingForeignKey)
    this.replaceItem(item, newItem)
  }

  private async handleToCloning(item: TableListItem, tableId: string): Promise<void> {
    try {
      const table = await this.fetchTable(tableId)
      const node = createSchemaNode(table.schema as JsonSchema, { collapse: true })
      const store = new RootNodeStore(node, table.id)

      const newItem = new TableCreatingItem(this.getCreatingDeps(), item.isSelectingForeignKey, store)
      this.replaceItem(item, newItem)
    } catch {
      toaster.error({ title: 'Failed to clone table' })
    }
  }

  private async handleListToUpdating(item: TableListItem, tableId: string): Promise<void> {
    try {
      const table = await this.fetchTable(tableId)
      const node = createSchemaNode(table.schema as JsonSchema, { collapse: true })
      node.setId(table.id)
      node.submitChanges()

      const store = new RootNodeStore(node, table.id)
      const newItem = new TableUpdatingItem(this.getUpdatingDeps(), item.isSelectingForeignKey, store)
      this.replaceItem(item, newItem)
    } catch {
      toaster.error({ title: 'Failed to load table' })
    }
  }

  private handleToList(item: TableCreatingItem | TableUpdatingItem): void {
    const newItem = new TableListItem(this.getBaseDeps(), item.isSelectingForeignKey)
    this.replaceItem(item, newItem)
  }

  private handleCreatingToUpdating(item: TableCreatingItem): void {
    const newItem = new TableUpdatingItem(this.getUpdatingDeps(), item.isSelectingForeignKey, item.store)
    this.replaceItem(item, newItem, false)
  }

  private handleStartForeignKeySelection(
    item: TableCreatingItem | TableUpdatingItem,
    foreignKeyNode: StringForeignKeyNodeStore,
  ): void {
    const savedItem = item
    const payload: SelectForeignKeyPayload = { foreignKeyNode }

    this.pushRequest(
      item,
      payload,
      (result: SelectForeignKeyResult) => {
        savedItem.store.setForeignKeyValue(foreignKeyNode, result)
        this.restoreAfterForeignKeySelection(savedItem)
      },
      () => {
        this.restoreAfterForeignKeySelection(savedItem)
      },
    )
  }

  private restoreAfterForeignKeySelection(savedItem: TableCreatingItem | TableUpdatingItem): void {
    const index = this.stack.indexOf(savedItem as TableStackItem)
    if (index !== -1) {
      return
    }

    const parentItem = this.stack[this.stack.length - 1]
    if (parentItem) {
      this.replaceItem(parentItem, savedItem as TableStackItem, true)
    }
  }

  private replaceItem(oldItem: TableStackItem, newItem: TableStackItem, dispose = true): void {
    const index = this.stack.indexOf(oldItem)
    if (index !== -1) {
      newItem.setResolver((result) => this.handleItemResult(newItem, result))
      this.stack[index] = newItem
      if (dispose) {
        oldItem.dispose()
      }
    }
  }

  private async fetchTable(tableId: string): Promise<TableFetchResult> {
    const fetchDataSource = this.deps.fetchDataSourceFactory()
    try {
      const result = await fetchDataSource.fetch({
        revisionId: this.deps.projectContext.revision.id,
        tableId,
      })
      if (!result) {
        throw new Error(`Not found table ${tableId}`)
      }
      return result
    } finally {
      fetchDataSource.dispose()
    }
  }

  private getBaseDeps(): TableStackItemBaseDeps {
    return {
      projectContext: this.deps.projectContext,
      permissionContext: this.deps.permissionContext,
      fetchDataSourceFactory: this.deps.fetchDataSourceFactory,
    }
  }

  private getCreatingDeps(): TableCreatingItemDeps {
    return {
      ...this.getBaseDeps(),
      mutationDataSource: this.deps.mutationDataSource,
      tableListRefreshService: this.deps.tableListRefreshService,
    }
  }

  private getUpdatingDeps(): TableUpdatingItemDeps {
    return {
      ...this.getBaseDeps(),
      mutationDataSource: this.deps.mutationDataSource,
      tableListRefreshService: this.deps.tableListRefreshService,
    }
  }
}

container.register(
  TableStackManager,
  () => {
    const deps: TableStackManagerDeps = {
      projectContext: container.get(ProjectContext),
      permissionContext: container.get(PermissionContext),
      mutationDataSource: container.get(TableMutationDataSource),
      tableListRefreshService: container.get(TableListRefreshService),
      fetchDataSourceFactory: () => container.get(TableFetchDataSource),
    }
    return new TableStackManager(deps)
  },
  { scope: 'request' },
)
