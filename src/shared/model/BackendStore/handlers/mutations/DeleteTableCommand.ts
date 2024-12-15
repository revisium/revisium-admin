import { deleteTableMstRequest } from 'src/shared/model/BackendStore/api/deleteTableMstRequest.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class DeleteTableCommand {
  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly tableId: string,
  ) {}

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  public async execute() {
    const isBranchTouched = await this.deleteTableRequest()

    await this.updateTablesConnection()

    this.branch.updateTouched(isBranchTouched)

    return true
  }

  private async deleteTableRequest() {
    const result = await deleteTableMstRequest({ data: { revisionId: this.branch.draft.id, tableId: this.tableId } })

    return result.removeTable.branch.touched
  }

  private async updateTablesConnection() {
    const revision = this.branch.draft
    const tableEdge = revision.tablesConnection.edges.find((edge) => edge.node.id === this.tableId)
    revision.tablesConnection.removeEdge(tableEdge?.cursor)
  }
}
