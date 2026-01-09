import { makeAutoObservable } from 'mobx'
import { ConfigurationQuery } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { ApiService } from 'src/shared/model/ApiService.ts'

export class ConfigurationService {
  public isLoaded: boolean = false
  public error: Error | null = null

  private data: ConfigurationQuery['configuration'] | null = null

  constructor(private readonly apiService: ApiService) {
    makeAutoObservable(this)
  }

  public async initialize(): Promise<void> {
    await this.init()
  }

  public get availableSignUp() {
    return this.availableEmailSignUp || this.availableGoogleOauth || this.availableGithubOauth
  }

  public get availableEmailSignUp() {
    return this.data?.availableEmailSignUp
  }

  public get availableGoogleOauth(): boolean {
    return Boolean(this.data?.google.available)
  }

  public get googleOauthClientId(): string {
    if (!this.data?.google.clientId) {
      throw new Error('Invalid Google client id')
    }

    return this.data?.google.clientId
  }

  public get availableGithubOauth(): boolean {
    return Boolean(this.data?.github.available)
  }

  public get githubOauthClientId(): string {
    if (!this.data?.github.clientId) {
      throw new Error('Invalid Github client id')
    }

    return this.data?.github.clientId
  }

  private async init() {
    await this.request()
  }

  private async request() {
    try {
      const result = await this.apiService.client.configuration()

      this.setData(result.configuration)
    } catch (e) {
      this.setError(e as Error)
      console.error(e)
    } finally {
      this.setIsLoaded(true)
    }
  }

  private setData(value: ConfigurationQuery['configuration']) {
    this.data = value
  }

  private setError(value: Error) {
    this.error = value
  }

  private setIsLoaded(value: boolean) {
    this.isLoaded = value
  }
}

container.register(
  ConfigurationService,
  () => {
    const apiService = container.get(ApiService)
    const configurationService = new ConfigurationService(apiService)
    void configurationService.initialize()
    return configurationService
  },
  { scope: 'singleton' },
)
