import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { IRowModel, ITableModel } from 'src/shared/model/BackendStore'
import { RowMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/row.generated.ts'
import { TableMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/table.generated.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformRowFragment } from 'src/shared/model/BackendStore/utils/transformRowFragment.ts'
import { transformTableFragment } from 'src/shared/model/BackendStore/utils/transformTableFragment.ts'
import { FileService } from 'src/shared/model/FileService.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class UploadFileCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
    private readonly fileService: FileService,
    private readonly store: RowDataCardStore,
  ) {}

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  private get table() {
    return this.projectPageModel.tableOrThrow
  }

  public async execute(fileId: string, file: File) {
    let needToRevalidateLoaders = false

    const { wasCreatedNewVersionTable, wasCreatedNewVersionRow } = await this.uploadFileProcess(fileId, file)
    needToRevalidateLoaders = needToRevalidateLoaders || wasCreatedNewVersionTable || wasCreatedNewVersionRow

    if (!this.branch.touched) {
      this.branch.updateTouched(true)
    }

    if (needToRevalidateLoaders) {
      this.projectPageModel.revalidateLoaders()
    }

    return true
  }

  private async uploadFileProcess(fileId: string, file: File) {
    const { table, previousVersionTableId, row, previousVersionRowId } = await this.uploadFileRequest(fileId, file)

    const wasCreatedNewVersionTable = table.versionId !== previousVersionTableId
    if (wasCreatedNewVersionTable) {
      this.updateTablesConnection(table)
    }

    const wasCreatedNewVersionRow = row.versionId !== previousVersionRowId
    if (wasCreatedNewVersionRow) {
      this.updateRowsConnection(table, row)
    }

    return {
      wasCreatedNewVersionTable,
      wasCreatedNewVersionRow,
    }
  }

  private async uploadFileRequest(fileId: string, file: File) {
    const response = await this.fileService.add({
      revisionId: this.branch.draft.id,
      tableId: this.table.id,
      rowId: this.store.name.getPlainValue(),
      fileId,
      file,
    })

    return {
      table: this.addVersionedTableToCache(response.table),
      previousVersionTableId: response.previousVersionTableId,
      row: this.addVersionedRowToCache(response.row),
      previousVersionRowId: response.previousVersionRowId,
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
