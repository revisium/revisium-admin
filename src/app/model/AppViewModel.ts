import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { BootstrapService } from 'src/shared/model/BootstrapService.ts'
import { RouterService } from 'src/shared/model/RouterService.ts'

export class AppViewModel {
  constructor(
    private readonly bootstrapService: BootstrapService,
    private readonly routerService: RouterService,
  ) {
    makeAutoObservable(this)
  }

  public get isLoaded() {
    return this.bootstrapService.isLoaded
  }

  public get router() {
    return this.routerService.router
  }

  public async init() {}

  public dispose() {}
}

container.register(
  AppViewModel,
  () => {
    const bootstrapService = container.get(BootstrapService)
    const routerService = container.get(RouterService)
    return new AppViewModel(bootstrapService, routerService)
  },
  { scope: 'request' },
)
