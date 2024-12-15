import { makeAutoObservable } from 'mobx'
import { loginRequest } from 'src/pages/LoginPage/api/login/loginRequest.ts'
import { ROOT_ROUTE } from 'src/shared/config/routes.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, FormState } from 'src/shared/lib'
import { githubOauth } from 'src/shared/lib/githubOauth.ts'
import { googleOauth } from 'src/shared/lib/googleOauth.ts'
import { AuthService } from 'src/shared/model'
import { ConfigurationService } from 'src/shared/model/ConfigurationService.ts'
import { RouterService } from 'src/shared/model/RouterService.ts'

export class LoginViewModel implements IViewModel {
  public isLoading: boolean = false

  public readonly form = new FormState({
    emailOrUsername: '',
    password: '',
  })

  constructor(
    private readonly authService: AuthService,
    private readonly configurationService: ConfigurationService,
    private readonly routerService: RouterService,
  ) {
    makeAutoObservable(this)
  }

  public get availableSignUp() {
    return this.configurationService.availableSignUp
  }

  public get disableSubmitButton() {
    return !this.form.isValid
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
    const result = await this.login()

    if (result) {
      await this.routerService.navigate(ROOT_ROUTE)
    }
  }

  public dispose(): void {}

  public init(): void {}

  private async login() {
    this.setIsLoading(true)

    try {
      const result = await loginRequest({ data: this.form.values })
      await this.authService.setToken(result.login.accessToken)
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
  LoginViewModel,
  () => {
    const authService = container.get(AuthService)
    const configurationService = container.get(ConfigurationService)
    const routerService = container.get(RouterService)

    return new LoginViewModel(authService, configurationService, routerService)
  },
  { scope: 'request' },
)
