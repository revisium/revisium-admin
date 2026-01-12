import { action, computed, makeObservable, observable, override } from 'mobx'
import { AdminUserItemFragment } from 'src/__generated__/graphql-request'
import { container, PaginatedListViewModel } from 'src/shared/lib'
import { SystemPermissions } from 'src/shared/model/AbilityService'
import { AdminCreateUserDataSource } from './AdminCreateUserDataSource'
import { AdminCreateUserModalViewModel } from './AdminCreateUserModalViewModel'
import { AdminUsersDataSource } from './AdminUsersDataSource'
import { AdminUserItemViewModel } from './AdminUserItemViewModel'

export class AdminUsersViewModel extends PaginatedListViewModel<AdminUserItemFragment, AdminUserItemViewModel> {
  public readonly createUserModal: AdminCreateUserModalViewModel
  private _searchQuery = ''
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null

  constructor(
    dataSource: AdminUsersDataSource,
    createUserDataSource: AdminCreateUserDataSource,
    systemPermissions: SystemPermissions,
  ) {
    super(dataSource)

    this.createUserModal = new AdminCreateUserModalViewModel(createUserDataSource, systemPermissions, () =>
      this.reload(),
    )

    makeObservable<AdminUsersViewModel, '_searchQuery' | 'reload'>(this, {
      _searchQuery: observable,
      searchQuery: computed,
      canCreateUser: computed,
      setSearchQuery: action,
      reload: action,
      init: override,
      dispose: override,
    })
  }

  protected getItemKey(item: AdminUserItemFragment): string {
    return item.id
  }

  protected createItemViewModel(item: AdminUserItemFragment): AdminUserItemViewModel {
    return new AdminUserItemViewModel(item)
  }

  public get canCreateUser(): boolean {
    return this.createUserModal.canCreateUser
  }

  public get searchQuery(): string {
    return this._searchQuery
  }

  public override init(): void {
    void this.dataSource.load()
  }

  public override dispose(): void {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer)
    }
    super.dispose()
    this.createUserModal.dispose()
  }

  private reload(): void {
    void (this.dataSource as AdminUsersDataSource).load({ search: this._searchQuery || undefined })
  }

  public setSearchQuery(query: string): void {
    this._searchQuery = query

    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer)
    }

    this._debounceTimer = setTimeout(() => {
      void (this.dataSource as AdminUsersDataSource).load({ search: query || undefined })
    }, 300)
  }
}

container.register(
  AdminUsersViewModel,
  () => {
    const dataSource = container.get(AdminUsersDataSource)
    const createUserDataSource = container.get(AdminCreateUserDataSource)
    const systemPermissions = container.get(SystemPermissions)
    return new AdminUsersViewModel(dataSource, createUserDataSource, systemPermissions)
  },
  { scope: 'request' },
)
