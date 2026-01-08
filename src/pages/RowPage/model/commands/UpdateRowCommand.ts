import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { RowListRefreshService } from 'src/widgets/RowList/model/RowListRefreshService.ts'

export interface UpdateRowCommandDeps {
  mutationDataSource: RowMutationDataSource
  rowListRefreshService: RowListRefreshService
  projectContext: ProjectContext
  tableId: string
}

export class UpdateRowCommand {
  constructor(private readonly deps: UpdateRowCommandDeps) {}

  public async execute(store: RowDataCardStore, originalRowId: string): Promise<boolean> {
    const { mutationDataSource, rowListRefreshService, projectContext, tableId } = this.deps

    try {
      const currentRowId = store.name.getPlainValue()
      const needsRename = currentRowId !== originalRowId
      const needsUpdate = store.root.touched

      if (needsRename) {
        const renameResult = await mutationDataSource.renameRow({
          revisionId: projectContext.revisionId,
          tableId,
          rowId: originalRowId,
          nextRowId: currentRowId,
        })

        if (!renameResult) {
          return false
        }
      }

      if (needsUpdate) {
        const updateResult = await mutationDataSource.updateRow({
          revisionId: projectContext.revisionId,
          tableId,
          rowId: currentRowId,
          data: store.root.getPlainValue(),
        })

        if (!updateResult) {
          return false
        }
      }

      if (needsRename || needsUpdate) {
        if (!projectContext.touched) {
          projectContext.updateTouched(true)
        }
        rowListRefreshService.refresh()
      }

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
