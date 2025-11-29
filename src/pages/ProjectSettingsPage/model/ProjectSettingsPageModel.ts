import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { DeleteProjectCommand } from 'src/shared/model/BackendStore/handlers/mutations/DeleteProjectCommand.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'
import { RouterService } from 'src/shared/model/RouterService.ts'
import { toaster } from 'src/shared/ui'

export class ProjectSettingsPageModel {
  public isDeleteDialogOpen = false
  public deleteConfirmationText = ''

  private updateRequest = ObservableRequest.of(client.updateProject)

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
    return this.context.project.isPublic
  }

  public get projectName() {
    return this.context.project.name
  }

  public async setIsPublic(value: boolean) {
    const result = await this.updateRequest.fetch({
      data: {
        isPublic: value,
        projectName: this.context.project.name,
        organizationId: this.context.organization.id,
      },
    })

    if (result.isRight) {
      this.context.project.update({ isPublic: value })
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
      const command = new DeleteProjectCommand(rootStore, this.context.organization.id, this.context.project.name)
      await command.execute()
    } catch (e) {
      console.error(e)
    }

    this.closeDeleteDialog()

    await this.routerService.navigate('/')
  }

  public init() {}

  public dispose() {}
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
