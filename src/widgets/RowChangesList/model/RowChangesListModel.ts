import { makeAutoObservable, runInAction } from 'mobx'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { ChangeType, GetTableChangesForFilterQuery } from 'src/__generated__/graphql-request'
import { TypeFilterModel } from 'src/entities/Changes'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker'
import { RowChangeItemModel } from './RowChangeItemModel'
import { TableFilterModel } from './TableFilterModel'
import { RowDetailModalModel } from 'src/widgets/RowDetailModal'

type TableForFilter = GetTableChangesForFilterQuery['tableChanges']['edges'][number]['node']

export class RowChangesListModel {
  private readonly getRowChangesRequest = ObservableRequest.of(client.GetRowChanges, {
    skipResetting: true,
  })

  private readonly getTablesForFilterRequest = ObservableRequest.of(client.GetTableChangesForFilter, {
    skipResetting: true,
  })

  private _itemModels: RowChangeItemModel[] = []
  private _hasNextPage = false
  private _endCursor: string | null = null
  private _search: string = ''
  private _searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
  private _tables: TableForFilter[] = []

  public readonly typeFilterModel: TypeFilterModel
  public readonly tableFilterModel: TableFilterModel
  public readonly detailModalModel: RowDetailModalModel

  constructor(
    private revisionId: string,
    linkMaker: LinkMaker,
    tableId?: string,
  ) {
    this.typeFilterModel = new TypeFilterModel((types) => this.handleTypesChange(types))
    this.tableFilterModel = new TableFilterModel((id) => this.handleTableChange(id), tableId ?? null)
    this.detailModalModel = new RowDetailModalModel(linkMaker)
    makeAutoObservable(this)
    void this.loadInitial()
    void this.loadTablesForFilter()
  }

  public get itemModels(): RowChangeItemModel[] {
    return this._itemModels
  }

  public get totalCount(): number {
    return this.getRowChangesRequest.data?.rowChanges.totalCount ?? 0
  }

  public get hasNextPage(): boolean {
    return this._hasNextPage
  }

  public get isLoading(): boolean {
    return this.getRowChangesRequest.isLoading
  }

  public get selectedChangeTypes(): ChangeType[] {
    return this.typeFilterModel.selectedTypes
  }

  public get tableId(): string | null {
    return this.tableFilterModel.selectedTableId
  }

  public get search(): string {
    return this._search
  }

  public get showTableFilter(): boolean {
    return this._tables.length > 0
  }

  public get showSearch(): boolean {
    return true
  }

  public get hasActiveFilters(): boolean {
    return this.typeFilterModel.hasSelection || this.tableId !== null || this._search.trim() !== ''
  }

  private handleTypesChange(_types: ChangeType[]): void {
    void this.reload()
  }

  private handleTableChange(_tableId: string | null): void {
    void this.reload()
  }

  public setSearch(search: string): void {
    this._search = search
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer)
    }
    this._searchDebounceTimer = setTimeout(() => {
      void this.reload()
    }, 300)
  }

  public openDetail(itemModel: RowChangeItemModel): void {
    this.detailModalModel.open(itemModel.item)
  }

  private async loadTablesForFilter(): Promise<void> {
    try {
      const result = await this.getTablesForFilterRequest.fetch({
        revisionId: this.revisionId,
      })

      runInAction(() => {
        if (result.isRight) {
          this._tables = result.data.tableChanges.edges.map((edge) => edge.node)
          this.tableFilterModel.setTables(this._tables)
        }
      })
    } catch (e) {
      console.error('RowChangesListModel: Failed to load tables for filter', e)
    }
  }

  private getFilters() {
    const selectedTypes = this.typeFilterModel.selectedTypes
    const hasRenamed = selectedTypes.includes(ChangeType.Renamed)
    const hasModified = selectedTypes.includes(ChangeType.Modified)

    let changeTypes = selectedTypes

    if (hasRenamed && hasModified) {
      changeTypes = [
        ...selectedTypes.filter((t) => t !== ChangeType.Renamed && t !== ChangeType.Modified),
        ChangeType.RenamedAndModified,
      ]
    }

    const tableId = this.tableFilterModel.selectedTableId

    return {
      includeSystem: false,
      ...(tableId && { tableId }),
      ...(changeTypes.length > 0 && { changeTypes }),
      ...(this._search.trim() && { search: this._search.trim() }),
    }
  }

  private async reload(): Promise<void> {
    this._itemModels = []
    this._hasNextPage = false
    this._endCursor = null
    await this.loadInitial()
  }

  private async loadInitial(): Promise<void> {
    try {
      const result = await this.getRowChangesRequest.fetch({
        revisionId: this.revisionId,
        first: 50,
        filters: this.getFilters(),
      })

      runInAction(() => {
        if (result.isRight) {
          this._itemModels = result.data.rowChanges.edges.map((edge) => new RowChangeItemModel(edge.node))
          this._hasNextPage = result.data.rowChanges.pageInfo.hasNextPage
          this._endCursor = result.data.rowChanges.pageInfo.endCursor ?? null
        } else {
          console.error('RowChangesListModel: Failed to load row changes', result.error)
        }
      })
    } catch (e) {
      console.error('RowChangesListModel: Exception while loading row changes', e)
    }
  }

  public async tryToFetchNextPage(): Promise<void> {
    if (!this._hasNextPage || this.isLoading || !this._endCursor) {
      return
    }

    const result = await this.getRowChangesRequest.fetch({
      revisionId: this.revisionId,
      first: 50,
      after: this._endCursor,
      filters: this.getFilters(),
    })

    runInAction(() => {
      if (result.isRight) {
        const newModels = result.data.rowChanges.edges.map((edge) => new RowChangeItemModel(edge.node))
        this._itemModels = [...this._itemModels, ...newModels]
        this._hasNextPage = result.data.rowChanges.pageInfo.hasNextPage
        this._endCursor = result.data.rowChanges.pageInfo.endCursor ?? null
      }
    })
  }
}
