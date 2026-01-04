import { makeAutoObservable } from 'mobx'
import { UpdatePasswordInput } from 'src/__generated__/globalTypes.ts'
import { container } from 'src/shared/lib/DIContainer.ts'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

export class AccountSettingsDataSource {
  private readonly updatePasswordRequest = ObservableRequest.of(client.updatePassword)

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.updatePasswordRequest.isLoading
  }

  public get error(): string | null {
    return this.updatePasswordRequest.errorMessage ?? null
  }

  public async updatePassword(input: UpdatePasswordInput): Promise<boolean> {
    const result = await this.updatePasswordRequest.fetch({
      data: {
        oldPassword: input.oldPassword,
        newPassword: input.newPassword,
      },
    })

    return result.isRight
  }

  public dispose(): void {
    this.updatePasswordRequest.abort()
  }
}

container.register(AccountSettingsDataSource, () => new AccountSettingsDataSource(), { scope: 'request' })
