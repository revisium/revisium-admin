import { revertChangesMstRequest } from 'src/shared/model/BackendStore/api/revertChangesMstRequest.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class RevertChangesCommand {
  constructor(private readonly projectPageModel: ProjectPageModel) {}

  private get organization() {
    return this.projectPageModel.organization
  }

  private get project() {
    return this.projectPageModel.project
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  public async execute() {
    await this.revertChangesRequest()

    this.resetTablesConnection()

    this.branch.updateTouched(false)

    // TEMP fix until separate revert revision page
    globalThis.location.reload()

    return true
  }

  private revertChangesRequest() {
    return revertChangesMstRequest({
      data: { organizationId: this.organization.id, projectName: this.project.name, branchName: this.branch.name },
    })
  }

  private resetTablesConnection() {
    this.branch.draft.tablesConnection.reset()
  }
}
