import { makeAutoObservable } from 'mobx'
import { ROOT_ROUTE } from 'src/shared/config/routes.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, FormState } from 'src/shared/lib'
import { ApiService, AuthService } from 'src/shared/model'
import { RouterService } from 'src/shared/model/RouterService.ts'

export class UsernamePageModel implements IViewModel {
  public isLoading: boolean = false

  public readonly form = new FormState({
    username: '',
  })

  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    private readonly routerService: RouterService,
  ) {
    makeAutoObservable(this)
  }

  public get disableSubmitButton() {
    return !this.form.isValid
  }

  public async submit() {
    const result = await this.request()

    if (result) {
      await this.authService.fetchMe()
      await this.routerService.navigate(ROOT_ROUTE)
    }
  }

  public dispose(): void {}

  public init(): void {}

  private async request() {
    this.setIsLoading(true)

    try {
      await this.apiService.client.setUsername({
        data: {
          username: this.form.values.username,
        },
      })
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
  UsernamePageModel,
  () => {
    const authService = container.get(AuthService)
    const apiService = container.get(ApiService)
    const routerService = container.get(RouterService)

    return new UsernamePageModel(authService, apiService, routerService)
  },
  { scope: 'request' },
)
