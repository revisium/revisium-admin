import { makeAutoObservable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { EndpointType, FindBranchesQuery } from 'src/__generated__/graphql-request'
import { CreateEndpointModalViewModel } from './CreateEndpointModalViewModel.ts'
import { EndpointItem, EndpointItemViewModel } from './EndpointItemViewModel.ts'
import { SystemApiViewModel } from './SystemApiViewModel.ts'

type BranchItem = FindBranchesQuery['branches']['edges'][number]['node']

interface BranchOption {
  id: string
  name: string
}

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  error = 'error',
}

export class EndpointsPageViewModel implements IViewModel {
  private state = State.loading

  private readonly getEndpointsRequest = ObservableRequest.of(client.GetProjectEndpoints, {
    skipResetting: true,
  })
  private readonly getBranchesRequest = ObservableRequest.of(client.findBranches)

  private _items: EndpointItemViewModel[] = []
  private _hasNextPage = false
  private _endCursor: string | null = null
  private _selectedBranchId: string | null = null
  private _selectedType: EndpointType | null = null
  private _totalEndpointsCount: number | null = null
  private _isInitialLoad = true
  private _filterBranches: BranchItem[] = []

  public readonly createModal: CreateEndpointModalViewModel
  public readonly systemApi: SystemApiViewModel

  constructor(private readonly context: ProjectContext) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.createModal = new CreateEndpointModalViewModel(context, this.handleEndpointCreated)
    this.systemApi = new SystemApiViewModel()
  }

  public get showInitialLoading(): boolean {
    return this.state === State.loading && this._isInitialLoad
  }

  public get showError(): boolean {
    return this.state === State.error
  }

  public get hasNoEndpointsAtAll(): boolean {
    return this._totalEndpointsCount === 0
  }

  public get showNoEndpoints(): boolean {
    return this.state === State.empty && this.hasNoEndpointsAtAll
  }

  public get showEmptyFiltered(): boolean {
    return this.state === State.empty && !this.hasNoEndpointsAtAll
  }

  public get showList(): boolean {
    return this.state === State.list
  }

  public get showContent(): boolean {
    return !this.showInitialLoading && !this.showError && !this.showNoEndpoints
  }

  public get isFilterLoading(): boolean {
    return this.state === State.loading && !this._isInitialLoad
  }

  public get items(): EndpointItemViewModel[] {
    return this._items
  }

  public get totalCount(): number {
    return this._totalEndpointsCount ?? 0
  }

  public get hasNextPage(): boolean {
    return this._hasNextPage
  }

  public get isLoading(): boolean {
    return this.getEndpointsRequest.isLoading
  }

  public get selectedBranchId(): string | null {
    return this._selectedBranchId
  }

  public get branches(): BranchOption[] {
    return this._filterBranches.map((b) => ({ id: b.id, name: b.name }))
  }

  public get selectedBranchName(): string {
    if (!this._selectedBranchId) {
      return 'All branches'
    }
    const branch = this._filterBranches.find((b) => b.id === this._selectedBranchId)
    return branch?.name ?? 'All branches'
  }

  public get selectedType(): EndpointType | null {
    return this._selectedType
  }

  public get selectedTypeName(): string {
    if (!this._selectedType) {
      return 'All types'
    }
    return this._selectedType === EndpointType.Graphql ? 'GraphQL' : 'REST API'
  }

  public init(): void {
    this._selectedBranchId = this.context.branch.id
    void this.loadFilterBranches()
    void this.loadTotalCount()
    void this.loadInitial()
  }

  public dispose(): void {}

  public setSelectedBranchId(branchId: string | null): void {
    this._selectedBranchId = branchId
    void this.reload()
  }

  public setSelectedType(type: EndpointType | null): void {
    this._selectedType = type
    void this.reload()
  }

  public async tryToFetchNextPage(): Promise<void> {
    if (!this._hasNextPage || this.isLoading || !this._endCursor) {
      return
    }

    const result = await this.getEndpointsRequest.fetch({
      organizationId: this.organizationId,
      projectName: this.projectName,
      first: 50,
      after: this._endCursor,
      branchId: this._selectedBranchId ?? undefined,
      type: this._selectedType ?? undefined,
    })

    runInAction(() => {
      if (result.isRight) {
        const newItems = result.data.projectEndpoints.edges.map((edge) => this.createItemViewModel(edge.node))
        this._items = [...this._items, ...newItems]
        this._hasNextPage = result.data.projectEndpoints.pageInfo.hasNextPage
        this._endCursor = result.data.projectEndpoints.pageInfo.endCursor ?? null
      }
    })
  }

  private get organizationId(): string {
    return this.context.project.organization.id
  }

  private get projectName(): string {
    return this.context.project.name
  }

  private createItemViewModel(item: EndpointItem): EndpointItemViewModel {
    return new EndpointItemViewModel(this.context, item, this.handleEndpointDeleted)
  }

  private handleEndpointCreated = (): void => {
    if (this._totalEndpointsCount !== null) {
      this._totalEndpointsCount++
    }
    void this.reload()
  }

  private handleEndpointDeleted = (): void => {
    if (this._totalEndpointsCount !== null) {
      this._totalEndpointsCount--
    }
    void this.reload()
  }

  private async reload(): Promise<void> {
    this._items = []
    this._hasNextPage = false
    this._endCursor = null
    this._isInitialLoad = false
    this.state = State.loading
    await this.loadInitial()
  }

  private async loadInitial(): Promise<void> {
    const result = await this.getEndpointsRequest.fetch({
      organizationId: this.organizationId,
      projectName: this.projectName,
      first: 50,
      branchId: this._selectedBranchId ?? undefined,
      type: this._selectedType ?? undefined,
    })

    runInAction(() => {
      if (result.isRight) {
        this._items = result.data.projectEndpoints.edges.map((edge) => this.createItemViewModel(edge.node))
        this._hasNextPage = result.data.projectEndpoints.pageInfo.hasNextPage
        this._endCursor = result.data.projectEndpoints.pageInfo.endCursor ?? null

        if (this._items.length > 0) {
          this.state = State.list
        } else {
          this.state = State.empty
        }
      } else {
        this.state = State.error
      }
    })
  }

  private async loadTotalCount(): Promise<void> {
    try {
      const result = await this.getEndpointsRequest.fetch({
        organizationId: this.organizationId,
        projectName: this.projectName,
        first: 1,
      })
      runInAction(() => {
        if (result.isRight) {
          this._totalEndpointsCount = result.data.projectEndpoints.totalCount
        }
      })
    } catch (e) {
      console.error(e)
    }
  }

  private async loadFilterBranches(): Promise<void> {
    try {
      const result = await this.getBranchesRequest.fetch({
        data: {
          organizationId: this.organizationId,
          projectName: this.projectName,
          first: 100,
        },
      })
      runInAction(() => {
        if (result.isRight) {
          this._filterBranches = result.data.branches.edges.map((edge) => edge.node)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}

container.register(
  EndpointsPageViewModel,
  () => {
    const context = container.get(ProjectContext)
    return new EndpointsPageViewModel(context)
  },
  { scope: 'request' },
)
