import { makeAutoObservable } from 'mobx'
import { SIGN_UP_COMPLETED_ROUTE, SIGN_UP_ROUTE } from 'src/shared/config/routes.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, FormState } from 'src/shared/lib'
import { githubOauth } from 'src/shared/lib/githubOauth.ts'
import { googleOauth } from 'src/shared/lib/googleOauth.ts'
import { ApiService } from 'src/shared/model'
import { ConfigurationService } from 'src/shared/model/ConfigurationService.ts'
import { RouterService } from 'src/shared/model/RouterService.ts'

export class SignUpViewModel implements IViewModel {
  public isLoading: boolean = false

  public readonly form = new FormState({
    email: '',
    username: '',
    password: '',
  })

  constructor(
    private readonly routerService: RouterService,
    private readonly apiService: ApiService,
    private readonly configurationService: ConfigurationService,
  ) {
    makeAutoObservable(this)
  }

  public get disableSubmitButton() {
    return !this.form.isValid
  }

  public get availableEmailSignUp() {
    return this.configurationService.availableEmailSignUp
  }

  public get availableOauth() {
    return this.configurationService.availableGoogleOauth
  }

  public get availableGoogleOauth() {
    return this.configurationService.availableGoogleOauth
  }

  public get availableGithubOauth() {
    return this.configurationService.availableGithubOauth
  }

  public toGoogleOauth() {
    googleOauth(this.configurationService.googleOauthClientId)
  }

  public toGithubOauth() {
    githubOauth(this.configurationService.githubOauthClientId)
  }

  public async submit() {
    await this.signUp()
    await this.routerService.navigate(`/${SIGN_UP_ROUTE}/${SIGN_UP_COMPLETED_ROUTE}`)
  }

  public dispose(): void {}

  public init(): void {}

  private async signUp() {
    this.setIsLoading(true)

    try {
      await this.apiService.client.signUp({ data: this.form.values })
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
  SignUpViewModel,
  () => {
    const routerService = container.get(RouterService)
    const apiService = container.get(ApiService)
    const configurationService = container.get(ConfigurationService)

    return new SignUpViewModel(routerService, apiService, configurationService)
  },
  { scope: 'request' },
)
