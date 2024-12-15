import { Params } from 'react-router-dom'
import { getTableVariables } from 'src/app/lib/utils.ts'
import { NotFoundTable } from 'src/shared/errors/NotFoundTable.ts'
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

  if (!table.rowsConnection.countLoaded) {
    await rootStore.queryRows({ revisionId: revisionId, tableId: table.id, first: 50 })
  }

  return table
}
