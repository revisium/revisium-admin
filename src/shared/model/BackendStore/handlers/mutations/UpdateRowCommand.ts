import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { renameRowMstRequest } from 'src/shared/model/BackendStore/api/renameRowMstRequest.ts'
import { updateRowMstRequest } from 'src/shared/model/BackendStore/api/updateRowMstRequest.ts'
import { BaseUpdateRowCommand } from 'src/shared/model/BackendStore/handlers/mutations/BaseUpdateRowCommand.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class UpdateRowCommand extends BaseUpdateRowCommand {
  constructor(
    rootStore: IRootStore,
    projectPageModel: ProjectPageModel,
    private readonly store: RowDataCardStore,
  ) {
    super(rootStore, projectPageModel)
  }

  public async execute() {
    let needToRevalidateLoaders = false
    let wasRenamedRow = false

    if (this.row.id !== this.store.name.value) {
      await this.renameRowRequest()

      needToRevalidateLoaders = true
      wasRenamedRow = true
    }

    if (this.store.root.touched) {
      const { wasCreatedNewVersionTable, wasCreatedNewVersionRow } = await this.updateRowProcess()
      needToRevalidateLoaders = needToRevalidateLoaders || wasCreatedNewVersionTable || wasCreatedNewVersionRow
    }

    if (!this.branch.touched) {
      this.branch.updateTouched(true)
    }

    if (wasRenamedRow) {
      this.branch.draft.tablesConnection.reset()
    }

    if (needToRevalidateLoaders) {
      this.projectPageModel.revalidateLoaders()
    }

    return true
  }

  private async updateRowProcess() {
    const { table, previousVersionTableId, row, previousVersionRowId } = await this.updateRowRequest(
      this.store.root.getPlainValue(),
    )

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

  private async renameRowRequest() {
    const response = await renameRowMstRequest({
      data: {
        revisionId: this.branch.draft.id,
        tableId: this.table.id,
        rowId: this.row.id,
        nextRowId: this.store.name.getPlainValue(),
      },
    })

    return {
      table: this.addVersionedTableToCache(response.renameRow.table),
      previousVersionTableId: response.renameRow.previousVersionTableId,
      row: this.addVersionedRowToCache(response.renameRow.row),
      previousVersionRowId: response.renameRow.previousVersionRowId,
    }
  }

  private async updateRowRequest(data: JsonValue) {
    const response = await updateRowMstRequest({
      data: { revisionId: this.branch.draft.id, tableId: this.table.id, rowId: this.store.name.getPlainValue(), data },
    })

    return {
      table: this.addVersionedTableToCache(response.updateRow.table),
      previousVersionTableId: response.updateRow.previousVersionTableId,
      row: this.addVersionedRowToCache(response.updateRow.row),
      previousVersionRowId: response.updateRow.previousVersionRowId,
    }
  }
}
