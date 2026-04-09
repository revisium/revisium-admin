import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'
import { ProjectPermissions } from 'src/shared/model/AbilityService'

export class ProjectSidebarViewModel {
  public isBranchSectionExpanded = true
  public isBranchesSectionExpanded = false
  public isProjectSectionExpanded = false

  constructor(
    private readonly context: ProjectContext,
    private readonly projectPermissions: ProjectPermissions,
    private readonly authService: AuthService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isAuthenticated(): boolean {
    return !!this.authService.user
  }

  public get canAccessSettings(): boolean {
    return this.projectPermissions.canAccessSettings
  }

  public get canManageApiKeys(): boolean {
    return this.projectPermissions.canManageApiKeys
  }

  public get canManageUsers(): boolean {
    return this.projectPermissions.canManageUsers
  }

  public get projectName() {
    return this.context.projectName
  }

  public get organizationId() {
    return this.context.organizationId
  }

  public get isProjectPublic(): boolean {
    return this.context.isProjectPublic
  }

  public get roleName(): string | null {
    return this.context.projectRoleName
  }

  public init() {}

  public dispose() {}

  public handleBranchSectionClick() {
    this.isBranchSectionExpanded = !this.isBranchSectionExpanded
  }

  public handleBranchesSectionClick() {
    this.isBranchesSectionExpanded = !this.isBranchesSectionExpanded
  }

  public expandBranchesSection() {
    this.isBranchesSectionExpanded = true
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
    const projectPermissions = container.get(ProjectPermissions)
    const authService = container.get(AuthService)
    return new ProjectSidebarViewModel(context, projectPermissions, authService)
  },
  { scope: 'singleton' },
)
