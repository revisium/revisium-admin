import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { ProjectPermissions } from 'src/shared/model/AbilityService'

export class ProjectSidebarViewModel {
  public isBranchSectionExpanded = true
  public isBranchesSectionExpanded = false
  public isProjectSectionExpanded = false

  constructor(
    private readonly context: ProjectContext,
    private readonly projectPermissions: ProjectPermissions,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get canAccessSettings(): boolean {
    return this.projectPermissions.canAccessSettings
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
    return new ProjectSidebarViewModel(context, projectPermissions)
  },
  { scope: 'singleton' },
)
