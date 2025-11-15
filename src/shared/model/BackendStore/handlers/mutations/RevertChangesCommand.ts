import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { revertChangesMstRequest } from 'src/shared/model/BackendStore/api/revertChangesMstRequest.ts'

export class RevertChangesCommand {
  constructor(private readonly context: ProjectContext) {}

  private get organization() {
    return this.context.organization
  }

  private get project() {
    return this.context.project
  }

  private get branch() {
    return this.context.branch
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
