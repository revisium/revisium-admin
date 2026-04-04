import { makeAutoObservable, runInAction } from 'mobx'
import { OrganizationContext } from 'src/entities/Organization/model/OrganizationContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, isAborted } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { PermissionService, SystemPermissions } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { UserOrganizationItemFragment } from 'src/__generated__/graphql-request'
import { AddOrgMemberModalViewModel } from './AddOrgMemberModalViewModel.ts'
import { OrgMemberItemViewModel } from './OrgMemberItemViewModel.ts'

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  error = 'error',
}

export class OrganizationMembersPageViewModel implements IViewModel {
  private state = State.loading

  private readonly getMembersRequest = ObservableRequest.of(client.getUsersOrganization, {
    skipResetting: true,
  })

  private _items: OrgMemberItemViewModel[] = []
  private _hasNextPage = false
  private _endCursor: string | null = null
  private _totalCount: number | null = null
  private _isInitialLoad = true

  public readonly addMemberModal: AddOrgMemberModalViewModel

  constructor(
    private readonly context: OrganizationContext,
    private readonly permissionService: PermissionService,
    systemPermissions: SystemPermissions,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.addMemberModal = new AddOrgMemberModalViewModel(context, systemPermissions, this.handleMemberAdded)
  }

  public get canAddMember(): boolean {
    return this.permissionService.can('add', 'User', { organizationId: this.context.organizationId })
  }

  public get showInitialLoading(): boolean {
    return this.state === State.loading && this._isInitialLoad
  }

  public get showError(): boolean {
    return this.state === State.error
  }

  public get showNoMembers(): boolean {
    return this.state === State.empty && this._totalCount === 0
  }

  public get showList(): boolean {
    return this.state === State.list
  }

  public get items(): OrgMemberItemViewModel[] {
    return this._items
  }

  public get totalCount(): number {
    return this._totalCount ?? 0
  }

  public get hasNextPage(): boolean {
    return this._hasNextPage
  }

  public get isLoading(): boolean {
    return this.getMembersRequest.isLoading
  }

  public init(): void {
    void this.loadInitial()
  }

  public dispose(): void {
    this.addMemberModal.dispose()
  }

  public async tryToFetchNextPage(): Promise<void> {
    if (!this._hasNextPage || this.isLoading || !this._endCursor) {
      return
    }

    const result = await this.getMembersRequest.fetch({
      organizationId: this.context.organizationId,
      first: 50,
      after: this._endCursor,
    })

    runInAction(() => {
      if (result.isRight) {
        const newItems = result.data.usersOrganization.edges.map((edge) => this.createItemViewModel(edge.node))
        this._items = [...this._items, ...newItems]
        this._hasNextPage = result.data.usersOrganization.pageInfo.hasNextPage
        this._endCursor = result.data.usersOrganization.pageInfo.endCursor ?? null
      }
    })
  }

  private createItemViewModel(item: UserOrganizationItemFragment): OrgMemberItemViewModel {
    return new OrgMemberItemViewModel(this.context, this.permissionService, item, this.handleMemberRemoved)
  }

  private readonly handleMemberAdded = (): void => {
    if (this._totalCount !== null) {
      this._totalCount++
    }
    void this.reload()
  }

  private readonly handleMemberRemoved = (): void => {
    if (this._totalCount !== null) {
      this._totalCount--
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
    const result = await this.getMembersRequest.fetch({
      organizationId: this.context.organizationId,
      first: 50,
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
      this._items = result.data.usersOrganization.edges.map((edge) => this.createItemViewModel(edge.node))
      this._hasNextPage = result.data.usersOrganization.pageInfo.hasNextPage
      this._endCursor = result.data.usersOrganization.pageInfo.endCursor ?? null
      this._totalCount = result.data.usersOrganization.totalCount

      if (this._items.length > 0) {
        this.state = State.list
      } else {
        this.state = State.empty
      }
    })
  }
}

container.register(
  OrganizationMembersPageViewModel,
  () => {
    const context = container.get(OrganizationContext)
    const permissionService = container.get(PermissionService)
    const systemPermissions = container.get(SystemPermissions)
    return new OrganizationMembersPageViewModel(context, permissionService, systemPermissions)
  },
  { scope: 'request' },
)
