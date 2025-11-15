import { Params } from 'react-router-dom'
import { getTableVariables } from 'src/app/lib/utils.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { NotFoundTable } from 'src/shared/errors/NotFoundTable.ts'
import { container } from 'src/shared/lib'
import { ITableModel } from 'src/shared/model/BackendStore'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const baseTableLoader = async (params: Params, revisionId: string): Promise<ITableModel> => {
  const tableVariables = getTableVariables(params, revisionId)

  const table =
    rootStore.cache.getTableByVariables(tableVariables) ||
    (await rootStore.queryTable({
      data: tableVariables,
    }))

  if (!table) {
    throw new NotFoundTable(params.tableId)
  }

  const context: ProjectContext = container.get(ProjectContext)
  context.setTable(table)

  if (!table.rowsConnection.countLoaded) {
    await rootStore.queryRows({ revisionId: revisionId, tableId: table.id, first: 50 })
  }

  return table
}
