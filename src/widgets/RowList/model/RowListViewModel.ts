import { makeAutoObservable, runInAction } from 'mobx'
import { SearchIn, SearchType } from 'src/__generated__/graphql-request'
import { JsonSchema } from 'src/entities/Schema'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext'
import { IViewModel } from 'src/shared/config/types'
import { container } from 'src/shared/lib'
import { AsyncListState } from 'src/shared/lib/AsyncListState'
import { AbortError, ObservableRequest } from 'src/shared/lib/ObservableRequest'
import { SearchController } from 'src/shared/lib/SearchController'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService'
import { ColumnsModel } from './ColumnsModel'
import { RowItemViewModel } from './RowItemViewModel'
import { ColumnType } from './types'

export type { ColumnType }

export class RowListViewModel implements IViewModel {
  public readonly listState = new AsyncListState<RowItemViewModel>()
  public readonly search: SearchController
  public readonly columnsModel = new ColumnsModel()

  private _tableId = ''
  private _baseTotalCount = 0

  private readonly getRowsRequest = ObservableRequest.of(client.RowListRows, { skipResetting: true })
  private readonly deleteRowRequest = ObservableRequest.of(client.DeleteRowMst)

  constructor(
    private readonly projectContext: ProjectContext,
    private readonly permissionContext: PermissionContext,
  ) {
    this.search = new SearchController(300, this.handleSearch)
    makeAutoObservable(this, {}, { autoBind: true })
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

  public get isLoading(): boolean {
    return this.getRowsRequest.isLoading
  }

  public get rowCountText(): string {
    if (this.isSearching) {
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

  private get revisionId(): string {
    return this.projectContext.revision.id
  }

  public init(tableId: string, schema: JsonSchema): void {
    this._tableId = tableId
    this._baseTotalCount = 0
    this.search.reset()
    this.columnsModel.init(schema)
    void this.loadInitial()
  }

  public dispose(): void {
    this.search.dispose()
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
        const newItems = this.columnsModel.createRowViewModels(
          result.data.rows.edges.map((edge) => edge.node),
          {
            isEdit: this.isEdit,
            permissionContext: this.permissionContext,
            onDelete: this.deleteRow,
          },
        )
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
          this.listState.updateStateAfterRemove(this.isSearching)
        })
        return true
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  private handleSearch = (): void => {
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
      if (result.error instanceof AbortError) {
        return
      }
      runInAction(() => {
        this.listState.setError()
      })
      return
    }

    runInAction(() => {
      const items = this.columnsModel.createRowViewModels(
        result.data.rows.edges.map((edge) => edge.node),
        {
          isEdit: this.isEdit,
          permissionContext: this.permissionContext,
          onDelete: this.deleteRow,
        },
      )

      this.listState.setItems(items, {
        hasNextPage: result.data.rows.pageInfo.hasNextPage,
        endCursor: result.data.rows.pageInfo.endCursor ?? null,
        totalCount: result.data.rows.totalCount,
        isSearching: this.isSearching,
      })

      if (!this.isSearching && this._baseTotalCount === 0) {
        this._baseTotalCount = result.data.rows.totalCount
      }
    })
  }

  private buildWhereClause() {
    if (!this.search.query) {
      return undefined
    }

    return {
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
    }
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
