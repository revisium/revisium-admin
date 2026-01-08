import { makeAutoObservable, runInAction } from 'mobx'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { GetTableChangesQuery, ChangeType } from 'src/__generated__/graphql-request'
import { TypeFilterModel } from 'src/entities/Changes'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext'
import { IViewModel } from 'src/shared/config/types'
import { TableChangeItemModel } from './TableChangeItemModel'
import { TableDetailModalModel } from './TableDetailModalModel'

type TableChangeItem = GetTableChangesQuery['tableChanges']['edges'][number]['node']

export class TableChangesListModel implements IViewModel {
  private readonly getTableChangesRequest = ObservableRequest.of(client.GetTableChanges, {
    skipResetting: true,
  })

  private _items: TableChangeItem[] = []
  private _itemModels: TableChangeItemModel[] = []
  private _hasNextPage = false
  private _endCursor: string | null = null

  public readonly typeFilterModel: TypeFilterModel
  public readonly detailModalModel: TableDetailModalModel

  constructor(
    private readonly context: ProjectContext,
    private readonly linkMaker: LinkMaker,
  ) {
    this.typeFilterModel = new TypeFilterModel((types) => this.handleTypesChange(types))
    this.detailModalModel = new TableDetailModalModel(this.linkMaker)
    makeAutoObservable(this)
  }

  private get revisionId(): string {
    return this.context.revisionId
  }

  public init(): void {
    void this.loadInitial()
  }

  public dispose(): void {}

  public get items(): TableChangeItem[] {
    return this._items
  }

  public get itemModels(): TableChangeItemModel[] {
    return this._itemModels
  }

  public get totalCount(): number {
    return this.getTableChangesRequest.data?.tableChanges.totalCount ?? 0
  }

  public get hasNextPage(): boolean {
    return this._hasNextPage
  }

  public get isLoading(): boolean {
    return this.getTableChangesRequest.isLoading
  }

  public get selectedChangeTypes(): ChangeType[] {
    return this.typeFilterModel.selectedTypes
  }

  public get hasActiveFilters(): boolean {
    return this.typeFilterModel.hasSelection
  }

  private handleTypesChange(_types: ChangeType[]): void {
    void this.reload()
  }

  public openDetail(itemModel: TableChangeItemModel): void {
    this.detailModalModel.open(itemModel.item)
  }

  // Keep for backward compatibility
  public setSelectedChangeTypes(types: ChangeType[]): void {
    this.typeFilterModel.setSelectedTypes(types)
    void this.reload()
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

    return {
      includeSystem: true,
      ...(changeTypes.length > 0 && { changeTypes }),
    }
  }

  private async reload(): Promise<void> {
    this._items = []
    this._itemModels = []
    this._hasNextPage = false
    this._endCursor = null
    await this.loadInitial()
  }

  private async loadInitial(): Promise<void> {
    const result = await this.getTableChangesRequest.fetch({
      revisionId: this.revisionId,
      first: 50,
      filters: this.getFilters(),
    })

    runInAction(() => {
      if (result.isRight) {
        this._items = result.data.tableChanges.edges.map((edge) => edge.node)
        this._itemModels = this._items.map((item) => new TableChangeItemModel(item))
        this._hasNextPage = result.data.tableChanges.pageInfo.hasNextPage
        this._endCursor = result.data.tableChanges.pageInfo.endCursor ?? null
      }
    })
  }

  public async tryToFetchNextPage(): Promise<void> {
    if (!this._hasNextPage || this.isLoading || !this._endCursor) {
      return
    }

    const result = await this.getTableChangesRequest.fetch({
      revisionId: this.revisionId,
      first: 50,
      after: this._endCursor,
      filters: this.getFilters(),
    })

    runInAction(() => {
      if (result.isRight) {
        const newItems = result.data.tableChanges.edges.map((edge) => edge.node)
        this._items = [...this._items, ...newItems]
        this._itemModels = [...this._itemModels, ...newItems.map((item) => new TableChangeItemModel(item))]
        this._hasNextPage = result.data.tableChanges.pageInfo.hasNextPage
        this._endCursor = result.data.tableChanges.pageInfo.endCursor ?? null
      }
    })
  }
}

container.register(
  TableChangesListModel,
  () => new TableChangesListModel(container.get(ProjectContext), container.get(LinkMaker)),
  { scope: 'request' },
)
