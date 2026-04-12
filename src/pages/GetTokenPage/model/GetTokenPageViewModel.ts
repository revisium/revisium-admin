import { makeAutoObservable, runInAction } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, copyToClipboard } from 'src/shared/lib'
import { ApiService } from 'src/shared/model/ApiService.ts'

export class GetTokenPageViewModel implements IViewModel {
  private _accessToken: string | null = null
  private _loading = false

  constructor(private readonly apiService: ApiService) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get hasAccessToken(): boolean {
    return Boolean(this._accessToken)
  }

  public get accessToken(): string {
    return this._accessToken || ''
  }

  public get loading(): boolean {
    return this._loading
  }

  public get truncatedToken(): string {
    const token = this.accessToken
    if (token.length <= 30) return token
    return `${token.slice(0, 20)}...${token.slice(-10)}`
  }

  public async copyAccessToken(): Promise<boolean> {
    if (!this._accessToken) return false
    try {
      await copyToClipboard(this._accessToken)
      return true
    } catch {
      return false
    }
  }

  public init(): void {
    void this.fetchAccessToken()
  }

  public dispose(): void {
    this._accessToken = null
  }

  private async fetchAccessToken(): Promise<void> {
    runInAction(() => {
      this._loading = true
    })
    try {
      const result = await this.apiService.client.issueAccessToken()
      runInAction(() => {
        this._accessToken = result.issueAccessToken.accessToken
      })
    } catch {
      runInAction(() => {
        this._accessToken = null
      })
    } finally {
      runInAction(() => {
        this._loading = false
      })
    }
  }
}

container.register(
  GetTokenPageViewModel,
  () => {
    const apiService = container.get(ApiService)
    return new GetTokenPageViewModel(apiService)
  },
  { scope: 'request' },
)
