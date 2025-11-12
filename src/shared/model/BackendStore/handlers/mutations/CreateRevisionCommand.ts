import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'
import { createRevisionMstRequest } from 'src/shared/model/BackendStore/api/createRevisionMstRequest.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { addBranchFragmentToCache } from 'src/shared/model/BackendStore/utils/addBranchFragmentToCache.ts'

export class CreateRevisionCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly context: ProjectContext,
    private readonly comment: string,
  ) {}

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
    const branchFragment = await this.createRevisionRequest()

    this.lockTablesAndRowsInRevision()

    const branch = addBranchFragmentToCache(this.rootStore.cache, branchFragment)

    if (branch.head.parent) {
      await this.queryPreviousHead(branch.head.parent)
    }

    // TEMP fix until separate create revision page
    globalThis.location.reload()

    return true
  }

  private async createRevisionRequest() {
    const result = await createRevisionMstRequest({
      data: {
        organizationId: this.organization.id,
        projectName: this.project.name,
        branchName: this.branch.name,
        comment: this.comment,
      },
    })

    return result.createRevision.branch
  }

  private lockTablesAndRowsInRevision() {
    const revision = this.branch.draft

    revision.tablesConnection.edges.forEach(({ node: tableNode }) => {
      tableNode.update({ readonly: true })
      tableNode.rowsConnection.edges.forEach(({ node: rowNode }) => {
        rowNode.update({ readonly: true })
      })
    })
  }

  private queryPreviousHead(revision: IRevisionModel) {
    return this.rootStore.backend.queryRevision({
      revisionId: revision.id,
    })
  }
}
