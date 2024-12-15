import { JsonPatch } from 'src/entities/Schema/types/json-patch.types.ts'
import { IBranchModel } from 'src/shared/model/BackendStore'
import { TableMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/table.generated.ts'
import { updateTableMstRequest } from 'src/shared/model/BackendStore/api/updateTableMstRequest.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformTableFragment } from 'src/shared/model/BackendStore/utils/transformTableFragment.ts'

export class UpdateTableCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly branch: IBranchModel,
    private readonly tableId: string,
    private readonly patches: JsonPatch[],
  ) {}

  public async execute() {
    const { table, previousVersionTableId } = await this.updateTableRequest()

    this.resetRowsConnectionCache()

    if (!this.branch.touched) {
      this.branch.updateTouched(true)
    }

    const wasCreatedNewVersionTable = table.versionId !== previousVersionTableId

    if (wasCreatedNewVersionTable) {
      await this.refetchTablesConnection()
    }
  }

  private async updateTableRequest() {
    const response = await updateTableMstRequest({
      data: { revisionId: this.branch.draft.id, tableId: this.tableId, patches: this.patches },
    })

    return {
      table: this.addVersionedTableToCache(response.updateTable.table),
      previousVersionTableId: response.updateTable.previousVersionTableId,
    }
  }

  private addVersionedTableToCache(tableFragment: TableMstFragment) {
    return this.addTableToCache(tableFragment)
  }

  private addTableToCache(tableFragment: TableMstFragment) {
    const responseTable = this.rootStore.cache.addOrTable(transformTableFragment(tableFragment))
    this.rootStore.cache.addTableByVariables(
      { revisionId: this.branch.draft.id, tableId: this.tableId },
      responseTable.versionId,
    )

    return responseTable
  }

  private resetRowsConnectionCache() {
    const table = this.rootStore.cache.getTableByVariables({
      tableId: this.tableId,
      revisionId: this.branch.draft.id,
    })

    if (table) {
      table.rowsConnection.reset()
    }
  }

  private async refetchTablesConnection() {
    await this.rootStore.queryTables({ revisionId: this.branch.draft.id, first: 50 })
  }
}
