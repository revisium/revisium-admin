import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { IRowModel, ITableModel } from 'src/shared/model/BackendStore'
import { RowMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/row.generated.ts'
import { TableMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/table.generated.ts'
import { updateRowMstRequest } from 'src/shared/model/BackendStore/api/updateRowMstRequest.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformRowFragment } from 'src/shared/model/BackendStore/utils/transformRowFragment.ts'
import { transformTableFragment } from 'src/shared/model/BackendStore/utils/transformTableFragment.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class UpdateRowCommand {
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

  private get row() {
    return this.projectPageModel.rowOrThrow
  }

  public async execute(data: JsonValue) {
    const { table, previousVersionTableId, row, previousVersionRowId } = await this.updateRowRequest(data)

    const wasCreatedNewVersionTable = table.versionId !== previousVersionTableId
    if (wasCreatedNewVersionTable) {
      this.updateTablesConnection(table)
    }

    const wasCreatedNewVersionRow = row.versionId !== previousVersionRowId
    if (wasCreatedNewVersionRow) {
      this.updateRowsConnection(table, row)
    }

    if (!this.branch.touched) {
      this.branch.updateTouched(true)
    }

    if (wasCreatedNewVersionTable || wasCreatedNewVersionRow) {
      this.projectPageModel.revalidateLoaders()
    }

    return true
  }

  private async updateRowRequest(data: JsonValue) {
    const response = await updateRowMstRequest({
      data: { revisionId: this.branch.draft.id, tableId: this.table.id, rowId: this.row.id, data },
    })

    return {
      table: this.addVersionedTableToCache(response.updateRow.table),
      previousVersionTableId: response.updateRow.previousVersionTableId,
      row: this.addVersionedRowToCache(response.updateRow.row),
      previousVersionRowId: response.updateRow.previousVersionRowId,
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

  private addVersionedRowToCache(rowFragment: RowMstFragment) {
    return this.addRowToCache(rowFragment)
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

  private updateRowsConnection(newVersionTable: ITableModel, newVersionRow: IRowModel) {
    const draftRowEdge = newVersionTable.rowsConnection.edges.find((edge) => edge.node.id === newVersionRow.id)

    if (draftRowEdge) {
      newVersionTable.rowsConnection.replaceNode(draftRowEdge.cursor, newVersionRow)
    }
  }
}
