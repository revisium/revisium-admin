import { makeAutoObservable, runInAction } from 'mobx'
import { AdminUserDetailFragment } from 'src/__generated__/graphql-request'
import { IViewModel } from 'src/shared/config/types'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest'
import { client } from 'src/shared/model/ApiService'

export class AdminUserDetailViewModel implements IViewModel {
  private readonly request = ObservableRequest.of(client.adminGetUser)
  private readonly resetPasswordRequest = ObservableRequest.of(client.adminResetPassword)
  private _userId: string | null = null
  private _user: AdminUserDetailFragment | null = null
  private _newPassword: string = ''
  private _resetPasswordSuccess: boolean = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoading(): boolean {
    return this.request.isLoading
  }

  public get error(): string | null {
    return this.request.errorMessage ?? null
  }

  public get user(): AdminUserDetailFragment | null {
    return this._user
  }

  public get username(): string | null {
    return this._user?.username ?? null
  }

  public get email(): string | null {
    return this._user?.email ?? null
  }

  public get roleName(): string | null {
    return this._user?.role?.name ?? null
  }

  public get newPassword(): string {
    return this._newPassword
  }

  public get isResetPasswordLoading(): boolean {
    return this.resetPasswordRequest.isLoading
  }

  public get resetPasswordError(): string | null {
    return this.resetPasswordRequest.errorMessage ?? null
  }

  public get resetPasswordSuccess(): boolean {
    return this._resetPasswordSuccess
  }

  public get canResetPassword(): boolean {
    return this._newPassword.length >= 6
  }

  public setUserId(userId: string): void {
    this._userId = userId
  }

  public setNewPassword(password: string): void {
    this._newPassword = password
    this._resetPasswordSuccess = false
  }

  public async resetPassword(): Promise<void> {
    if (!this._userId || !this.canResetPassword) {
      return
    }

    const result = await this.resetPasswordRequest.fetch({
      userId: this._userId,
      newPassword: this._newPassword,
    })

    if (result.isRight) {
      runInAction(() => {
        this._newPassword = ''
        this._resetPasswordSuccess = true
      })
    }
  }

  public init(): void {
    if (this._userId) {
      void this.loadUser()
    }
  }

  public dispose(): void {
    this.request.abort()
    this.resetPasswordRequest.abort()
  }

  private async loadUser(): Promise<void> {
    if (!this._userId) {
      return
    }

    const result = await this.request.fetch({
      userId: this._userId,
    })

    if (result.isRight) {
      runInAction(() => {
        this._user = result.data.adminUser ?? null
      })
    }
  }
}

container.register(AdminUserDetailViewModel, () => new AdminUserDetailViewModel(), { scope: 'request' })
