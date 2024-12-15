import { makeAutoObservable } from 'mobx'
import { ROOT_ROUTE } from 'src/shared/config/routes.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { ApiService, AuthService } from 'src/shared/model'
import { RouterService } from 'src/shared/model/RouterService.ts'

export class ConfirmEmailCodeViewModel implements IViewModel {
  public isLoading: boolean = false

  constructor(
    private readonly authService: AuthService,
    private readonly routerService: RouterService,
    private readonly apiService: ApiService,
  ) {
    makeAutoObservable(this)
  }

  public async confirmEmailCode(code: string | null) {
    if (code) {
      await this.request(code)
      await this.routerService.navigate(ROOT_ROUTE)
    } else {
      console.error('Invalid code')
    }
  }

  public init(): void {}

  public dispose(): void {}

  private async request(code: string) {
    this.setIsLoading(true)

    try {
      const result = await this.apiService.client.confirmEmailCode({
        data: {
          code,
        },
      })
      await this.authService.setToken(result.confirmEmailCode.accessToken)
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
  ConfirmEmailCodeViewModel,
  () => {
    const authService = container.get(AuthService)
    const routerService = container.get(RouterService)
    const apiService = container.get(ApiService)

    return new ConfirmEmailCodeViewModel(authService, routerService, apiService)
  },
  { scope: 'request' },
)
