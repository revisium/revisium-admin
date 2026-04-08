import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { ApiKeyManagerViewModel } from 'src/features/ApiKeyManager'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { PermissionService, ProjectPermissions } from 'src/shared/model/AbilityService'

export class ProjectApiKeysPageModel implements IViewModel {
  public readonly apiKeyManager: ApiKeyManagerViewModel

  constructor(
    private readonly context: ProjectContext,
    private readonly projectPermissions: ProjectPermissions,
    private readonly permissionService: PermissionService,
    apiKeyManager: ApiKeyManagerViewModel,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.apiKeyManager = apiKeyManager
  }

  public get organizationId(): string {
    return this.context.organizationId
  }

  public get projectName(): string {
    return this.context.projectName
  }

  public get canManageServiceKeys(): boolean {
    return this.permissionService.can('update', 'Organization', { organizationId: this.context.organizationId })
  }

  public get organizationSettingsLink(): string {
    return `/app/${this.context.organizationId}/-/settings`
  }

  public init(): void {
    const projectId = this.projectPermissions.projectId ?? undefined
    this.apiKeyManager.configure({
      mode: 'service',
      organizationId: this.context.organizationId,
      defaultProjectId: projectId,
      defaultProjectName: this.context.projectName,
      filterByProjectId: projectId,
    })
  }

  public dispose(): void {
    this.apiKeyManager.dispose()
  }
}

container.register(
  ProjectApiKeysPageModel,
  () => {
    const context = container.get(ProjectContext)
    const projectPermissions = container.get(ProjectPermissions)
    const permissionService = container.get(PermissionService)
    const apiKeyManager = container.get(ApiKeyManagerViewModel)
    return new ProjectApiKeysPageModel(context, projectPermissions, permissionService, apiKeyManager)
  },
  { scope: 'request' },
)
