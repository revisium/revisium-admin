import { IBranchModel } from 'src/shared/model/BackendStore'
import { TableMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/table.generated.ts'
import { renameTableMstRequest } from 'src/shared/model/BackendStore/api/renameTableMstRequest.ts'
import { updateTableMstRequest } from 'src/shared/model/BackendStore/api/updateTableMstRequest.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformTableFragment } from 'src/shared/model/BackendStore/utils/transformTableFragment.ts'
import { RootNodeStore } from 'src/widgets/SchemaEditor'

export class UpdateTableCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly branch: IBranchModel,
    private readonly store: RootNodeStore,
  ) {}

  public async execute() {
    const wasCreatedNewVersionTable = await this.updateTableRequest()

    this.resetRowsConnectionCache()

    if (!this.branch.touched) {
      this.branch.updateTouched(true)
    }

    if (wasCreatedNewVersionTable) {
      await this.refetchTablesConnection()
    }
  }

  private async updateTableRequest() {
    let wasCreatedNewVersionTable = false

    if (this.store.tableId !== this.store.draftTableId) {
      const response = await renameTableMstRequest({
        data: {
          revisionId: this.branch.draft.id,
          tableId: this.store.tableId,
          nextTableId: this.store.draftTableId,
        },
      })

      this.addVersionedTableToCache(response.renameTable.table)

      wasCreatedNewVersionTable = true
    }

    const patches = this.store.getPatches()

    if (patches.length) {
      const response = await updateTableMstRequest({
        data: { revisionId: this.branch.draft.id, tableId: this.store.draftTableId, patches: this.store.getPatches() },
      })

      const table = this.addVersionedTableToCache(response.updateTable.table)
      const previousVersionTableId = response.updateTable.previousVersionTableId

      wasCreatedNewVersionTable = wasCreatedNewVersionTable || table.versionId !== previousVersionTableId
    }

    return wasCreatedNewVersionTable
  }

  private addVersionedTableToCache(tableFragment: TableMstFragment) {
    return this.addTableToCache(tableFragment)
  }

  private addTableToCache(tableFragment: TableMstFragment) {
    const responseTable = this.rootStore.cache.addOrTable(transformTableFragment(tableFragment))
    this.rootStore.cache.addTableByVariables(
      { revisionId: this.branch.draft.id, tableId: this.store.draftTableId },
      responseTable.versionId,
    )

    return responseTable
  }

  private resetRowsConnectionCache() {
    const table = this.rootStore.cache.getTableByVariables({
      tableId: this.store.draftTableId,
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
