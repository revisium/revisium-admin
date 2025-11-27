import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

export class ProjectSidebarViewModel {
  public isBranchSectionExpanded = true
  public isProjectSectionExpanded = false
  public isOnSettingsPage = false

  private readonly getRevisionChangesRequest = ObservableRequest.of(client.GetRevisionChanges, {
    skipResetting: true,
  })

  constructor(private readonly context: ProjectContext) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get projectName() {
    return this.context.project.name
  }

  public get isProjectPublic() {
    return this.context.project.isPublic
  }

  public get organizationId() {
    return this.context.organization.id
  }

  public get changesCount(): number | null {
    if (!this.context.isDraftRevision) {
      return null
    }
    return this.getRevisionChangesRequest.data?.revisionChanges.totalChanges ?? null
  }

  public setIsOnSettingsPage(value: boolean) {
    this.isOnSettingsPage = value
    if (value) {
      this.isProjectSectionExpanded = true
    }
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
        revisionId: this.context.revision.id,
        includeSystem: false,
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
}

container.register(
  ProjectSidebarViewModel,
  () => {
    const context: ProjectContext = container.get(ProjectContext)
    return new ProjectSidebarViewModel(context)
  },
  { scope: 'singleton' },
)
