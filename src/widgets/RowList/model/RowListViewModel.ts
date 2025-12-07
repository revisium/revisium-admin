import { makeAutoObservable, runInAction } from 'mobx'
import { SearchIn, SearchType } from 'src/__generated__/graphql-request'
import { JsonSchema } from 'src/entities/Schema'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext'
import { IViewModel } from 'src/shared/config/types'
import { container, isAborted } from 'src/shared/lib'
import { AsyncListState } from 'src/shared/lib/AsyncListState'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest'
import { SearchController } from 'src/shared/lib/SearchController'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService'
import { ColumnsModel } from './ColumnsModel'
import { FilterModel } from './FilterModel'
import { RowItemViewModel } from './RowItemViewModel'
import { SelectionViewModel } from './SelectionViewModel'
import { ColumnType } from './types'

export type { ColumnType }

export class RowListViewModel implements IViewModel {
  public readonly search: SearchController
  public readonly columnsModel = new ColumnsModel()
  public readonly filterModel = new FilterModel()
  public readonly listState = new AsyncListState<RowItemViewModel>()
  public readonly selection = new SelectionViewModel()

  private _tableId = ''
  private _baseTotalCount = 0
  private _isDeleting = false

  private readonly getRowsRequest = ObservableRequest.of(client.RowListRows, { skipResetting: true })
  private readonly deleteRowRequest = ObservableRequest.of(client.DeleteRowMst)
  private readonly removeRowsRequest = ObservableRequest.of(client.RemoveRows)

  constructor(
    private readonly projectContext: ProjectContext,
    private readonly permissionContext: PermissionContext,
  ) {
    this.search = new SearchController(300, this.handleSearch)
    makeAutoObservable(this, {}, { autoBind: true })
    // Set callback after makeAutoObservable to ensure proper binding
    this.filterModel.setOnFilterChange(this.handleFilterChange)
  }

  public get showLoading(): boolean {
    return this.listState.showLoading
  }

  public get showEmpty(): boolean {
    return this.listState.showEmpty
  }

  public get showNotFound(): boolean {
    return this.listState.showNotFound
  }

  public get showList(): boolean {
    return this.listState.showList
  }

  public get showError(): boolean {
    return this.listState.showError
  }

  public get items(): RowItemViewModel[] {
    return this.listState.items
  }

  public get columns(): ColumnType[] {
    return this.columnsModel.columns
  }

  public get showHeader(): boolean {
    return this.columnsModel.showHeader
  }

  public get hasNextPage(): boolean {
    return this.listState.hasNextPage
  }

  public get searchQuery(): string {
    return this.search.query
  }

  public get isSearching(): boolean {
    return this.search.isSearching
  }

  public get isFiltering(): boolean {
    return this.filterModel.hasAppliedFilters
  }

  public get isSearchingOrFiltering(): boolean {
    return this.isSearching || this.isFiltering
  }

  public get hasActiveSearch(): boolean {
    return this.searchQuery.trim().length > 0
  }

  public get emptyStateType(): 'search' | 'filters' | 'both' {
    const hasSearch = this.hasActiveSearch
    const hasFilters = this.filterModel.hasAppliedFilters
    if (hasSearch && hasFilters) return 'both'
    if (hasFilters) return 'filters'
    return 'search'
  }

  public get emptyStateHint(): string {
    switch (this.emptyStateType) {
      case 'both':
        return 'Try a different search term or adjust filters'
      case 'filters':
        return 'Try adjusting your filters'
      case 'search':
        return 'Try a different search term'
    }
  }

  public get isLoading(): boolean {
    return this.getRowsRequest.isLoading
  }

  public get rowCountText(): string {
    if (this.isSearchingOrFiltering) {
      return `${this.listState.totalCount} of ${this._baseTotalCount} rows`
    }
    return `${this.listState.totalCount} rows`
  }

  public get isEdit(): boolean {
    return this.projectContext.isDraftRevision
  }

  public get canCreateRow(): boolean {
    return this.isEdit && this.permissionContext.canCreateRow
  }

  public get canDeleteRow(): boolean {
    return this.isEdit && this.permissionContext.canDeleteRow
  }

  public get showSelectionColumn(): boolean {
    return this.canDeleteRow && this.selection.isSelectionMode
  }

  public get isDeleting(): boolean {
    return this._isDeleting
  }

  public get allRowIds(): string[] {
    return this.items.map((item) => item.id)
  }

  private get revisionId(): string {
    return this.projectContext.revision.id
  }

  public init(tableId: string, schema: JsonSchema, options?: { showAllColumns?: boolean }): void {
    this._tableId = tableId
    this._baseTotalCount = 0
    this.search.reset()
    this.selection.exitSelectionMode()
    this.columnsModel.init(schema, options)
    this.filterModel.init(schema)
    void this.loadInitial()
  }

  public dispose(): void {
    this.search.dispose()
    this.selection.exitSelectionMode()
    this.filterModel.dispose()
    this.getRowsRequest.abort()
  }

  public setSearchQuery(query: string): void {
    this.search.setQuery(query)
  }

  public clearSearch(): void {
    this.search.clear()
  }

  public async tryToFetchNextPage(): Promise<void> {
    if (!this.listState.hasNextPage || this.isLoading || !this.listState.endCursor) {
      return
    }

    const result = await this.getRowsRequest.fetch({
      data: {
        revisionId: this.revisionId,
        tableId: this._tableId,
        first: 50,
        after: this.listState.endCursor,
        where: this.buildWhereClause(),
      },
    })

    runInAction(() => {
      if (result.isRight) {
        const newRows = result.data.rows.edges.map((edge) => edge.node)
        const newItems = this.columnsModel.createRowViewModels(newRows, {
          isEdit: this.isEdit,
          permissionContext: this.permissionContext,
          onDelete: this.deleteRow,
        })
        this.listState.appendItems(newItems, {
          hasNextPage: result.data.rows.pageInfo.hasNextPage,
          endCursor: result.data.rows.pageInfo.endCursor ?? null,
        })
      } else {
        console.error('Failed to fetch next page')
      }
    })
  }

  public async deleteRow(rowId: string): Promise<boolean> {
    try {
      const result = await this.deleteRowRequest.fetch({
        data: {
          revisionId: this.revisionId,
          tableId: this._tableId,
          rowId,
        },
      })

      if (result.isRight) {
        runInAction(() => {
          this.listState.removeItem((item) => item.id === rowId)
          this._baseTotalCount = Math.max(0, this._baseTotalCount - 1)
          this.listState.updateStateAfterRemove(this.isSearchingOrFiltering)
        })
        return true
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  public async deleteRows(rowIds: string[]): Promise<boolean> {
    if (rowIds.length === 0) {
      return true
    }

    try {
      runInAction(() => {
        this._isDeleting = true
      })

      const result = await this.removeRowsRequest.fetch({
        data: {
          revisionId: this.revisionId,
          tableId: this._tableId,
          rowIds,
        },
      })

      if (result.isRight) {
        runInAction(() => {
          for (const rowId of rowIds) {
            this.listState.removeItem((item) => item.id === rowId)
          }
          this._baseTotalCount = Math.max(0, this._baseTotalCount - rowIds.length)
          this.listState.updateStateAfterRemove(this.isSearchingOrFiltering)
          this.selection.removeDeletedRows(rowIds)
        })
        return true
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    } finally {
      runInAction(() => {
        this._isDeleting = false
      })
    }
  }

  private handleSearch = (): void => {
    void this.reload()
  }

  private handleFilterChange = (): void => {
    void this.reload()
  }

  private async reload(): Promise<void> {
    this.listState.reset()
    await this.loadInitial()
  }

  private async loadInitial(): Promise<void> {
    const result = await this.getRowsRequest.fetch({
      data: {
        revisionId: this.revisionId,
        tableId: this._tableId,
        first: 50,
        where: this.buildWhereClause(),
      },
    })

    if (!result.isRight) {
      if (isAborted(result)) {
        return
      }

      runInAction(() => {
        this.listState.setError()
      })
      return
    }

    runInAction(() => {
      const rawData = result.data.rows.edges.map((edge) => edge.node)
      const items = this.columnsModel.createRowViewModels(rawData, {
        isEdit: this.isEdit,
        permissionContext: this.permissionContext,
        onDelete: this.deleteRow,
      })

      this.listState.setItems(items, {
        hasNextPage: result.data.rows.pageInfo.hasNextPage,
        endCursor: result.data.rows.pageInfo.endCursor ?? null,
        totalCount: result.data.rows.totalCount,
        isSearching: this.isSearchingOrFiltering,
      })

      if (!this.isSearchingOrFiltering && this._baseTotalCount === 0) {
        this._baseTotalCount = result.data.rows.totalCount
      }
    })
  }

  private buildWhereClause() {
    const conditions: object[] = []

    if (this.search.query) {
      conditions.push({
        OR: [
          {
            id: {
              contains: this.search.query,
            },
          },
          {
            data: {
              path: [],
              search: this.search.query,
              searchType: SearchType.Plain,
              searchIn: SearchIn.Values,
            },
          },
        ],
      })
    }

    const filterWhere = this.filterModel.toGraphQLWhere()
    if (filterWhere) {
      conditions.push(filterWhere)
    }

    if (conditions.length === 0) {
      return undefined
    }

    if (conditions.length === 1) {
      return conditions[0]
    }

    return { AND: conditions }
  }
}

container.register(
  RowListViewModel,
  () => {
    const projectContext = container.get(ProjectContext)
    const permissionContext = container.get(PermissionContext)
    return new RowListViewModel(projectContext, permissionContext)
  },
  { scope: 'request' },
)
