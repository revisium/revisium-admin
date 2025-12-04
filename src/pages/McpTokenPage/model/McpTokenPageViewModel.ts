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

  public copyAccessToken(): void {
    if (this.authService.token) {
      void copyToClipboard(this.authService.token)
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
