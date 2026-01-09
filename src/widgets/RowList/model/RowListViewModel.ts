import { makeAutoObservable, runInAction } from 'mobx'
import { TableVirtuosoHandle } from 'react-virtuoso'
import { SearchIn, SearchType, SortOrder, TableViewsDataFragment, ViewInput } from 'src/__generated__/graphql-request'
import { JsonSchema } from 'src/entities/Schema'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext'
import { IViewModel } from 'src/shared/config/types'
import { container, isAborted } from 'src/shared/lib'
import { PaginatedListState } from 'src/shared/lib/PaginatedListState'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest'
import { SearchController } from 'src/shared/lib/SearchController'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService'
import { toaster } from 'src/shared/ui'
import { ColumnsModel } from './ColumnsModel'
import { FilterModel } from './FilterModel'
import { InlineEditModel } from './InlineEditModel'
import { RowItemViewModel } from './RowItemViewModel'
import { SelectionViewModel } from './SelectionViewModel'
import { SortModel } from './SortModel'
import { ColumnType } from './types'
import { ViewSettingsBadgeModel } from '../ui/ViewSettingsBadge'

export type { ColumnType } from './types'

const PAGE_SIZE = 50

export class RowListViewModel implements IViewModel {
  public readonly search: SearchController
  public readonly columnsModel = new ColumnsModel()
  public readonly filterModel = new FilterModel()
  public readonly sortModel = new SortModel()
  public readonly listState = new PaginatedListState<RowItemViewModel>()
  public readonly selection = new SelectionViewModel()
  public readonly inlineEdit = new InlineEditModel()
  public readonly viewSettingsBadge: ViewSettingsBadgeModel

  private _tableId = ''
  private _baseTotalCount = 0
  private _isDeleting = false
  private _isRefetching = false
  private _isLoadingMore = false
  private _viewsData: TableViewsDataFragment | null = null
  private _savedViewsSnapshot: string | null = null
  private _hasPendingViewChanges = false
  private _isSavingViews = false
  private _virtuosoRef: TableVirtuosoHandle | null = null

  private readonly getRowsRequest = ObservableRequest.of(client.RowListRows, { skipResetting: true })
  private readonly deleteRowRequest = ObservableRequest.of(client.RemoveRow)
  private readonly removeRowsRequest = ObservableRequest.of(client.RemoveRows)
  private readonly getViewsRequest = ObservableRequest.of(client.GetTableViews)
  private readonly updateViewsRequest = ObservableRequest.of(client.UpdateTableViews)

  constructor(
    private readonly projectContext: ProjectContext,
    private readonly permissionContext: PermissionContext,
  ) {
    this.search = new SearchController(300, this.handleSearch)
    this.viewSettingsBadge = new ViewSettingsBadgeModel(this)
    makeAutoObservable(this, {}, { autoBind: true })
    this.filterModel.setOnFilterChange(this.handleFilterChange)
    this.sortModel.setOnSortChange(this.handleSortChange)
    this.columnsModel.setOnColumnsChange(this.handleColumnsChange)
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

  public get canFilter(): boolean {
    return this.filterModel.availableFields.length > 0
  }

  public get canSort(): boolean {
    return this.sortModel.availableFields.length > 0
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
      default:
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

  public get isRefetching(): boolean {
    return this._isRefetching
  }

  public get isLoadingMore(): boolean {
    return this._isLoadingMore
  }

  public get hasPendingViewChanges(): boolean {
    return this._hasPendingViewChanges
  }

  public get isSavingViews(): boolean {
    return this._isSavingViews
  }

  public get isDraftRevision(): boolean {
    return this.projectContext.isDraftRevision
  }

  public get allRowIds(): string[] {
    return this.items.map((item) => item.id)
  }

  public setVirtuosoRef(ref: TableVirtuosoHandle | null): void {
    this._virtuosoRef = ref
  }

  private get revisionId(): string {
    return this.projectContext.revisionId
  }

  public init(tableId: string, schema: JsonSchema, options?: { showAllColumns?: boolean }): void {
    this._tableId = tableId
    this._baseTotalCount = 0
    this._viewsData = null
    this._savedViewsSnapshot = null
    this._hasPendingViewChanges = false
    this._isSavingViews = false
    this.search.reset()
    this.selection.exitSelectionMode()
    this.listState.resetToLoading()
    this.columnsModel.init(schema, options)
    this.filterModel.init(schema)
    this.sortModel.init(this.columnsModel.sortableFields)
    this.inlineEdit.init({
      revisionId: this.revisionId,
      tableId: this._tableId,
      getVisibleFields: this.getVisibleFields,
      getVisibleRowIds: this.getVisibleRowIds,
      getCellStore: this.getCellStore,
      isCellReadonly: this.isCellReadonly,
    })
    void this.loadViewsAndData()
  }

  private async loadViewsAndData(): Promise<void> {
    await this.loadViews()
    await this.loadInitial()
  }

  private async loadViews(): Promise<void> {
    try {
      const result = await this.getViewsRequest.fetch({
        data: {
          revisionId: this.revisionId,
          tableId: this._tableId,
        },
      })

      const views = result.isRight ? result.data.table?.views : null
      if (views) {
        runInAction(() => {
          this._viewsData = views
          this.applyViewSettings()
        })
      }
    } catch (e) {
      console.error('Failed to load views:', e)
    }
  }

  private applyViewSettings(): void {
    this.restoreViewFromSaved()
    this._savedViewsSnapshot = this.getCurrentViewSnapshot()
    this._hasPendingViewChanges = false
  }

  private restoreViewFromSaved(): void {
    const viewsData = this._viewsData
    if (!viewsData) {
      this.columnsModel.restoreFromView(undefined)
      this.sortModel.restoreFromView(undefined)
      return
    }

    const defaultView = viewsData.views.find((v) => v.id === viewsData.defaultViewId)
    this.columnsModel.restoreFromView(defaultView)
    this.sortModel.restoreFromView(defaultView)
  }

  private markViewsAsChanged(): void {
    if (!this._savedViewsSnapshot) {
      this._hasPendingViewChanges = true
      return
    }

    const currentSnapshot = this.getCurrentViewSnapshot()
    this._hasPendingViewChanges = currentSnapshot !== this._savedViewsSnapshot
  }

  private getCurrentViewSnapshot(): string {
    const columns = this.columnsModel.serializeToViewColumns()
    const sorts = this.sortModel.serializeToViewSorts()
    return JSON.stringify({ columns, sorts })
  }

  public async saveViewSettings(): Promise<boolean> {
    if (!this.projectContext.isDraftRevision) {
      return false
    }

    this._isSavingViews = true
    this.ensureViewsData()

    const viewsData = this._viewsData
    if (!viewsData) {
      this._isSavingViews = false
      return false
    }

    const updatedView = this.buildDefaultView()
    const updatedViews = this.buildUpdatedViews(updatedView)

    try {
      const result = await this.updateViewsRequest.fetch({
        data: {
          revisionId: this.revisionId,
          tableId: this._tableId,
          viewsData: {
            version: viewsData.version,
            defaultViewId: viewsData.defaultViewId,
            views: updatedViews,
          },
        },
      })

      if (result.isRight) {
        runInAction(() => {
          this._viewsData = result.data.updateTableViews
          this._savedViewsSnapshot = this.getCurrentViewSnapshot()
          this._hasPendingViewChanges = false
        })
        return true
      } else {
        toaster.error({ description: 'Failed to save view settings' })
        return false
      }
    } catch (e) {
      console.error('Failed to save views:', e)
      toaster.error({ description: 'Failed to save view settings' })
      return false
    } finally {
      runInAction(() => {
        this._isSavingViews = false
      })
    }
  }

  public revertViewSettings(): void {
    this.applyViewSettings()
  }

  private ensureViewsData(): void {
    this._viewsData ??= {
      version: 1,
      defaultViewId: 'default',
      views: [],
    }
  }

  private buildDefaultView(): ViewInput {
    const columns = this.columnsModel.serializeToViewColumns()
    const sorts = this.sortModel.serializeToViewSorts()

    return {
      id: 'default',
      name: 'Default',
      ...(columns.length > 0 && { columns }),
      ...(sorts.length > 0 && { sorts }),
    }
  }

  private buildUpdatedViews(updatedView: ViewInput): ViewInput[] {
    const views = this._viewsData?.views ?? []
    const defaultViewIndex = views.findIndex((v) => v.id === 'default')

    const convertToInput = (v: (typeof views)[0]): ViewInput => ({
      id: v.id,
      name: v.name,
      ...(v.description && { description: v.description }),
      ...(v.filters && { filters: v.filters }),
      ...(v.search && { search: v.search }),
      ...(v.columns && { columns: v.columns }),
      ...(v.sorts && {
        sorts: v.sorts.map((s) => ({
          field: s.field,
          direction: s.direction as SortOrder,
        })),
      }),
    })

    if (defaultViewIndex >= 0) {
      return views.map((v, i) => (i === defaultViewIndex ? updatedView : convertToInput(v)))
    }
    return [...views.map(convertToInput), updatedView]
  }

  private readonly getVisibleFields = (): string[] => {
    return this.columnsModel.columns.map((c) => c.id)
  }

  private readonly getVisibleRowIds = (): string[] => {
    return this.items.map((item) => item.id)
  }

  private readonly getCellStore = (rowId: string, field: string) => {
    const row = this.items.find((item) => item.id === rowId)
    return row?.cellsMap.get(field)
  }

  private readonly isCellReadonly = (rowId: string, field: string): boolean => {
    if (!this.isEdit) {
      return true
    }

    const store = this.getCellStore(rowId, field)
    if (!store) {
      return true
    }

    return 'readOnly' in store && store.readOnly === true
  }

  public dispose(): void {
    this.search.dispose()
    this.selection.exitSelectionMode()
    this.filterModel.dispose()
    this.sortModel.dispose()
    this.inlineEdit.dispose()
    this.getRowsRequest.abort()
    this._virtuosoRef = null
  }

  public setSearchQuery(query: string): void {
    this.search.setQuery(query)
  }

  public clearSearch(): void {
    this.search.clear()
  }

  public async tryToFetchNextPage(): Promise<void> {
    if (!this.listState.hasNextPage || this._isLoadingMore || !this.listState.endCursor) {
      return
    }

    this._isLoadingMore = true

    try {
      const result = await this.getRowsRequest.fetch({
        data: {
          revisionId: this.revisionId,
          tableId: this._tableId,
          first: PAGE_SIZE,
          after: this.listState.endCursor,
          where: this.buildWhereClause(),
          orderBy: this.sortModel.toGraphQLOrderBy(),
        },
      })

      runInAction(() => {
        if (result.isRight) {
          const newRows = result.data.rows.edges.map((edge) => edge.node)
          const newItems = this.columnsModel.createRowViewModels(newRows, {
            isEdit: this.isEdit,
            permissionContext: this.permissionContext,
            inlineEditModel: this.inlineEdit,
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
    } finally {
      runInAction(() => {
        this._isLoadingMore = false
      })
    }
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

  private readonly handleSearch = (): void => {
    void this.reload()
  }

  private readonly handleFilterChange = (): void => {
    void this.reload()
  }

  private readonly handleSortChange = (): void => {
    void this.reload()
    this.markViewsAsChanged()
  }

  private readonly handleColumnsChange = (): void => {
    this.markViewsAsChanged()
  }

  private async reload(): Promise<void> {
    this._isRefetching = true
    this.scrollToTop()
    try {
      await this.loadInitial()
    } finally {
      runInAction(() => {
        this._isRefetching = false
      })
    }
  }

  private scrollToTop(): void {
    this._virtuosoRef?.scrollToIndex({ index: 0, behavior: 'auto' })
  }

  private async loadInitial(): Promise<void> {
    const result = await this.getRowsRequest.fetch({
      data: {
        revisionId: this.revisionId,
        tableId: this._tableId,
        first: PAGE_SIZE,
        where: this.buildWhereClause(),
        orderBy: this.sortModel.toGraphQLOrderBy(),
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
        inlineEditModel: this.inlineEdit,
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
