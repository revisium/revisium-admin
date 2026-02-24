import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'

export interface CreateRowCommandDeps {
  mutationDataSource: RowMutationDataSource
  projectContext: ProjectContext
  tableId: string
}

export class CreateRowCommand {
  constructor(private readonly deps: CreateRowCommandDeps) {}

  public async execute(rowId: string, data: JsonValue): Promise<boolean> {
    const { mutationDataSource, projectContext, tableId } = this.deps

    try {
      const result = await mutationDataSource.createRow({
        revisionId: projectContext.revisionId,
        tableId,
        rowId,
        data,
      })

      if (result !== null) {
        if (!projectContext.touched) {
          projectContext.updateTouched(true)
        }
        return true
      }

      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
