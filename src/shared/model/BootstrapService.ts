import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model/AuthService.ts'
import { ConfigurationService } from 'src/shared/model/ConfigurationService.ts'

export class BootstrapService {
  constructor(
    private authService: AuthService,
    private configurationService: ConfigurationService,
  ) {
    makeAutoObservable(this)
  }

  public get isLoaded() {
    return this.authService.isLoaded && this.configurationService.isLoaded
  }
}

container.register(
  BootstrapService,
  () => {
    const authService = container.get(AuthService)
    const configurationService = container.get(ConfigurationService)
    return new BootstrapService(authService, configurationService)
  },
  { scope: 'singleton' },
)
