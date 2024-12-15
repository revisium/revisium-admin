import { Router } from '@remix-run/router'
import { reaction } from 'mobx'
import { createBrowserRouter } from 'react-router-dom'
import { ROOT_ROUTES } from 'src/app/config/rootRoutes.tsx'
import { container } from 'src/shared/lib'
import { BootstrapService } from 'src/shared/model/BootstrapService.ts'

export class RouterService {
  constructor(private bootstrapService: BootstrapService) {
    this.init()
  }

  private _router: Router | null = null

  public get router() {
    if (!this._router) {
      throw new Error('Router not found')
    }

    return this._router
  }

  public navigate(...args: Parameters<Router['navigate']>) {
    return this.router.navigate(...args)
  }

  private init() {
    reaction(
      () => this.bootstrapService.isLoaded,
      (isLoaded) => {
        if (isLoaded) {
          this._router = createBrowserRouter(ROOT_ROUTES)
        }
      },
    )
  }
}

container.register(
  RouterService,
  () => {
    const bootstrapService = container.get(BootstrapService)
    return new RouterService(bootstrapService)
  },
  { scope: 'singleton' },
)
