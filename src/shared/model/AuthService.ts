import { makeAutoObservable, reaction, runInAction } from 'mobx'
import { UserFragment } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { SystemPermissions } from 'src/shared/model/AbilityService'
import { ApiService } from 'src/shared/model/ApiService.ts'

const TOKEN_KEY = 'token'

export class AuthService {
  public isLoaded = false

  public user: UserFragment | null = null
  public token: string | null = null

  constructor(
    private readonly storage: Storage,
    private readonly apiService: ApiService,
    private readonly systemPermissions: SystemPermissions,
  ) {
    makeAutoObservable(this)
  }

  public async initialize(): Promise<void> {
    await this.init()
  }

  public async setToken(token: string | null) {
    this.token = token
    this.apiService.setToken(this.token)

    if (this.token) {
      await this.fetchMe()
    }
  }

  private async init() {
    await this.setToken(this.loadToken())
    this.signToToken()

    this.setIsChecked(true)
  }

  private loadToken() {
    return this.storage.getItem(TOKEN_KEY)
  }

  public async fetchMe() {
    try {
      const result = await this.apiService.client.getMe()
      this.user = result.me

      this.systemPermissions.setUserRole(result.me.role ?? null)
    } catch (e) {
      console.error(e)

      runInAction(() => {
        this.token = null
      })
    }
  }

  private setIsChecked(value: boolean) {
    this.isLoaded = value
  }

  private signToToken() {
    reaction(
      () => this.token,
      (nextToken) => {
        if (nextToken) {
          this.storage.setItem(TOKEN_KEY, nextToken)
        } else {
          this.storage.removeItem(TOKEN_KEY)
        }
      },
    )
  }

  logout() {
    this.token = null
    this.user = null
    this.apiService.setToken(null)
    this.systemPermissions.clearAll()
  }
}

container.register(
  AuthService,
  () => {
    const apiService = container.get(ApiService)
    const systemPermissions = container.get(SystemPermissions)
    const authService = new AuthService(localStorage, apiService, systemPermissions)
    void authService.initialize()
    return authService
  },
  { scope: 'singleton' },
)
