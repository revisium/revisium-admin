import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'
import { RouterParams } from 'src/shared/model/RouterParams.ts'

export class OrganizationContext {
  constructor(
    private readonly routerParams: RouterParams,
    private readonly authService: AuthService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get organizationId(): string {
    return this.routerParams.organizationId ?? this.authService.user?.organizationId ?? ''
  }

  public get isAuthenticated(): boolean {
    return !!this.authService.user
  }
}

container.register(
  OrganizationContext,
  () => {
    const routerParams = container.get(RouterParams)
    const authService = container.get(AuthService)
    return new OrganizationContext(routerParams, authService)
  },
  { scope: 'singleton' },
)
