import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { RowListRefreshService } from 'src/widgets/RowList/model/RowListRefreshService.ts'

export interface CreateRowCommandDeps {
  mutationDataSource: RowMutationDataSource
  rowListRefreshService: RowListRefreshService
  projectContext: ProjectContext
  tableId: string
}

export class CreateRowCommand {
  constructor(private readonly deps: CreateRowCommandDeps) {}

  public async execute(rowId: string, data: JsonValue): Promise<boolean> {
    const { mutationDataSource, rowListRefreshService, projectContext, tableId } = this.deps
    const branch = projectContext.branch

    try {
      const result = await mutationDataSource.createRow({
        revisionId: branch.draft.id,
        tableId,
        rowId,
        data,
      })

      if (result !== null) {
        if (!branch.touched) {
          projectContext.updateTouched(true)
        }
        rowListRefreshService.refresh()
        return true
      }

      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
