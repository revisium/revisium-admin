import { makeAutoObservable } from 'mobx'
import { AuthService } from 'src/shared/model'
import { CreateProjectCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateProjectCommand.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'

export class CreateProjectModel {
  public projectName = ''
  public branchName = ''
  public fromRevisionId = ''
  public showingSettings = false

  public constructor(
    private readonly rootStore: IRootStore,
    private readonly authService: AuthService,
  ) {
    makeAutoObservable(this)
  }

  private get organizationId() {
    const organizationId = this.authService.user?.organizationId

    if (!organizationId) {
      throw new Error('Not found organizationId')
    }

    return organizationId
  }

  public setProjectName(value: string): void {
    this.projectName = value
  }

  public setBranchName(value: string): void {
    this.branchName = value
  }

  public setFromRevisionId(value: string): void {
    this.fromRevisionId = value
  }

  public setShowingSettings(value: boolean) {
    this.showingSettings = value
  }

  public async create() {
    try {
      const command = new CreateProjectCommand(
        this.rootStore,
        this.organizationId,
        this.projectName,
        this.branchName,
        this.fromRevisionId,
      )

      await command.execute()
    } catch (e) {
      console.error(e)
    }
  }

  public init() {}

  public dispose() {}
}
