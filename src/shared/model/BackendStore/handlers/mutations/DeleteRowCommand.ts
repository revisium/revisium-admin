import { ITableModel } from 'src/shared/model/BackendStore'
import { deleteRowMstRequest } from 'src/shared/model/BackendStore/api/deleteRowMstRequest.ts'
import { TableMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/table.generated.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformTableFragment } from 'src/shared/model/BackendStore/utils/transformTableFragment.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class DeleteRowCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
  ) {}

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  private get table() {
    return this.projectPageModel.tableOrThrow
  }

  public async execute(rowId: string) {
    const { table, previousVersionTableId, isBranchTouched } = await this.updateRowRequest(rowId)

    const wasCreatedNewVersionTable = table && previousVersionTableId && table.versionId !== previousVersionTableId
    const wasRevertedDraftTable = !table

    if (wasCreatedNewVersionTable) {
      this.updateTablesConnection(table)
    }

    if (wasCreatedNewVersionTable) {
      await this.refetchRowsConnectionInDraftTable()
    } else {
      this.updateRowsConnectionInDraftTable(rowId)

      if (wasRevertedDraftTable) {
        await this.refetchDraftTables()
      }
    }

    this.branch.updateTouched(isBranchTouched)

    if (wasCreatedNewVersionTable) {
      this.projectPageModel.revalidateLoaders()
    }

    return true
  }

  private async updateRowRequest(rowId: string) {
    const result = await deleteRowMstRequest({
      data: { revisionId: this.branch.draft.id, tableId: this.table.id, rowId },
    })

    return {
      table: this.addVersionedTableToCache(result.removeRow?.table),
      previousVersionTableId: result.removeRow?.previousVersionTableId,
      isBranchTouched: result.removeRow.branch.touched,
    }
  }

  private addVersionedTableToCache(tableFragment: TableMstFragment | null | undefined) {
    return tableFragment ? this.addTableToCache(tableFragment) : null
  }

  private addTableToCache(tableFragment: TableMstFragment) {
    const responseTable = this.rootStore.cache.addOrTable(transformTableFragment(tableFragment))
    this.rootStore.cache.addTableByVariables(
      { revisionId: this.branch.draft.id, tableId: this.table.id },
      responseTable.versionId,
    )

    return responseTable
  }

  private updateTablesConnection(newVersionTable: ITableModel) {
    const draftRevision = this.branch.draft

    const draftTableEdge = draftRevision.tablesConnection.edges.find((edge) => edge.node.id === newVersionTable.id)

    if (draftTableEdge) {
      draftRevision.tablesConnection.replaceNode(draftTableEdge.cursor, newVersionTable)
    }
  }

  private async refetchDraftTables() {
    return this.rootStore.queryTables({ revisionId: this.branch.draft.id, first: 50 })
  }

  private async refetchRowsConnectionInDraftTable() {
    return this.rootStore.queryRows({ revisionId: this.branch.draft.id, tableId: this.table.id, first: 50 })
  }

  private updateRowsConnectionInDraftTable(rowId: string) {
    const draftTable = this.rootStore.cache.getTableByVariables({
      revisionId: this.branch.draft.id,
      tableId: this.table.id,
    })

    const rowEdge = draftTable?.rowsConnection.edges.find((edge) => edge.node.id === rowId)

    draftTable?.rowsConnection.removeEdge(rowEdge?.cursor)
  }
}
