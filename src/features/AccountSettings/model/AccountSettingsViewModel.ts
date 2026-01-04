import { makeAutoObservable } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { LOGOUT_ROUTE } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib/DIContainer.ts'
import { AuthService } from 'src/shared/model'
import { AccountSettingsDataSource } from './AccountSettingsDataSource.ts'

type ActiveTab = 'account' | 'password'

export class AccountSettingsViewModel implements IViewModel {
  private _isOpen = false
  private _activeTab: ActiveTab = 'account'

  public oldPassword = ''
  public newPassword = ''
  public confirmPassword = ''


  constructor(
    private readonly dataSource: AccountSettingsDataSource,
    private readonly authService: AuthService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get activeTab(): ActiveTab {
    return this._activeTab
  }

  public get isLoading(): boolean {
    return this.dataSource.isLoading
  }

  public get error(): string | null {
    return this.dataSource.error
  }

  public get username(): string | null | undefined {
    return this.authService.user?.username
  }

  public get email(): string | null | undefined {
    return this.authService.user?.email
  }

  public get hasPassword(): boolean {
    return this.authService.user?.hasPassword ?? true
  }

  public get canSavePassword(): boolean {
    if (this.isLoading) {
      return false
    }

    if (this.newPassword.length < 8) {
      return false
    }

    if (this.newPassword !== this.confirmPassword) {
      return false
    }

    if (this.hasPassword && !this.oldPassword) {
      return false
    }

    return true
  }

  public get passwordError(): string | null {
    if (this.newPassword && this.newPassword.length < 8) {
      return 'Password must be at least 8 characters'
    }

    if (this.confirmPassword && this.newPassword !== this.confirmPassword) {
      return 'Passwords do not match'
    }

    return null
  }

  public open(): void {
    this._isOpen = true
    this._activeTab = 'account'
    this.resetPasswordForm()
  }

  public close(): void {
    this._isOpen = false
    this.resetPasswordForm()
  }

  public setActiveTab(tab: ActiveTab): void {
    this._activeTab = tab
  }

  public setOldPassword(value: string): void {
    this.oldPassword = value
  }

  public setNewPassword(value: string): void {
    this.newPassword = value
  }

  public setConfirmPassword(value: string): void {
    this.confirmPassword = value
  }

  public async savePassword(): Promise<boolean> {
    if (!this.canSavePassword) {
      return false
    }

    const success = await this.dataSource.updatePassword({
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    })

    if (success) {
      this.resetPasswordForm()
      await this.authService.fetchMe()
    }

    return success
  }

  public logout(): void {
    this.close()
    window.location.href = `/${LOGOUT_ROUTE}`
  }

  private resetPasswordForm(): void {
    this.oldPassword = ''
    this.newPassword = ''
    this.confirmPassword = ''
  }

  public init(): void {}

  public dispose(): void {
    this.dataSource.dispose()
  }
}

container.register(
  AccountSettingsViewModel,
  () => {
    const dataSource = container.get(AccountSettingsDataSource)
    const authService = container.get(AuthService)
    return new AccountSettingsViewModel(dataSource, authService)
  },
  { scope: 'singleton' },
)
