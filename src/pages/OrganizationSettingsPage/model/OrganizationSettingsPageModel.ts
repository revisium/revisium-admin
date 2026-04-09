import { makeAutoObservable } from 'mobx'
import { OrganizationContext } from 'src/entities/Organization/model/OrganizationContext.ts'
import { ApiKeyManagerViewModel } from 'src/features/ApiKeyManager'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { PermissionService } from 'src/shared/model/AbilityService'

export class OrganizationSettingsPageModel implements IViewModel {
  public readonly apiKeyManager: ApiKeyManagerViewModel

  constructor(
    private readonly context: OrganizationContext,
    private readonly permissionService: PermissionService,
    apiKeyManager: ApiKeyManagerViewModel,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.apiKeyManager = apiKeyManager
    this.apiKeyManager.configure({
      mode: 'service',
      organizationId: this.context.organizationId,
    })
  }

  public get organizationId(): string {
    return this.context.organizationId
  }

  public get canManageServiceKeys(): boolean {
    return this.permissionService.can('manage', 'ApiKey', { organizationId: this.organizationId })
  }

  public init(): void {}

  public dispose(): void {
    this.apiKeyManager.dispose()
  }
}

container.register(
  OrganizationSettingsPageModel,
  () => {
    const context = container.get(OrganizationContext)
    const permissionService = container.get(PermissionService)
    const apiKeyManager = container.get(ApiKeyManagerViewModel)
    return new OrganizationSettingsPageModel(context, permissionService, apiKeyManager)
  },
  { scope: 'request' },
)
