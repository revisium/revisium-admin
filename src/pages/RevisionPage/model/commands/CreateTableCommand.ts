import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonSchema } from 'src/entities/Schema'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'
import type { SchemaEditorVM } from '@revisium/schema-toolkit-ui'

export interface CreateTableCommandDeps {
  mutationDataSource: TableMutationDataSource
  tableListRefreshService: TableListRefreshService
  projectContext: ProjectContext
}

export class CreateTableCommand {
  constructor(private readonly deps: CreateTableCommandDeps) {}

  public async execute(viewModel: SchemaEditorVM): Promise<boolean> {
    const { mutationDataSource, tableListRefreshService, projectContext } = this.deps
    try {
      const result = await mutationDataSource.createTable({
        revisionId: projectContext.revisionId,
        tableId: viewModel.tableId,
        schema: viewModel.getPlainSchema() as unknown as JsonSchema,
      })

      if (result !== null) {
        if (!projectContext.touched) {
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
