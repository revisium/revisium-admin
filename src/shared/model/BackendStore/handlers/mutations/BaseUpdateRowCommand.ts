import { IRowModel, ITableModel } from 'src/shared/model/BackendStore'
import { RowMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/row.generated.ts'
import { TableMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/table.generated.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformRowFragment } from 'src/shared/model/BackendStore/utils/transformRowFragment.ts'
import { transformTableFragment } from 'src/shared/model/BackendStore/utils/transformTableFragment.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class BaseUpdateRowCommand {
  constructor(
    protected readonly rootStore: IRootStore,
    protected readonly projectPageModel: ProjectPageModel,
  ) {}

  protected get branch() {
    return this.projectPageModel.branchOrThrow
  }

  protected get table() {
    return this.projectPageModel.tableOrThrow
  }

  protected get row() {
    return this.projectPageModel.rowOrThrow
  }

  protected addVersionedTableToCache(tableFragment: TableMstFragment) {
    return this.addTableToCache(tableFragment)
  }

  protected addTableToCache(tableFragment: TableMstFragment) {
    const responseTable = this.rootStore.cache.addOrTable(transformTableFragment(tableFragment))
    this.rootStore.cache.addTableByVariables(
      {
        revisionId: this.branch.draft.id,
        tableId: this.table.id,
      },
      responseTable.versionId,
    )

    return responseTable
  }

  protected addVersionedRowToCache(rowFragment: RowMstFragment) {
    return this.addRowToCache(rowFragment)
  }

  protected addRowToCache(rowFragment: RowMstFragment) {
    const responseRow = this.rootStore.cache.addRow(transformRowFragment(rowFragment))
    this.rootStore.cache.addRowByVariables(
      {
        revisionId: this.branch.draft.id,
        tableId: this.table.id,
        rowId: responseRow.id,
      },
      responseRow.versionId,
    )

    return responseRow
  }

  protected updateTablesConnection(newVersionTable: ITableModel) {
    const draftRevision = this.branch.draft

    const draftTableEdge = draftRevision.tablesConnection.edges.find((edge) => edge.node.id === newVersionTable.id)

    if (draftTableEdge) {
      draftRevision.tablesConnection.replaceNode(draftTableEdge.cursor, newVersionTable)
    }
  }

  protected updateRowsConnection(newVersionTable: ITableModel, newVersionRow: IRowModel) {
    const draftRowEdge = newVersionTable.rowsConnection.edges.find((edge) => edge.node.id === newVersionRow.id)

    if (draftRowEdge) {
      newVersionTable.rowsConnection.replaceNode(draftRowEdge.cursor, newVersionRow)
    }
  }
}
