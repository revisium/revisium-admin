import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container, ObservableRequest } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { RouterService } from 'src/shared/model/RouterService.ts'
import { toaster } from 'src/shared/ui'

export class ProjectSettingsPageModel {
  public isDeleteDialogOpen = false
  public deleteConfirmationText = ''

  private readonly updateRequest = ObservableRequest.of(client.updateProject)
  private readonly deleteRequest = ObservableRequest.of(client.deleteProjectForSettings)

  constructor(
    private readonly context: ProjectContext,
    private readonly routerService: RouterService,
    private readonly permissionContext: PermissionContext,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get canUpdateProject(): boolean {
    return this.permissionContext.canUpdateProject
  }

  public get hasDeletePermission(): boolean {
    return this.permissionContext.canDeleteProject
  }

  public get isPublic() {
    return this.context.isProjectPublic
  }

  public get projectName() {
    return this.context.projectName
  }

  public async setIsPublic(value: boolean) {
    const result = await this.updateRequest.fetch({
      data: {
        isPublic: value,
        projectName: this.context.projectName,
        organizationId: this.context.organizationId,
      },
    })

    if (result.isRight) {
      this.context.updateProject({ isPublic: value })
      toaster.info({
        duration: 1500,
        description: value ? 'Project is now public' : 'Project is now private',
      })
    }
  }

  public openDeleteDialog() {
    this.isDeleteDialogOpen = true
    this.deleteConfirmationText = ''
  }

  public closeDeleteDialog() {
    this.isDeleteDialogOpen = false
    this.deleteConfirmationText = ''
  }

  public setDeleteConfirmationText(text: string) {
    this.deleteConfirmationText = text
  }

  public get canDeleteProject(): boolean {
    return this.deleteConfirmationText === this.projectName
  }

  public async deleteProject(): Promise<void> {
    if (!this.canDeleteProject) {
      return
    }

    try {
      const result = await this.deleteRequest.fetch({
        data: {
          organizationId: this.context.organizationId,
          projectName: this.context.projectName,
        },
      })

      if (result.isRight) {
        this.closeDeleteDialog()
        await this.routerService.navigate('/')
      }
    } catch (e) {
      console.error(e)
    }
  }

  public init() {}

  public dispose() {
    this.updateRequest.abort()
    this.deleteRequest.abort()
  }
}

container.register(
  ProjectSettingsPageModel,
  () => {
    const context = container.get(ProjectContext)
    const router = container.get(RouterService)
    const permissionContext = container.get(PermissionContext)

    return new ProjectSettingsPageModel(context, router, permissionContext)
  },
  { scope: 'request' },
)
