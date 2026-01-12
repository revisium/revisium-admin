import { IReactionDisposer, makeAutoObservable, reaction, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext'
import { AssetsDataSource, TableWithFiles } from 'src/pages/AssetsPage/api/AssetsDataSource'
import { AssetItemViewModel, AssetItemViewModelFactory } from 'src/pages/AssetsPage/model/AssetItemViewModel'
import { AssetsFilterModel } from 'src/pages/AssetsPage/model/AssetsFilterModel'
import { IViewModel } from 'src/shared/config/types'
import { container } from 'src/shared/lib'

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  error = 'error',
}

export class AssetsPageViewModel implements IViewModel {
  private _state = State.loading
  private _revisionReaction: IReactionDisposer | null = null
  private _filterReaction: IReactionDisposer | null = null
  private _selectedFile: AssetItemViewModel | null = null

  constructor(
    private readonly context: ProjectContext,
    private readonly dataSource: AssetsDataSource,
    public readonly filterModel: AssetsFilterModel,
    private readonly assetItemFactory: AssetItemViewModelFactory,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get showLoading(): boolean {
    return this._state === State.loading
  }

  public get showError(): boolean {
    return this._state === State.error
  }

  public get showEmpty(): boolean {
    return this._state === State.empty
  }

  public get showList(): boolean {
    return this._state === State.list
  }

  public get isLoadingFiles(): boolean {
    return this.dataSource.isLoadingFiles
  }

  public get tables(): TableWithFiles[] {
    return this.dataSource.tables
  }

  public get hasTablesWithFiles(): boolean {
    return this.dataSource.tables.length > 0
  }

  public get totalFilesCount(): number {
    return this.dataSource.totalFilesCount
  }

  public get items(): AssetItemViewModel[] {
    const files = this.dataSource.files
    return files.map((file) => this.assetItemFactory.create(file))
  }

  public get filteredCount(): number {
    return this.dataSource.files.length
  }

  public get showNoMatchesMessage(): boolean {
    return this.showList && this.filteredCount === 0 && this.filterModel.hasActiveFilters
  }

  public get selectedFile(): AssetItemViewModel | null {
    return this._selectedFile
  }

  public get selectedTableId(): string | null {
    return this.filterModel.tableId
  }

  public get branchName(): string {
    return this.context.branchName
  }

  public get tablesCount(): number {
    return this.dataSource.tables.length
  }

  public init(): void {
    void this.load()
    this._revisionReaction = reaction(
      () => this.context.revisionId,
      () => {
        this.reset()
        void this.load()
      },
    )
    this._filterReaction = reaction(
      () => this.filterModel.filter,
      () => {
        void this.loadFilesWithCurrentFilter()
      },
    )
  }

  public dispose(): void {
    this._revisionReaction?.()
    this._revisionReaction = null
    this._filterReaction?.()
    this._filterReaction = null
    this.filterModel.dispose()
    this.dataSource.dispose()
  }

  public selectTable(tableId: string | null): void {
    this.filterModel.setTableId(tableId)
  }

  public selectFile(item: AssetItemViewModel): void {
    this._selectedFile = item
  }

  public closeFileDetails(): void {
    this._selectedFile = null
  }

  public clearFilters(): void {
    this.filterModel.clearFilters()
  }

  public async reload(): Promise<void> {
    this.reset()
    await this.load()
  }

  private reset(): void {
    this._state = State.loading
    this.dataSource.reset()
    this.filterModel.clearFilters()
    this._selectedFile = null
  }

  private async load(): Promise<void> {
    const success = await this.dataSource.loadTablesWithFiles(this.context.revisionId)

    if (!success) {
      if (this.dataSource.error) {
        runInAction(() => {
          this._state = State.error
        })
      }
      return
    }

    if (!this.hasTablesWithFiles) {
      runInAction(() => {
        this._state = State.empty
      })
      return
    }

    await this.loadFilesWithCurrentFilter()
  }

  private async loadFilesWithCurrentFilter(): Promise<void> {
    await this.dataSource.loadFiles(this.context.revisionId, this.filterModel.filter)

    runInAction(() => {
      this._state = State.list
    })
  }
}

container.register(
  AssetsPageViewModel,
  () => {
    const context = container.get(ProjectContext)
    const dataSource = container.get(AssetsDataSource)
    const filterModel = container.get(AssetsFilterModel)
    const assetItemFactory = container.get(AssetItemViewModelFactory)

    return new AssetsPageViewModel(context, dataSource, filterModel, assetItemFactory)
  },
  { scope: 'request' },
)
