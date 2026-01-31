import { action, makeObservable } from 'mobx'
import { container } from 'src/shared/lib/DIContainer.ts'
import { StackManager, StackRequest } from 'src/shared/lib/Stack'
import type { JsonObjectSchema } from '@revisium/schema-toolkit-ui'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'
import { TableFetchDataSource, TableFetchResult } from 'src/pages/RevisionPage/model/TableFetchDataSource.ts'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { RouterService } from 'src/shared/model/RouterService.ts'
import { DRAFT_TAG } from 'src/shared/config/routes.ts'
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
  projectPermissions: ProjectPermissions
  mutationDataSource: TableMutationDataSource
  tableListRefreshService: TableListRefreshService
  fetchDataSourceFactory: () => TableFetchDataSource
  linkMaker: LinkMaker
  routerService: RouterService
}

export class TableStackManager extends StackManager<
  TableStackItem,
  TableStackItemResult,
  SelectForeignKeyPayload,
  SelectForeignKeyResult
> {
  constructor(private readonly deps: TableStackManagerDeps) {
    super()

    makeObservable<TableStackManager, 'handleItemResult'>(this, {
      handleItemResult: action.bound,
    })
  }

  public init(): void {
    const firstItem = new TableListItem(this.getBaseDeps(), false)
    this.initStack(firstItem)
  }

  public dispose(): void {
    super.dispose()
  }

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
        this.handleStartForeignKeySelection(item as TableCreatingItem | TableUpdatingItem, result.resolve)
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
    const newItem = new TableCreatingItem(this.getMutationDeps(), item.isSelectingForeignKey)
    this.replaceItem(item, newItem)
  }

  private async handleToCloning(item: TableListItem, tableId: string): Promise<void> {
    try {
      const table = await this.fetchTable(tableId)
      const schema = table.schema as JsonObjectSchema

      const newItem = new TableCreatingItem(this.getMutationDeps(), item.isSelectingForeignKey, schema, '')
      this.replaceItem(item, newItem)
    } catch {
      toaster.error({ title: 'Failed to clone table' })
    }
  }

  private async handleListToUpdating(item: TableListItem, tableId: string): Promise<void> {
    try {
      const table = await this.fetchTable(tableId)
      const schema = table.schema as JsonObjectSchema

      const newItem = new TableUpdatingItem(this.getMutationDeps(), item.isSelectingForeignKey, schema, table.id)
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
    const schema = item.viewModel.getPlainSchema()
    const tableId = item.viewModel.tableId
    const newItem = new TableUpdatingItem(this.getMutationDeps(), item.isSelectingForeignKey, schema, tableId)
    this.replaceItem(item, newItem, false)
    this.navigateToTable(tableId)
  }

  private navigateToTable(tableId: string): void {
    const path = this.deps.linkMaker.make({ revisionIdOrTag: DRAFT_TAG, tableId })
    this.deps.routerService.navigate(path)
  }

  private handleStartForeignKeySelection(
    item: TableCreatingItem | TableUpdatingItem,
    resolve: (tableId: string | null) => void,
  ): void {
    const savedItem = item
    const payload: SelectForeignKeyPayload = { resolve }

    this.pushRequest(
      item,
      payload,
      (result: SelectForeignKeyResult) => {
        resolve(result)
        this.restoreAfterForeignKeySelection(savedItem)
      },
      () => {
        resolve(null)
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
    const revisionId = this.deps.projectContext.revisionId
    if (!revisionId) {
      throw new Error('Revision not loaded')
    }

    const fetchDataSource = this.deps.fetchDataSourceFactory()
    try {
      const result = await fetchDataSource.fetch({
        revisionId,
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
      projectPermissions: this.deps.projectPermissions,
      fetchDataSourceFactory: this.deps.fetchDataSourceFactory,
    }
  }

  private getMutationDeps(): TableCreatingItemDeps & TableUpdatingItemDeps {
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
      projectPermissions: container.get(ProjectPermissions),
      mutationDataSource: container.get(TableMutationDataSource),
      tableListRefreshService: container.get(TableListRefreshService),
      fetchDataSourceFactory: () => container.get(TableFetchDataSource),
      linkMaker: container.get(LinkMaker),
      routerService: container.get(RouterService),
    }
    return new TableStackManager(deps)
  },
  { scope: 'request' },
)
