import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { BaseUpdateRowCommand } from 'src/shared/model/BackendStore/handlers/mutations/BaseUpdateRowCommand.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { FileService } from 'src/shared/model/FileService.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class UploadFileCommand extends BaseUpdateRowCommand {
  constructor(
    rootStore: IRootStore,
    projectPageModel: ProjectPageModel,
    private readonly fileService: FileService,
    private readonly store: RowDataCardStore,
  ) {
    super(rootStore, projectPageModel)
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

    const table = await this.rootStore.queryTable({
      data: { revisionId: this.branch.draft.id, tableId: this.table.id },
    })

    const row = await this.rootStore.queryRow({
      revisionId: this.branch.draft.id,
      tableId: this.table.id,
      rowId: this.row.id,
    })

    if (!table || !row) {
      throw new Error('Table or row not found')
    }

    return {
      table,
      previousVersionTableId: response.previousVersionTableId,
      row,
      previousVersionRowId: response.previousVersionRowId,
    }
  }
}
