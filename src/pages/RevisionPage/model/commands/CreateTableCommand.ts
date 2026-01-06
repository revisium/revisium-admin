import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonSchema } from 'src/entities/Schema'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'

export interface CreateTableCommandDeps {
  mutationDataSource: TableMutationDataSource
  tableListRefreshService: TableListRefreshService
  projectContext: ProjectContext
}

export class CreateTableCommand {
  constructor(private readonly deps: CreateTableCommandDeps) {}

  public async execute(tableId: string, schema: JsonSchema): Promise<boolean> {
    const { mutationDataSource, tableListRefreshService, projectContext } = this.deps
    const branch = projectContext.branch

    try {
      const result = await mutationDataSource.createTable({
        revisionId: branch.draft.id,
        tableId,
        schema,
      })

      if (result !== null) {
        if (!branch.touched) {
          projectContext.updateTouched(true)
        }
        tableListRefreshService.refresh()
        return true
      }

      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
