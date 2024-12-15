import { makeAutoObservable } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { googleRedirectUrl } from 'src/shared/lib/googleOauth.ts'
import { ApiService, AuthService } from 'src/shared/model'
import { RouterService } from 'src/shared/model/RouterService.ts'

export class LoginGoogleViewModel implements IViewModel {
  public isLoading: boolean = false

  constructor(
    private readonly routerService: RouterService,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {
    makeAutoObservable(this)
  }

  public async login(code: string | null) {
    if (code) {
      await this.loginRequest(code)
      await this.routerService.navigate(`/`)
    } else {
      console.error('Invalid code')
    }
  }

  public dispose(): void {}

  public init(): void {}

  private async loginRequest(code: string) {
    this.setIsLoading(true)

    try {
      const result = await this.apiService.client.loginGoogle({
        data: {
          code,
          redirectUrl: googleRedirectUrl(),
        },
      })

      await this.authService.setToken(result.loginGoogle.accessToken)

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
  LoginGoogleViewModel,
  () => {
    const routerService = container.get(RouterService)
    const apiService = container.get(ApiService)
    const authService = container.get(AuthService)

    return new LoginGoogleViewModel(routerService, apiService, authService)
  },
  { scope: 'request' },
)
