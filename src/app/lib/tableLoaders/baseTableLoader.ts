import { Params } from 'react-router-dom'
import { getTableVariables } from 'src/app/lib/utils.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { TableDataSource, TableLoaderData } from 'src/entities/Table'
import { NotFoundTable } from 'src/shared/errors/NotFoundTable.ts'
import { container } from 'src/shared/lib'

export const baseTableLoader = async (params: Params, revisionId: string): Promise<TableLoaderData> => {
  const tableVariables = getTableVariables(params, revisionId)
  const tableDataSource = container.get(TableDataSource)
  const context = container.get(ProjectContext)

  const table = await tableDataSource.getTable(tableVariables.revisionId, tableVariables.tableId)

  if (!table) {
    throw new NotFoundTable(params.tableId)
  }

  context.setTable(table)

  return table
}
