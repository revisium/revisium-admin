import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'

export class ProjectSidebarViewModel {
  public isBranchSectionExpanded = true
  public isProjectSectionExpanded = false
  public isOnSettingsPage = false

  private readonly getRevisionChangesRequest = ObservableRequest.of(client.GetRevisionChanges, {
    skipResetting: true,
  })

  constructor(
    private readonly context: ProjectContext,
    private readonly permissionContext: PermissionContext,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get canAccessSettings(): boolean {
    return this.permissionContext.canAccessSettings
  }

  public get canManageUsers(): boolean {
    return this.permissionContext.canManageUsers
  }

  public get projectName() {
    return this.context.projectName
  }

  public get organizationId() {
    return this.context.organizationId
  }

  public init() {
    void this.loadChangesCount()
  }

  public dispose() {}

  private async loadChangesCount(): Promise<void> {
    if (!this.context.isDraftRevision) {
      return
    }
    try {
      await this.getRevisionChangesRequest.fetch({
        revisionId: this.context.revisionId,
        includeSystem: true,
      })
    } catch (e) {
      console.error('Failed to load changes count', e)
    }
  }

  public handleBranchSectionClick() {
    this.isBranchSectionExpanded = !this.isBranchSectionExpanded
  }

  public handleProjectSectionClick() {
    this.isProjectSectionExpanded = !this.isProjectSectionExpanded
  }

  public expandProjectSection() {
    this.isProjectSectionExpanded = true
  }
}

container.register(
  ProjectSidebarViewModel,
  () => {
    const context: ProjectContext = container.get(ProjectContext)
    const permissionContext = container.get(PermissionContext)
    return new ProjectSidebarViewModel(context, permissionContext)
  },
  { scope: 'singleton' },
)
