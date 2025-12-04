import { makeAutoObservable } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { ApiService, AuthService } from 'src/shared/model'

export class LoginGithubViewModel implements IViewModel {
  public isLoading: boolean = false

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {
    makeAutoObservable(this)
  }

  public async login(code: string | null) {
    if (code) {
      await this.loginRequest(code)
    } else {
      console.error('Invalid code')
    }
  }

  public dispose(): void {}

  public init(): void {}

  private async loginRequest(code: string) {
    this.setIsLoading(true)

    try {
      const result = await this.apiService.client.loginGithub({
        data: {
          code,
        },
      })

      await this.authService.setToken(result.loginGithub.accessToken)

      return true
    } catch (e) {
      console.error(e)
    } finally {
      this.setIsLoading(false)
    }
  }

  private setIsLoading(value: boolean) {
    this.isLoading = value
  }
}

container.register(
  LoginGithubViewModel,
  () => {
    const apiService = container.get(ApiService)
    const authService = container.get(AuthService)

    return new LoginGithubViewModel(apiService, authService)
  },
  { scope: 'request' },
)
