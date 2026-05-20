import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { CreateRowResult, RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'

export interface CreateRowCommandDeps {
  mutationDataSource: RowMutationDataSource
  projectContext: ProjectContext
  tableId: string
}

export class CreateRowCommand {
  constructor(private readonly deps: CreateRowCommandDeps) {}

  public async execute(rowId: string, data: JsonValue): Promise<CreateRowResult | null> {
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
        return result
      }

      return null
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
