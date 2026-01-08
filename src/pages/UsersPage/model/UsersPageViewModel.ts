import { makeAutoObservable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { UserProjectItemFragment } from 'src/__generated__/graphql-request'
import { AddUserModalViewModel } from './AddUserModalViewModel.ts'
import { UserItemViewModel } from './UserItemViewModel.ts'

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  error = 'error',
}

export class UsersPageViewModel implements IViewModel {
  private state = State.loading

  private readonly getUsersRequest = ObservableRequest.of(client.getUsersProject, {
    skipResetting: true,
  })

  private _items: UserItemViewModel[] = []
  private _hasNextPage = false
  private _endCursor: string | null = null
  private _totalCount: number | null = null
  private _isInitialLoad = true

  public readonly addUserModal: AddUserModalViewModel

  constructor(
    private readonly context: ProjectContext,
    private readonly permissionContext: PermissionContext,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.addUserModal = new AddUserModalViewModel(context, permissionContext, this.handleUserAdded)
  }

  public get canAddUser(): boolean {
    return this.permissionContext.canAddUser
  }

  public get canCreateUser(): boolean {
    return this.permissionContext.canCreateUser
  }

  public get showInitialLoading(): boolean {
    return this.state === State.loading && this._isInitialLoad
  }

  public get showError(): boolean {
    return this.state === State.error
  }

  public get showNoUsers(): boolean {
    return this.state === State.empty && this._totalCount === 0
  }

  public get showList(): boolean {
    return this.state === State.list
  }

  public get items(): UserItemViewModel[] {
    return this._items
  }

  public get totalCount(): number {
    return this._totalCount ?? 0
  }

  public get hasNextPage(): boolean {
    return this._hasNextPage
  }

  public get isLoading(): boolean {
    return this.getUsersRequest.isLoading
  }

  public init(): void {
    void this.loadInitial()
  }

  public dispose(): void {}

  public async tryToFetchNextPage(): Promise<void> {
    if (!this._hasNextPage || this.isLoading || !this._endCursor) {
      return
    }

    const result = await this.getUsersRequest.fetch({
      organizationId: this.organizationId,
      projectName: this.projectName,
      first: 50,
      after: this._endCursor,
    })

    runInAction(() => {
      if (result.isRight) {
        const newItems = result.data.usersProject.edges.map((edge) => this.createItemViewModel(edge.node))
        this._items = [...this._items, ...newItems]
        this._hasNextPage = result.data.usersProject.pageInfo.hasNextPage
        this._endCursor = result.data.usersProject.pageInfo.endCursor ?? null
      }
    })
  }

  private get organizationId(): string {
    return this.context.organizationId
  }

  private get projectName(): string {
    return this.context.projectName
  }

  private createItemViewModel(item: UserProjectItemFragment): UserItemViewModel {
    return new UserItemViewModel(this.context, this.permissionContext, item, this.handleUserRemoved)
  }

  private handleUserAdded = (): void => {
    if (this._totalCount !== null) {
      this._totalCount++
    }
    void this.reload()
  }

  private handleUserRemoved = (): void => {
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
    const result = await this.getUsersRequest.fetch({
      organizationId: this.organizationId,
      projectName: this.projectName,
      first: 50,
    })

    runInAction(() => {
      if (result.isRight) {
        this._items = result.data.usersProject.edges.map((edge) => this.createItemViewModel(edge.node))
        this._hasNextPage = result.data.usersProject.pageInfo.hasNextPage
        this._endCursor = result.data.usersProject.pageInfo.endCursor ?? null
        this._totalCount = result.data.usersProject.totalCount

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
}

container.register(
  UsersPageViewModel,
  () => {
    const context = container.get(ProjectContext)
    const permissionContext = container.get(PermissionContext)
    return new UsersPageViewModel(context, permissionContext)
  },
  { scope: 'request' },
)
