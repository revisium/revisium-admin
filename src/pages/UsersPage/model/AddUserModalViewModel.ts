import { makeAutoObservable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { UserProjectRoles, UserSystemRole } from 'src/__generated__/graphql-request'

interface SearchedUser {
  id: string
  username: string | null
  email: string | null
}

type Tab = 'search' | 'create'

export class AddUserModalViewModel {
  private _isOpen = false
  private _activeTab: Tab = 'search'

  private _searchQuery = ''
  private _searchResults: SearchedUser[] = []
  private _selectedUserId: string | null = null
  private _selectedRole: UserProjectRoles = UserProjectRoles.Reader

  private _newUsername = ''
  private _newPassword = ''
  private _newEmail = ''

  private _isAdding = false
  private _isCreating = false

  private readonly searchRequest = ObservableRequest.of(client.SearchUsers)

  constructor(
    private readonly context: ProjectContext,
    private readonly permissionContext: PermissionContext,
    private readonly onUserAdded: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get activeTab(): Tab {
    return this._activeTab
  }

  public get canCreateUser(): boolean {
    return this.permissionContext.canCreateUser
  }

  public get searchQuery(): string {
    return this._searchQuery
  }

  public get searchResults(): SearchedUser[] {
    return this._searchResults
  }

  public get selectedUserId(): string | null {
    return this._selectedUserId
  }

  public get selectedRole(): UserProjectRoles {
    return this._selectedRole
  }

  public get isSearching(): boolean {
    return this.searchRequest.isLoading
  }

  public get canAddSelectedUser(): boolean {
    return this._selectedUserId !== null && !this._isAdding
  }

  public get isAdding(): boolean {
    return this._isAdding
  }

  public get newUsername(): string {
    return this._newUsername
  }

  public get newPassword(): string {
    return this._newPassword
  }

  public get newEmail(): string {
    return this._newEmail
  }

  public get isCreating(): boolean {
    return this._isCreating
  }

  public get canCreateNewUser(): boolean {
    return this._newUsername.trim().length > 0 && this._newPassword.length >= 6 && !this._isCreating
  }

  public open(): void {
    this._isOpen = true
    this.reset()
  }

  public close(): void {
    this._isOpen = false
    this.reset()
  }

  public setActiveTab(tab: Tab): void {
    this._activeTab = tab
  }

  public setSearchQuery(query: string): void {
    this._searchQuery = query
    void this.search()
  }

  public setSelectedUserId(userId: string | null): void {
    this._selectedUserId = userId
  }

  public setSelectedRole(role: UserProjectRoles): void {
    this._selectedRole = role
  }

  public setNewUsername(value: string): void {
    this._newUsername = value
  }

  public setNewPassword(value: string): void {
    this._newPassword = value
  }

  public setNewEmail(value: string): void {
    this._newEmail = value
  }

  public async search(): Promise<void> {
    if (this._searchQuery.trim().length === 0) {
      this._searchResults = []
      return
    }

    const result = await this.searchRequest.fetch({
      search: this._searchQuery,
      first: 20,
    })

    runInAction(() => {
      if (result.isRight) {
        this._searchResults = result.data.searchUsers.edges.map((edge) => ({
          id: edge.node.id,
          username: edge.node.username ?? null,
          email: edge.node.email ?? null,
        }))
      }
    })
  }

  public async addSelectedUser(): Promise<void> {
    if (!this._selectedUserId || this._isAdding) {
      return
    }

    this._isAdding = true

    try {
      const result = await client.AddUserToProject({
        organizationId: this.context.project.organization.id,
        projectName: this.context.project.name,
        userId: this._selectedUserId,
        roleId: this._selectedRole,
      })

      runInAction(() => {
        if (result.addUserToProject) {
          this.onUserAdded()
          this.close()
        }
      })
    } catch (error) {
      console.error('Failed to add user:', error)
    } finally {
      runInAction(() => {
        this._isAdding = false
      })
    }
  }

  public async createAndAddUser(): Promise<void> {
    if (!this.canCreateNewUser) {
      return
    }

    this._isCreating = true

    try {
      const createResult = await client.CreateUser({
        username: this._newUsername.trim(),
        password: this._newPassword,
        email: this._newEmail.trim() || undefined,
        roleId: UserSystemRole.SystemUser,
      })

      if (!createResult.createUser) {
        throw new Error('Failed to create user')
      }

      const searchResult = await client.SearchUsers({
        search: this._newUsername.trim(),
        first: 1,
      })

      const newUser = searchResult.searchUsers.edges.find((edge) => edge.node.username === this._newUsername.trim())

      if (!newUser) {
        throw new Error('Could not find newly created user')
      }

      const addResult = await client.AddUserToProject({
        organizationId: this.context.project.organization.id,
        projectName: this.context.project.name,
        userId: newUser.node.id,
        roleId: this._selectedRole,
      })

      runInAction(() => {
        if (addResult.addUserToProject) {
          this.onUserAdded()
          this.close()
        }
      })
    } catch (error) {
      console.error('Failed to create and add user:', error)
    } finally {
      runInAction(() => {
        this._isCreating = false
      })
    }
  }

  private reset(): void {
    this._activeTab = 'search'
    this._searchQuery = ''
    this._searchResults = []
    this._selectedUserId = null
    this._selectedRole = UserProjectRoles.Reader
    this._newUsername = ''
    this._newPassword = ''
    this._newEmail = ''
    this._isAdding = false
    this._isCreating = false
  }
}
