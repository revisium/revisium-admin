import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { OrganizationContext } from 'src/entities/Organization/model/OrganizationContext.ts'
import {
  APP_ROUTE,
  ORGANIZATION_BILLING_ROUTE,
  ORGANIZATION_MEMBERS_ROUTE,
  ORGANIZATION_ROUTE,
  ORGANIZATION_SETTINGS_ROUTE,
} from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { PermissionService } from 'src/shared/model/AbilityService'
import { ConfigurationService } from 'src/shared/model/ConfigurationService.ts'

export class OrganizationSidebarViewModel {
  constructor(
    private readonly context: OrganizationContext,
    private readonly permissionService: PermissionService,
    private readonly configurationService: ConfigurationService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get organizationId(): string {
    return this.context.organizationId
  }

  public get isAuthenticated(): boolean {
    return this.context.isAuthenticated
  }

  private get organizationCondition(): Record<string, unknown> {
    return { organizationId: this.organizationId }
  }

  public get canManageMembers(): boolean {
    return this.permissionService.can('add', 'User', this.organizationCondition)
  }

  public get canAccessSettings(): boolean {
    return this.permissionService.can('update', 'Organization', this.organizationCondition)
  }

  public get canAccessBilling(): boolean {
    return this.configurationService.billingEnabled && this.canAccessSettings
  }

  public get projectsLink(): string {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}`, {
      organizationId: this.organizationId,
    })
  }

  public get membersLink(): string {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${ORGANIZATION_MEMBERS_ROUTE}`, {
      organizationId: this.organizationId,
    })
  }

  public get settingsLink(): string {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${ORGANIZATION_SETTINGS_ROUTE}`, {
      organizationId: this.organizationId,
    })
  }

  public get billingLink(): string {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${ORGANIZATION_BILLING_ROUTE}`, {
      organizationId: this.organizationId,
    })
  }

  public init() {}

  public dispose() {}
}

container.register(
  OrganizationSidebarViewModel,
  () => {
    const context = container.get(OrganizationContext)
    const permissionService = container.get(PermissionService)
    const configurationService = container.get(ConfigurationService)
    return new OrganizationSidebarViewModel(context, permissionService, configurationService)
  },
  { scope: 'singleton' },
)
