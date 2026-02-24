import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'

export interface UpdateRowCommandDeps {
  mutationDataSource: RowMutationDataSource
  projectContext: ProjectContext
  tableId: string
}

export interface UpdateRowCommandParams {
  currentRowId: string
  originalRowId: string
  data: JsonValue
  isRowIdChanged: boolean
  isDirty: boolean
}

export class UpdateRowCommand {
  constructor(private readonly deps: UpdateRowCommandDeps) {}

  public async execute(params: UpdateRowCommandParams): Promise<boolean> {
    const { mutationDataSource, projectContext, tableId } = this.deps
    const { currentRowId, originalRowId, data, isRowIdChanged, isDirty } = params

    try {
      if (isRowIdChanged) {
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

      if (isDirty) {
        const updateResult = await mutationDataSource.updateRow({
          revisionId: projectContext.revisionId,
          tableId,
          rowId: currentRowId,
          data,
        })

        if (!updateResult) {
          return false
        }
      }

      if (isRowIdChanged || isDirty) {
        if (!projectContext.touched) {
          projectContext.updateTouched(true)
        }
      }

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
