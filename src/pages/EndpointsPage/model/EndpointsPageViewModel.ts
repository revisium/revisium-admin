import { makeAutoObservable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { EndpointFragment, EndpointType } from 'src/__generated__/graphql-request'
import { BranchWithRevisions, EndpointsDataSource } from '../api/EndpointsDataSource.ts'
import { BranchEndpointsViewModel, BranchEndpointsViewModelFactory } from './BranchEndpointsViewModel.ts'
import { CreateEndpointDialogViewModel, CreateEndpointDialogViewModelFactory } from './CreateEndpointDialogViewModel.ts'
import { CustomEndpointCardViewModel, CustomEndpointCardViewModelFactory } from './CustomEndpointCardViewModel.ts'
import { SystemApiViewModel } from './SystemApiViewModel.ts'

enum State {
  loading = 'loading',
  ready = 'ready',
  error = 'error',
}

export type TabType = 'graphql' | 'rest-api' | 'system-api'

export class EndpointsPageViewModel implements IViewModel {
  private _state = State.loading
  private _selectedTab: TabType = 'graphql'
  private _branches: BranchWithRevisions[] = []
  private _endpoints: EndpointFragment[] = []
  private _branchViewModels: BranchEndpointsViewModel[] = []
  private _customEndpointViewModels: CustomEndpointCardViewModel[] = []
  private _createDialogViewModel: CreateEndpointDialogViewModel | null = null

  public readonly systemApi: SystemApiViewModel

  constructor(
    private readonly context: ProjectContext,
    private readonly projectPermissions: ProjectPermissions,
    private readonly dataSource: EndpointsDataSource,
    private readonly branchViewModelFactory: BranchEndpointsViewModelFactory,
    private readonly customEndpointFactory: CustomEndpointCardViewModelFactory,
    private readonly createDialogFactory: CreateEndpointDialogViewModelFactory,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.systemApi = new SystemApiViewModel()
  }

  public get isLoading(): boolean {
    return this._state === State.loading
  }

  public get isError(): boolean {
    return this._state === State.error
  }

  public get isReady(): boolean {
    return this._state === State.ready
  }

  public get organizationId(): string {
    return this.context.organizationId
  }

  public get projectName(): string {
    return this.context.projectName
  }

  public get selectedTab(): TabType {
    return this._selectedTab
  }

  public get isGraphqlTab(): boolean {
    return this._selectedTab === 'graphql'
  }

  public get isRestApiTab(): boolean {
    return this._selectedTab === 'rest-api'
  }

  public get isSystemApiTab(): boolean {
    return this._selectedTab === 'system-api'
  }

  public get selectedEndpointType(): EndpointType {
    return this._selectedTab === 'rest-api' ? EndpointType.RestApi : EndpointType.Graphql
  }

  public get branchSections(): BranchEndpointsViewModel[] {
    return this._branchViewModels
  }

  public get hasBranches(): boolean {
    return this._branches.length > 0
  }

  public get customEndpoints(): CustomEndpointCardViewModel[] {
    return this._customEndpointViewModels
  }

  public get hasCustomEndpoints(): boolean {
    return this._customEndpointViewModels.length > 0
  }

  public async deleteCustomEndpoint(endpointId: string): Promise<void> {
    const success = await this.dataSource.deleteEndpoint(endpointId)
    if (success) {
      void this.reload()
    }
  }

  public get canCreateEndpoint(): boolean {
    return this.projectPermissions.canCreateEndpoint
  }

  public get canDeleteEndpoint(): boolean {
    return this.projectPermissions.canDeleteEndpoint
  }

  public get createDialog(): CreateEndpointDialogViewModel | null {
    return this._createDialogViewModel
  }

  public openCreateDialog(): void {
    this._createDialogViewModel ??= this.createDialogFactory.create(this._branches, this.handleEndpointChanged)
    this._createDialogViewModel.open()
  }

  public init(): void {
    void this.load()
  }

  public dispose(): void {
    this.dataSource.dispose()
  }

  public setSelectedTab(tab: TabType): void {
    if (this._selectedTab !== tab) {
      this._selectedTab = tab
      if (tab !== 'system-api') {
        this.rebuildViewModels()
      }
    }
  }

  private async load(): Promise<void> {
    this._state = State.loading

    const [branches, endpointsResult] = await Promise.all([
      this.dataSource.getBranches(this.context.organizationId, this.context.projectName),
      this.dataSource.getEndpoints({
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
        first: 1000,
      }),
    ])

    runInAction(() => {
      if (!branches || !endpointsResult) {
        if (!this.dataSource.wasAborted) {
          this._state = State.error
        }
        return
      }

      this._branches = this.sortBranches(branches)
      this._endpoints = endpointsResult.items
      this.rebuildViewModels()
      this._state = State.ready
    })
  }

  private async reload(): Promise<void> {
    const endpointsResult = await this.dataSource.getEndpoints({
      organizationId: this.context.organizationId,
      projectName: this.context.projectName,
      first: 1000,
    })

    runInAction(() => {
      if (endpointsResult) {
        this._endpoints = endpointsResult.items
        this.rebuildViewModels()
      }
    })
  }

  private sortBranches(branches: BranchWithRevisions[]): BranchWithRevisions[] {
    return [...branches].sort((a, b) => {
      if (a.isRoot && !b.isRoot) {
        return -1
      }
      if (!a.isRoot && b.isRoot) {
        return 1
      }
      return a.name.localeCompare(b.name)
    })
  }

  private rebuildViewModels(): void {
    this.rebuildBranchViewModels()
    this.rebuildCustomEndpointViewModels()
  }

  private rebuildBranchViewModels(): void {
    const endpointType = this.selectedEndpointType
    this._branchViewModels = this._branches.map((branch) => {
      const draftEndpointId = this.findEndpointId(branch.draftRevisionId, endpointType)
      const headEndpointId = this.findEndpointId(branch.headRevisionId, endpointType)

      return this.branchViewModelFactory.create(
        branch,
        endpointType,
        draftEndpointId,
        headEndpointId,
        this.handleEndpointChanged,
      )
    })
  }

  private rebuildCustomEndpointViewModels(): void {
    const draftHeadRevisionIds = new Set<string>()
    for (const branch of this._branches) {
      draftHeadRevisionIds.add(branch.draftRevisionId)
      draftHeadRevisionIds.add(branch.headRevisionId)
    }

    const endpointType = this.selectedEndpointType
    this._customEndpointViewModels = this._endpoints
      .filter((e) => e.type === endpointType && !draftHeadRevisionIds.has(e.revisionId))
      .map((endpoint) => this.customEndpointFactory.create(endpoint))
  }

  private findEndpointId(revisionId: string, type: EndpointType): string | null {
    const endpoint = this._endpoints.find((e) => e.revisionId === revisionId && e.type === type)
    return endpoint?.id ?? null
  }

  private readonly handleEndpointChanged = (): void => {
    void this.reload()
  }
}

container.register(
  EndpointsPageViewModel,
  () => {
    const context = container.get(ProjectContext)
    const projectPermissions = container.get(ProjectPermissions)
    const dataSource = container.get(EndpointsDataSource)
    const branchViewModelFactory = container.get(BranchEndpointsViewModelFactory)
    const customEndpointFactory = container.get(CustomEndpointCardViewModelFactory)
    const createDialogFactory = container.get(CreateEndpointDialogViewModelFactory)

    return new EndpointsPageViewModel(
      context,
      projectPermissions,
      dataSource,
      branchViewModelFactory,
      customEndpointFactory,
      createDialogFactory,
    )
  },
  { scope: 'request' },
)
