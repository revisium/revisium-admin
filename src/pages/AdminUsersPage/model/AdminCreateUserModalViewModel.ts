import { makeAutoObservable, runInAction } from 'mobx'
import { UserSystemRole } from 'src/__generated__/graphql-request'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { AdminCreateUserDataSource } from './AdminCreateUserDataSource'

export class AdminCreateUserModalViewModel {
  private _isOpen = false
  private _username = ''
  private _password = ''
  private _email = ''
  private _selectedRole: UserSystemRole = UserSystemRole.SystemUser

  constructor(
    private readonly dataSource: AdminCreateUserDataSource,
    private readonly permissionContext: PermissionContext,
    private readonly onUserCreated: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get canCreateUser(): boolean {
    return this.permissionContext.canCreateUser
  }

  public get username(): string {
    return this._username
  }

  public get password(): string {
    return this._password
  }

  public get email(): string {
    return this._email
  }

  public get selectedRole(): UserSystemRole {
    return this._selectedRole
  }

  public get isCreating(): boolean {
    return this.dataSource.isLoading
  }

  public get canSubmit(): boolean {
    return this._username.trim().length > 0 && this._password.length >= 6 && !this.isCreating
  }

  public open(): void {
    this._isOpen = true
    this.reset()
  }

  public close(): void {
    this._isOpen = false
    this.reset()
  }

  public setUsername(value: string): void {
    this._username = value
  }

  public setPassword(value: string): void {
    this._password = value
  }

  public setEmail(value: string): void {
    this._email = value
  }

  public setSelectedRole(role: UserSystemRole): void {
    this._selectedRole = role
  }

  public async createUser(): Promise<void> {
    if (!this.canSubmit) {
      return
    }

    const success = await this.dataSource.create({
      username: this._username.trim(),
      password: this._password,
      email: this._email.trim() || undefined,
      roleId: this._selectedRole,
    })

    runInAction(() => {
      if (success) {
        this.onUserCreated()
        this.close()
      }
    })
  }

  public dispose(): void {
    this.dataSource.dispose()
  }

  private reset(): void {
    this._username = ''
    this._password = ''
    this._email = ''
    this._selectedRole = UserSystemRole.SystemUser
  }
}

container.register(
  AdminCreateUserModalViewModel,
  () => {
    const dataSource = container.get(AdminCreateUserDataSource)
    const permissionContext = container.get(PermissionContext)
    return new AdminCreateUserModalViewModel(dataSource, permissionContext, () => {})
  },
  { scope: 'request' },
)
