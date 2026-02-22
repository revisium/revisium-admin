import { makeAutoObservable, runInAction } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, copyToClipboard } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'

interface OAuthParams {
  clientId: string
  clientName: string
  redirectUri: string
  codeChallenge: string
  state: string
}

const REDIRECT_DELAY_MS = 3000

export class McpTokenPageViewModel implements IViewModel {
  private _oauthParams: OAuthParams | null = null
  private _isAuthorizing = false
  private _authorizeError: string | null = null
  private _isAuthorized = false
  private _redirectUri: string | null = null
  private _redirectTimer: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly authService: AuthService) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get hasAccessToken(): boolean {
    return Boolean(this.authService.token)
  }

  public get accessToken(): string {
    return this.authService.token || ''
  }

  public get truncatedToken(): string {
    const token = this.accessToken
    if (token.length <= 30) return token
    return `${token.slice(0, 20)}...${token.slice(-10)}`
  }

  public get isOAuthFlow(): boolean {
    return this._oauthParams !== null
  }

  public get oauthClientName(): string {
    return this._oauthParams?.clientName ?? ''
  }

  public get isAuthorizing(): boolean {
    return this._isAuthorizing
  }

  public get authorizeError(): string | null {
    return this._authorizeError
  }

  public get isAuthorized(): boolean {
    return this._isAuthorized
  }

  public async copyAccessToken(): Promise<boolean> {
    if (!this.authService.token) return false
    try {
      await copyToClipboard(this.authService.token)
      return true
    } catch {
      return false
    }
  }

  public async approve(): Promise<void> {
    if (!this._oauthParams || !this.authService.token) return

    this._isAuthorizing = true
    this._authorizeError = null

    try {
      const response = await fetch('/oauth/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.token}`,
        },
        body: JSON.stringify({
          client_id: this._oauthParams.clientId,
          redirect_uri: this._oauthParams.redirectUri,
          code_challenge: this._oauthParams.codeChallenge,
          state: this._oauthParams.state,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => null)
        throw new Error(error?.message || 'Authorization failed')
      }

      const data = await response.json()

      runInAction(() => {
        this._isAuthorized = true
        this._redirectUri = data.redirect_uri
        this._isAuthorizing = false
      })

      this._redirectTimer = setTimeout(() => {
        if (this._redirectUri) {
          window.location.href = this._redirectUri
        }
      }, REDIRECT_DELAY_MS)
    } catch (e) {
      runInAction(() => {
        this._authorizeError = e instanceof Error ? e.message : 'Authorization failed'
        this._isAuthorizing = false
      })
    }
  }

  public redirectNow(): void {
    if (this._redirectTimer) {
      clearTimeout(this._redirectTimer)
    }
    if (this._redirectUri) {
      window.location.href = this._redirectUri
    }
  }

  public init(): void {
    const params = new URLSearchParams(window.location.search)
    const clientId = params.get('client_id')
    const clientName = params.get('client_name')
    const redirectUri = params.get('redirect_uri')
    const codeChallenge = params.get('code_challenge')
    const state = params.get('state')

    if (clientId && clientName && redirectUri && codeChallenge && state) {
      this._oauthParams = { clientId, clientName, redirectUri, codeChallenge, state }
    }
  }

  public dispose(): void {
    if (this._redirectTimer) {
      clearTimeout(this._redirectTimer)
    }
  }
}

container.register(
  McpTokenPageViewModel,
  () => {
    const authService = container.get(AuthService)
    return new McpTokenPageViewModel(authService)
  },
  { scope: 'request' },
)
