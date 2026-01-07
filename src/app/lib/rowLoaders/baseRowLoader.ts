import { Params } from 'react-router-dom'
import { getRowVariables } from 'src/app/lib/utils.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { RowDataSource, RowLoaderData } from 'src/entities/Row'
import { NotFoundRow } from 'src/shared/errors/NotFoundRow.ts'
import { container } from 'src/shared/lib'

export interface RowLoaderResult extends RowLoaderData {
  foreignKeysCount: number
}

export const baseRowLoader = async (params: Params, revisionId: string): Promise<RowLoaderResult> => {
  const variables = getRowVariables(params, revisionId)
  const rowDataSource = container.get(RowDataSource)
  const context = container.get(ProjectContext)

  const [row, foreignKeysCount] = await Promise.all([
    rowDataSource.getRow(variables.revisionId, variables.tableId, variables.rowId),
    rowDataSource.getRowCountForeignKeysTo(variables.revisionId, variables.tableId, variables.rowId),
  ])

  if (!row) {
    throw new NotFoundRow(params.rowId)
  }

  const result: RowLoaderResult = { ...row, foreignKeysCount }
  context.setRow(result)

  return result
}
