import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { IBranchModel, ITableModel } from 'src/shared/model/BackendStore'
import { createRowMstRequest } from 'src/shared/model/BackendStore/api/createRowMstRequest.ts'
import { RowMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/row.generated.ts'
import { TableMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/table.generated.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformRowFragment } from 'src/shared/model/BackendStore/utils/transformRowFragment.ts'
import { transformTableFragment } from 'src/shared/model/BackendStore/utils/transformTableFragment.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class CreateRowCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
    // TODO from projectPageModel?
    private readonly branch: IBranchModel,
    private readonly table: ITableModel,
  ) {}

  public async execute(rowId: string, data: JsonValue) {
    const { table, previousVersionTableId, row } = await this.createRowRequest(rowId, data)

    const wasCreatedNewVersionTable = table.versionId !== previousVersionTableId
    if (wasCreatedNewVersionTable) {
      this.updateTablesConnection(table)
    }

    await this.refetchRowsConnection()

    if (!this.branch.touched) {
      this.branch.updateTouched(true)
    }

    if (wasCreatedNewVersionTable) {
      this.projectPageModel.revalidateLoaders()
    }

    return row
  }

  private async createRowRequest(rowId: string, data: JsonValue) {
    const response = await createRowMstRequest({
      data: { revisionId: this.branch.draft.id, tableId: this.table.id, rowId, data },
    })

    return {
      table: this.addVersionedTableToCache(response.createRow.table),
      previousVersionTableId: response.createRow.previousVersionTableId,
      row: this.addRowToCache(response.createRow.row),
    }
  }

  private addVersionedTableToCache(tableFragment: TableMstFragment) {
    return this.addTableToCache(tableFragment)
  }

  private addTableToCache(tableFragment: TableMstFragment) {
    const responseTable = this.rootStore.cache.addOrTable(transformTableFragment(tableFragment))
    this.rootStore.cache.addTableByVariables(
      { revisionId: this.branch.draft.id, tableId: this.table.id },
      responseTable.versionId,
    )

    return responseTable
  }

  private addRowToCache(rowFragment: RowMstFragment) {
    const responseRow = this.rootStore.cache.addRow(transformRowFragment(rowFragment))
    this.rootStore.cache.addRowByVariables(
      { revisionId: this.branch.draft.id, tableId: this.table.id, rowId: responseRow.id },
      responseRow.versionId,
    )

    return responseRow
  }

  private updateTablesConnection(newVersionTable: ITableModel) {
    const draftRevision = this.branch.draft

    const draftTableEdge = draftRevision.tablesConnection.edges.find((edge) => edge.node.id === newVersionTable.id)

    if (draftTableEdge) {
      draftRevision.tablesConnection.replaceNode(draftTableEdge.cursor, newVersionTable)
    }
  }

  private async refetchRowsConnection() {
    return this.rootStore.queryRows({ revisionId: this.branch.draft.id, tableId: this.table.id, first: 50 })
  }
}
