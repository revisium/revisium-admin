import { Params } from 'react-router-dom'
import { getRowVariables } from 'src/app/lib/utils.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { RowDataSource, RowLoaderData } from 'src/entities/Row'
import { NotFoundRow } from 'src/shared/errors/NotFoundRow.ts'
import { container } from 'src/shared/lib'

export const baseRowLoader = async (params: Params, revisionId: string): Promise<RowLoaderData> => {
  const variables = getRowVariables(params, revisionId)
  const rowDataSource = container.get(RowDataSource)
  const context = container.get(ProjectContext)

  const row = await rowDataSource.getRow(variables.revisionId, variables.tableId, variables.rowId)

  if (!row) {
    throw new NotFoundRow(params.rowId)
  }

  context.setRow(row)

  return row
}
