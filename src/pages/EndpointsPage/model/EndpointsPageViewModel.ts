import { makeAutoObservable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, isAborted } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { EndpointFragment, EndpointType, FindBranchesQuery } from 'src/__generated__/graphql-request'
import { CreateEndpointModalViewModel } from './CreateEndpointModalViewModel.ts'
import { EndpointItemViewModel } from './EndpointItemViewModel.ts'
import { SystemApiViewModel } from './SystemApiViewModel.ts'

type BranchItem = FindBranchesQuery['branches']['edges'][number]['node']

interface BranchOption {
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
  private readonly getTotalCountRequest = ObservableRequest.of(client.GetProjectEndpoints)
  private readonly getBranchesRequest = ObservableRequest.of(client.findBranches)

  private _items: EndpointItemViewModel[] = []
  private _hasNextPage = false
  private _endCursor: string | null = null
  private _selectedBranchName: string | null = null
  private _selectedType: EndpointType | null = null
  private _totalEndpointsCount: number | null = null
  private _isInitialLoad = true
  private _filterBranches: BranchItem[] = []

  public readonly createModal: CreateEndpointModalViewModel
  public readonly systemApi: SystemApiViewModel

  constructor(
    private readonly context: ProjectContext,
    private readonly permissionContext: PermissionContext,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.createModal = new CreateEndpointModalViewModel(context, this.handleEndpointCreated)
    this.systemApi = new SystemApiViewModel()
  }

  public get canCreateEndpoint(): boolean {
    return this.permissionContext.canCreateEndpoint
  }

  public get canDeleteEndpoint(): boolean {
    return this.permissionContext.canDeleteEndpoint
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

  public get selectedBranchName(): string | null {
    return this._selectedBranchName
  }

  public get branches(): BranchOption[] {
    return this._filterBranches.map((b) => ({ name: b.name }))
  }

  public get selectedBranchLabel(): string {
    return this._selectedBranchName ?? 'All branches'
  }

  private get selectedBranchId(): string | null {
    if (!this._selectedBranchName) {
      return null
    }
    const branch = this._filterBranches.find((b) => b.name === this._selectedBranchName)
    return branch?.id ?? null
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
    this._selectedBranchName = this.context.branchName
    void this.loadFilterBranches().then(() => {
      void this.loadTotalCount()
      void this.loadInitial()
    })
  }

  public dispose(): void {}

  public setSelectedBranchName(branchName: string | null): void {
    this._selectedBranchName = branchName
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
      branchId: this.selectedBranchId ?? undefined,
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
    return this.context.organizationId
  }

  private get projectName(): string {
    return this.context.projectName
  }

  private createItemViewModel(item: EndpointFragment): EndpointItemViewModel {
    return new EndpointItemViewModel(this.context, this.permissionContext, item, this.handleEndpointDeleted)
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
      branchId: this.selectedBranchId ?? undefined,
      type: this._selectedType ?? undefined,
    })

    if (!result.isRight) {
      if (isAborted(result)) {
        return
      }
      runInAction(() => {
        this.state = State.error
      })
      return
    }

    runInAction(() => {
      this._items = result.data.projectEndpoints.edges.map((edge) => this.createItemViewModel(edge.node))
      this._hasNextPage = result.data.projectEndpoints.pageInfo.hasNextPage
      this._endCursor = result.data.projectEndpoints.pageInfo.endCursor ?? null

      if (this._items.length > 0) {
        this.state = State.list
      } else {
        this.state = State.empty
      }
    })
  }

  private async loadTotalCount(): Promise<void> {
    const result = await this.getTotalCountRequest.fetch({
      organizationId: this.organizationId,
      projectName: this.projectName,
      first: 1,
    })

    if (!result.isRight) {
      return
    }

    runInAction(() => {
      this._totalEndpointsCount = result.data.projectEndpoints.totalCount
    })
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
    const permissionContext = container.get(PermissionContext)
    return new EndpointsPageViewModel(context, permissionContext)
  },
  { scope: 'request' },
)
