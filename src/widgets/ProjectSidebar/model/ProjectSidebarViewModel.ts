import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'

export class ProjectSidebarViewModel {
  public isBranchSectionExpanded = true
  public isProjectSectionExpanded = false
  public isOnSettingsPage = false

  constructor(private readonly context: ProjectContext) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get projectName() {
    return this.context.project.name
  }

  public get isProjectPublic() {
    return this.context.project.isPublic
  }

  public setIsOnSettingsPage(value: boolean) {
    this.isOnSettingsPage = value
    if (value) {
      this.isProjectSectionExpanded = true
    }
  }

  public init() {}

  public dispose() {}

  public handleBranchSectionClick() {
    this.isBranchSectionExpanded = !this.isBranchSectionExpanded
  }

  public handleProjectSectionClick() {
    this.isProjectSectionExpanded = !this.isProjectSectionExpanded
  }
}

container.register(
  ProjectSidebarViewModel,
  () => {
    const context: ProjectContext = container.get(ProjectContext)
    return new ProjectSidebarViewModel(context)
  },
  { scope: 'singleton' },
)
