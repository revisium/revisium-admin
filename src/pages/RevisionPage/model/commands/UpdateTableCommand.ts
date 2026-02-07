import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonPatch } from 'src/entities/Schema/types/json-patch.types.ts'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'
import type { UpdatingEditorVM } from '@revisium/schema-toolkit-ui'

export interface UpdateTableCommandDeps {
  mutationDataSource: TableMutationDataSource
  tableListRefreshService: TableListRefreshService
  projectContext: ProjectContext
}

export class UpdateTableCommand {
  constructor(private readonly deps: UpdateTableCommandDeps) {}

  public async execute(viewModel: UpdatingEditorVM): Promise<boolean> {
    const { mutationDataSource, tableListRefreshService, projectContext } = this.deps

    try {
      const needRename = viewModel.isTableIdChanged
      let wasRenamed = false
      let wasUpdated = false

      if (needRename) {
        const renameResult = await mutationDataSource.renameTable({
          revisionId: projectContext.revisionId,
          tableId: viewModel.initialTableId,
          nextTableId: viewModel.tableId,
        })

        if (!renameResult) {
          return false
        }

        wasRenamed = true
      }

      const patches = viewModel.getJsonPatches() as unknown as JsonPatch[]

      if (patches.length) {
        const updateResult = await mutationDataSource.updateTable({
          revisionId: projectContext.revisionId,
          tableId: viewModel.tableId,
          patches,
        })

        if (!updateResult) {
          return false
        }

        wasUpdated = true
      }

      if ((wasRenamed || wasUpdated) && !projectContext.touched) {
        projectContext.updateTouched(true)
      }

      if (wasRenamed || wasUpdated) {
        tableListRefreshService.refresh()
      }

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
