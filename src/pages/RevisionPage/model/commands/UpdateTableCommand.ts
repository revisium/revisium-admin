import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'
import { RootNodeStore } from 'src/widgets/SchemaEditor/model/RootNodeStore.ts'

export interface UpdateTableCommandDeps {
  mutationDataSource: TableMutationDataSource
  tableListRefreshService: TableListRefreshService
  projectContext: ProjectContext
}

export class UpdateTableCommand {
  constructor(private readonly deps: UpdateTableCommandDeps) {}

  public async execute(store: RootNodeStore): Promise<boolean> {
    const { mutationDataSource, tableListRefreshService, projectContext } = this.deps

    try {
      const needRename = store.tableId !== store.draftTableId
      let wasRenamed = false
      let wasUpdated = false

      if (needRename) {
        const renameResult = await mutationDataSource.renameTable({
          revisionId: projectContext.revisionId,
          tableId: store.tableId,
          nextTableId: store.draftTableId,
        })

        if (!renameResult) {
          return false
        }

        wasRenamed = true
      }

      const patches = store.getPatches()

      if (patches.length) {
        const updateResult = await mutationDataSource.updateTable({
          revisionId: projectContext.revisionId,
          tableId: store.draftTableId,
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
