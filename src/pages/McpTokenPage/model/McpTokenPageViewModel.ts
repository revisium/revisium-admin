import { makeAutoObservable } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, copyToClipboard } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'

export class McpTokenPageViewModel implements IViewModel {
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

  public async copyAccessToken(): Promise<boolean> {
    if (!this.authService.token) return false
    try {
      await copyToClipboard(this.authService.token)
      return true
    } catch {
      return false
    }
  }

  public init(): void {}

  public dispose(): void {}
}

container.register(
  McpTokenPageViewModel,
  () => {
    const authService = container.get(AuthService)
    return new McpTokenPageViewModel(authService)
  },
  { scope: 'request' },
)
